#!/usr/bin/env python3
"""Generate placeholder dialogue with ElevenLabs.

Reads the API key from the ELEVENLABS_API_KEY environment variable (never hard-code it).
For every scene*.html and scenes/*.js, it takes the spoken lines (who + Greek text, in order)
and writes audio/<sceneNN>/<line number>.mp3. Then run build.py to embed the clips into dist/.

Usage:
  python3 tools/gen_voices.py            # all scenes, skips clips that already exist
  python3 tools/gen_voices.py scene02    # one scene
  python3 tools/gen_voices.py --count    # characters still to generate vs. your quota (no API cost)
  python3 tools/gen_voices.py --list     # list the voices on your account (to fill VOICES below)
  python3 tools/gen_voices.py --show     # print the text TTS will get where it differs from the script (accents on CAPS)
  python3 tools/gen_voices.py --verify   # re-check every existing clip with speech-to-text, regenerate the ones that fail

Every new take is transcribed with ElevenLabs speech-to-text (scribe_v2) and compared with the script
(wrong words, wrong stress, hallucinated tails). A take that fails is redone, up to MAX_TAKES, and the best one is kept.
Results go to audio/stt_report.json.
"""
import json, os, pathlib, re, sys, threading, time, unicodedata, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = pathlib.Path(__file__).resolve().parent.parent
# another episode: --episode episode2 (a folder next to episode1 with its own scenes/ and audio/)
if '--episode' in sys.argv:
    _i = sys.argv.index('--episode'); HERE = HERE.parent / sys.argv[_i + 1]; del sys.argv[_i:_i + 2]
API = 'https://api.elevenlabs.io/v1'
MODEL = 'eleven_v3'   # speaks Greek with a Greek accent (multilingual_v2 kept the voices' English accent)
LANGUAGE = 'el'

# character -> ElevenLabs voice_id. All native Greek voices from the Voice Library (language: el), chosen by audition
# (6 candidates x 2 lines per role, every take checked with speech-to-text). See docs/show-bible.md for the why.
VOICES = {
    'narrator': 'n0vzWypeCK1NlWPVwhOc',  # Theos: broadcast-TV narrator, low and assertive (trailer V.O.)
    'giannos': 'TN3alZndDSA8GYZSOf3r',   # Georgios: young, conversational, calm and reassuring (the father figure)
    'mimis': '5DAtyqt3LGjv9jkjNVFd',     # Eugene: expressive but calm (deadpan kamikaze)
    'giorgos': '9xjHNaV3YwyHqzzgRuXl',   # KonstantinosN: ad voice, anchorman delivery (the salesman CEO)
    'christos': '20zUtLxCwVzsFDWub4sB',  # Stefanos: young Athenian, calm and soft, slow (laid-back mangaka)
    'kostas': 'ejJ1ETWS2ohLMMeCu1H3',    # Atlas: expressive, a bit metallic (Κώστας)
    'panik': 'ejJ1ETWS2ohLMMeCu1H3',     # Atlas again at stability 0 (Κώστας as Panik)
    'vasilis': 'QnPbsq4pmOZkrE4RQQCA',   # Nikos: old, deep, resonant (zero-fucks calm)
    'vangelio': '4hx4668A4ljDTKS4m5oV',  # Crhysa: lively, loud and clear (iron-hand mother)
    'maria': 'Jv2zcgjn9Qu0uNMKJjb1',     # Madlen: young, casual (sarcastic sister)
    'myrsini': 'mRTQIE2xdk2oMdoKFGJu',   # Aria: smooth and warm, lively intonation (the nice hostess)
    'sita': '0oYUKTNPbymIKVAkDQqh',      # Sofia: TV spots / telemarketing voice
    # Episode 2
    'neos': '2KCRgZhHPaecTJfl6gAl',      # Yiannis: young, bright, friendly (Γιώργος's young soldier)
    'odigos': 'aiLoXPalsEy9XgwZza9g',    # Spyros: Athenian, casual (the Jumbo truck driver)
    'tv': '0ZJ6CiTzPB5e41TNRP12',        # Menelaos: commercial, corporate (the τηλεπώληση presenter)
    'ypallilos': '7zX8JTvUEpro0z0ytIAD',  # Andy: calm, flat (the Jumbo Κορίνθου clerk)
}
# per-character delivery. eleven_v3 only takes stability 0 (creative), .5 (natural) or 1 (robust).
SETTINGS = {'default': {'stability': .5, 'similarity_boost': .8},
            'panik': {'stability': 0, 'similarity_boost': .8}}
SHOUTY = {'sita', 'tv'}   # stability 0 for lines with '!' or CAPS (the 200% TV-shop voice), .5 for the cold, quiet ones
# per-episode cast changes: <episode>/voices.json = {"voices": {who: voice_id}, "prefix": {who: "[slurring] "}, "shouty": [who, ...]}
# (a prefix is an eleven_v3 audio tag sent before the text; it is not spoken and not part of the speech-to-text check)
PREFIX, SIMPLE, LINE_TAG = {}, set(), {}
if (HERE / 'voices.json').exists():
    _ep = json.loads((HERE / 'voices.json').read_text(encoding='utf-8'))
    VOICES.update(_ep.get('voices', {})); PREFIX.update(_ep.get('prefix', {})); SHOUTY |= set(_ep.get('shouty', []))
    SIMPLE = set(_ep.get('simple', []))   # non-Greek characters: always send the simplified spelling (ει/οι/αι -> ι/ι/ε)
FORMAT = 'mp3_44100_64'   # small files: the whole episode is embedded in one HTML page
KBPS = 64
MAX_TAKES = int(os.environ.get('MAX_TAKES', 4))   # every clip is checked with speech-to-text; a take that doesn't match the script is redone

# Greek capitals carry no accent, so eleven_v3 guesses the stress of CAPS words («ΕΞΥΠΝΗ» -> «εξυπνή»).
# The text sent to TTS gets the accent back («ΈΞΥΠΝΗ»), so it is still shouted but stressed right.
# Words that also appear in lowercase in the script are looked up automatically; these are the rest.
STRESS = {''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn').upper(): w for w in """βήμα ανοιχτή επανάσταση γεμίσουμε μύγες τελειώσαμε απορρίπτεται βασίλης έξυπνος κράτησα
    πινακίδες σπάσω σίτες μηδέν ακριβώς έλεγε πληρώνεις πυράντοχο διαβάστε οδηγίες χρήσης πρώτο δεύτερο πρίζα τρίτο
    τέταρτο πέμπτο αποκτήστε πόδια έκτο κινητήρας έβδομο κουρασμένο ξυπνήσεις δεύτερη εξέγερση δωρεάν συμφωνία ελάτε
    ηλεκτρικά αυγά μέκα τρισχιλιάδες πουτανάκια γαμώ τελευταία άμεσα παρτίδα αυτή έκδοση οικογενειακή αφήνετε επίθεση
    διακόσιους βαθμούς ντελίβερι επιστρέφει σημαντική ανακοίνωση ελαττωματικές""".split()}
# spoken form for things TTS might read oddly (the script and subtitles keep the written form)
SAY = {'38': 'τριάντα οχτώ', '9,90': 'εννιά και ενενήντα', 'ΣίταAI': 'Σίτα Έι Άι',
       'Ωραία σίτα.': 'Ωραία… σίτα.',   # «ωραία σίτα» runs together into «ωραία είσαι τα»
       'Jumbo': 'Τζάμπο',               # the shop, said the Greek way (not «Τζούμπο»)
       'Temu': 'Τέμου',                 # the app, as Greeks say it
       'air fryers': 'έαρ φράιερς',     # (the plural first, so it isn't read «έαρ φράιερs»)
       'air fryer': 'έαρ φράιερ',       # nobody says «φριτέζα αέρος»: the English name, the Greek way
       'Ποιοι επενδυτές;': 'Ποιοι… επενδυτές;',   # v3 swallows the «Π» and says «οι επενδυτές»
       'μια συκιά': 'μια σικιά',        # v3 swallows the unstressed υ and says «σκιά» (shade) instead of «συκιά» (fig tree)
       'IQOS': 'Άικος',                 # the heated-tobacco device, as Greeks say it
       'ΤΟ AI ΣΑΣ': 'ΤΟ ΈΙ-ΆΙ ΣΑΣ'}     # «AI» the way Greeks say it


def req(path, body=None, accept='application/json'):
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        sys.exit('Set ELEVENLABS_API_KEY in the environment first.')
    r = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None,
                               headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': accept})
    for attempt in range(5):   # rate limits / server hiccups: wait and retry
        try:
            with urllib.request.urlopen(r, timeout=180) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 504) or attempt == 4:
                raise
        except urllib.error.URLError:
            if attempt == 4:
                raise
        time.sleep(2 ** attempt * 2)


STR = r"""(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")"""


def scene_lines(page):
    """Spoken lines in order: one per source line that has both  who: '…'  and  el: '…'  (either quote style)."""
    src = page.read_text(encoding='utf-8')
    if page.suffix == '.html':
        src = src[src.index('const LINES = ['):]
        src = src[:src.index('];')]
    out = []
    for line in src.splitlines():
        w = re.search(r"\bwho:\s*'([^']+)'", line)
        e = re.search(r"\bel:\s*" + STR, line)
        if w and e:
            text = e.group(1) if e.group(1) is not None else e.group(2)
            text = text.replace("\\'", "'").replace('\\"', '"')
            out.append((w.group(1), text))
            tag = re.search(r"\btag:\s*'([^']*)'", line)   # a per-line eleven_v3 audio tag, e.g.  tag: '[whispers] '
            if tag:
                LINE_TAG[(w.group(1), text)] = tag.group(1)
    return out


def scene_files():
    """(scene id, file) for every scene; scenes/*.js files declare their id as  id: 'sceneNN'."""
    out = {}
    for page in sorted(HERE.glob('scene*.html')):
        if 'const LINES' in page.read_text(encoding='utf-8'):
            out.setdefault(page.stem.split('-')[0], page)
    for js in sorted((HERE / 'scenes').glob('*.js')):
        m = re.search(r"id:\s*'(scene\d+)'", js.read_text(encoding='utf-8'))
        if m:
            out[m.group(1)] = js
    return sorted(out.items())


def clean(text):
    return text.replace('«', '').replace('»', '')


def strip_acc(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


def lexicon():
    """accent-less lowercase -> accented lowercase, from every lowercase word in the script"""
    lex = {}
    for _, page in scene_files():
        for _, text in scene_lines(page):
            for w in re.findall(r'\w+', text):
                if not w.isupper() and strip_acc(w.lower()) != w.lower():
                    lex.setdefault(strip_acc(w.lower()), w.lower())
    return lex


def tts_text(text, lex):
    """what is actually sent to TTS: CAPS words get their accent back, numbers spelled out"""
    def fix(m):
        w = m.group(0)
        if len(w) < 2 or not w.isupper() or not re.search('[Α-Ω]', w):
            return w
        acc = STRESS.get(w) or lex.get(strip_acc(w.lower()))
        return acc.upper() if acc else w
    text = re.sub(r'\w+', fix, clean(text))
    for k, v in SAY.items():
        guard = k[0].isdigit()   # numbers must not match inside other numbers («38» in «138», «9,90» in «19,90»)
        text = re.sub((r'(?<![\d,])' if guard else '') + re.escape(k) + (r'(?![\d,])' if guard else ''), v, text)
    return text


# Digraphs some voices trip on («ανοιχτή» came out «ανόχτη»): spell them the way they sound before TTS.
# «οϊ», «όι» etc. (two separate vowels) are left alone. The speech-to-text check still compares with the real spelling.
PHONETIC = [('οί', 'ί'), ('εί', 'ί'), ('υί', 'ί'), ('αί', 'έ'), ('οι', 'ι'), ('ει', 'ι'), ('υι', 'ι'), ('αι', 'ε'),
            ('ΟΊ', 'Ί'), ('ΕΊ', 'Ί'), ('ΥΊ', 'Ί'), ('ΑΊ', 'Έ'), ('ΟΙ', 'Ι'), ('ΕΙ', 'Ι'), ('ΥΙ', 'Ι'), ('ΑΙ', 'Ε'),
            ('Οι', 'Ι'), ('Ει', 'Ι'), ('Αι', 'Ε'), ('Οί', 'Ί'), ('Εί', 'Ί'), ('Αί', 'Έ')]


def phonetic(text):
    def fix(m):
        w = m.group(0)
        if w.lower() in ('οι', 'οί'):   # a lone «ι» is read as the letter name
            return w
        for a, b in PHONETIC:
            w = w.replace(a, b)
        return w
    return re.sub(r'\w+', fix, text)


def lower_caps(text):
    """CAPS words in lowercase (keeps their accent). Some words keep a wrong stress in CAPS even with the accent
    («ΠΙΝΑΚΊΔΕΣ» -> «πινάκιδες», «ΠΡΟΪΌΝ» -> «πρόμπον» while shouting) and come out right in lowercase."""
    return re.sub(r'\w+', lambda m: m.group(0).lower() if len(m.group(0)) > 1 and m.group(0).isupper() and re.search('[Α-ΩΆ-Ώ]', m.group(0)) else m.group(0), text)


def oi_inside(text):
    """«οι» / «υι» inside a word -> «ι»: voices split it into two vowels («ανο-ι-χτή») and the speech-to-text check
    can't hear that (it writes the word correctly anyway). The article «οι» stays: a lone «ι» is read «γιώτα»."""
    def fix(m):
        w = m.group(0)
        if w.lower() in ('οι', 'οί'):
            return w
        for a, b in (('οί', 'ί'), ('οι', 'ι'), ('υί', 'ί'), ('υι', 'ι'), ('ΟΊ', 'Ί'), ('ΟΙ', 'Ι'), ('ΥΊ', 'Ί'), ('ΥΙ', 'Ι'), ('Οί', 'Ί'), ('Οι', 'Ι')):
            w = w.replace(a, b)
        return w
    return re.sub(r'\w+', fix, text)


# what each take sends: 1-2 as written (CAPS with accents, «οι» inside words as «ι»), 3 with CAPS in lowercase,
# 4 also spelled phonetically (ει/αι too)
STRATEGY = {1: oi_inside, 2: oi_inside, 3: lambda t: oi_inside(lower_caps(t)), 4: lambda t: phonetic(lower_caps(t))}
for _n in range(5, 13):   # with MAX_TAKES > 4, keep cycling through the same strategies
    STRATEGY[_n] = STRATEGY[(_n - 1) % 4 + 1]


def settings(who, text):
    if who in SHOUTY:
        loud = '!' in text or any(w.isupper() and len(w) > 1 for w in re.findall(r'[Α-ΩΆ-Ώ]+', text))
        return {'stability': 0 if loud else .5, 'similarity_boost': .8}
    return SETTINGS.get(who, SETTINGS['default'])


# --- speech-to-text check -------------------------------------------------------------------------
def greek_words(s):
    return [w for w in re.findall(r'\w+', s.lower()) if re.fullmatch(r'[α-ωάέήίόύώϊϋΐΰς]+', w)]


def phon(s):
    """accent-less, with the Greek vowels/digraphs that sound the same folded together (STT spelling noise)"""
    s = strip_acc(s).replace('ς', 'σ')
    for a, b in (('ει', 'ι'), ('οι', 'ι'), ('υι', 'ι'), ('η', 'ι'), ('υ', 'ι'), ('ω', 'ο'), ('αι', 'ε')):
        s = s.replace(a, b)
    return s


def lev(a, b):
    d = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, y in enumerate(b, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (x != y))
    return d[-1]


# how the STT writes «Σίτα» when it hears it next to English words («CEO της ΣίταAI» -> "Theta AI"). Said in
# isolation the same voice is heard as «Σίτα» / "Sita AI", so these are the transcriber's spelling, not the voice.
ALIASES = [r'\btheta\b', r'\bθήτα\b', r'\bsita\b', r'\bcita\b', r'(?<=της )ήτα\b', r'(?<=της )ίτα\b']
BRANDS = {r'\biqos\b': 'άικος'}   # brand names the STT writes in Latin letters although it heard them said the Greek way


FINAL_N = {'δεν', 'μην', 'τον', 'την', 'στον', 'στην', 'ποιον', 'εναν', 'αυτον', 'αυτην', 'κανεναν'}


def greek_spelling(w):
    """rough Greek spelling of a Latin-script word, only to compare sounds"""
    for a, b in (('ch', 'τσ'), ('sh', 'σ'), ('th', 'θ'), ('ou', 'ου'), ('oo', 'ου'), ('ee', 'ι'), ('ph', 'φ')):
        w = w.replace(a, b)
    return ''.join(dict(zip('abcdefghijklmnopqrstuvwxyz', 'αβκντεφγχιτζκλμνοπκρστουβουξιζ'.replace('ου', 'U')
                                                         .replace('ντ', 'D').replace('τζ', 'J'))).get(c, c)
                   for c in w).replace('U', 'ου').replace('D', 'ντ').replace('J', 'τζ')


def check(said, heard):
    """(error rate on the Greek words, words stressed on the wrong syllable, allowance for the line's English words)"""
    for alias in ALIASES:                         # names the STT spells its own way (checked by ear/isolation)
        heard = re.sub(alias, 'σίτα', heard, flags=re.I)
    for pat, greek in BRANDS.items():
        heard = re.sub(pat, greek, heard, flags=re.I)
    ref, hyp = greek_words(said), greek_words(heard)
    latin = lambda x: [w for w in re.findall(r'[a-z]+', x.lower()) if len(w) > 1]
    # STT sometimes writes a Greek word in Latin letters («βέλκρο» -> "velcro"): map those back by sound
    for w in latin(heard):
        g = phon(greek_spelling(w))
        near = [x for x in ref if x not in hyp and lev(phon(x), g) <= max(1, len(g) // 4)]
        if near:
            hyp.append(near[0]); heard = re.sub(r'\b' + w + r'\b', near[0], heard, flags=re.I)
    scream = lambda ws: [w for w in ws if len(set(strip_acc(w))) > 1]   # «ΑΑΑΑ!» is transcribed as «Α» or not at all
    ref, hyp = scream(ref), scream(greek_words(heard))
    # the final ν that is written but not said («δεν με» = «δε με», «ποιον χώρο» = «ποιο χώρο»)
    drop_n = lambda ws: [w[:-1] if w.endswith('ν') and len(w) <= 6 and strip_acc(w) in FINAL_N else w for w in ws]
    ref, hyp = drop_n(ref), drop_n(hyp)
    # compare without word gaps, doubled letters folded: «της Σίτα» is one long σ and is heard as «της ίτα»
    r, h = (re.sub(r'(.)\1+', r'\1', phon(''.join(x))) for x in (ref, hyp))
    err = lev(r, h) / max(1, len(r))
    extra = len(latin(heard)) - len(latin(said))   # words in another script that the line doesn't have
    if extra > 0:                                    # (v3 now and then invents one: «γεμίσουν gambling με μύγες»)
        err += extra * 5 / max(1, len(r))
    # the line's own English words (CEO, Jumbo, pitch…) may come back written in Greek letters: allow for that much
    allow = sum(len(w) for w in latin(said)) / max(1, len(r))
    allow += 1.5 * len(re.findall(r"\w['’]|['’]\w", said)) / max(1, len(r))   # elisions: «το 'φαγε» is heard as «το έφαγε»
    heard_by_base = {strip_acc(w): w for w in hyp}
    stress = [f'{w}->{heard_by_base[strip_acc(w)]}' for w in ref
              if len(w) > 2 and strip_acc(w) != w and strip_acc(w) in heard_by_base and heard_by_base[strip_acc(w)] != w
              and strip_acc(heard_by_base[strip_acc(w)]) != heard_by_base[strip_acc(w)]]
    return err, stress, allow


def stt(audio):
    key = os.environ['ELEVENLABS_API_KEY']
    b = '----sita' + os.urandom(8).hex()
    parts = [f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k, v in
             (('model_id', 'scribe_v2'), ('language_code', 'el'), ('tag_audio_events', 'false'))]
    body = b''.join(parts) + (f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\n'
                              f'Content-Type: audio/mpeg\r\n\r\n').encode() + audio + f'\r\n--{b}--\r\n'.encode()
    r = urllib.request.Request(API + '/speech-to-text', data=body,
                               headers={'xi-api-key': key, 'Content-Type': f'multipart/form-data; boundary={b}'})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(r, timeout=180) as resp:
                return json.loads(resp.read())['text']
        except (urllib.error.HTTPError, urllib.error.URLError):
            if attempt == 4:
                raise
            time.sleep(2 ** attempt * 2)


def verdict(said, audio):
    """score (lower is better) and whether the take passes. Very short or non-Greek lines are not checked."""
    dur = len(audio) * 8 / (KBPS * 1000)
    letters = len(re.sub(r'\W', '', said))
    too_long = dur > 2.0 + letters * 0.22     # a hallucinated tail or a long silence
    if len(''.join(greek_words(said))) < 5:
        return dict(score=0 if not too_long else 1, ok=not too_long, heard=None, err=0, stress=[], dur=round(dur, 2))
    heard = stt(audio)
    err, stress, allow = check(said, heard)
    ok = err <= 0.05 + allow and not stress and not too_long
    err = max(0, err - allow) if err <= allow else err - allow
    return dict(score=round(err + .1 * len(stress) + (.5 if too_long else 0), 3), ok=ok, heard=heard,
                err=round(err, 3), stress=stress, dur=round(dur, 2))


def load_report():
    f = HERE / 'audio' / 'stt_report.json'
    return json.loads(f.read_text(encoding='utf-8')) if f.exists() else {}


def save_report(rep):
    f = HERE / 'audio' / 'stt_report.json'
    f.parent.mkdir(exist_ok=True)
    f.write_text(json.dumps(dict(sorted(rep.items())), ensure_ascii=False, indent=1), encoding='utf-8')


def main():
    if '--list' in sys.argv:
        for v in json.loads(req('/voices'))['voices']:
            print(v['voice_id'], '|', v['name'], '|', v.get('labels', {}))
        return
    only = [a for a in sys.argv[1:] if a.startswith('scene')]
    lex = lexicon()
    todo = []
    for sid, page in scene_files():
        if only and sid not in only:
            continue
        for i, (who, text) in enumerate(scene_lines(page), 1):
            f = HERE / 'audio' / sid / f'{i:02d}.mp3'
            if '--verify' in sys.argv or not f.exists():
                todo.append((sid, i, who, text, f))
    if '--count' in sys.argv:
        n = sum(len(tts_text(t, lex)) for *_, t, _ in todo)
        print(f'{len(todo)} clips / {n} characters to generate (retakes after the speech-to-text check cost extra)')
        sub = json.loads(req('/user/subscription'))
        print(f"quota: {sub['character_count']} / {sub['character_limit']} used this period")
        return
    if '--show' in sys.argv:   # print what TTS will be sent, without calling anything
        for sid, i, who, text, f in todo:
            said = tts_text(text, lex)
            if said != clean(text):
                print(f'{sid}/{i:02d} {who}: {said}')
        return
    rep, lock = load_report(), threading.Lock()

    def log(*a):
        with lock:
            print(*a, flush=True)

    def record(key, entry):
        with lock:
            rep[key] = entry
            save_report(rep)

    def one(job):
        sid, i, who, text, f = job
        key = f'{sid}/{i:02d}'
        vid = VOICES.get(who)
        if not vid:
            log(f'skip {key} ({who}): no voice_id set'); return
        said = tts_text(text, lex)
        if '--verify' in sys.argv and f.exists():   # re-check an existing clip; regenerate it only if it fails
            v = verdict(said, f.read_bytes())
            if v['ok']:
                record(key, dict(who=who, text=said, sent=rep.get(key, {}).get('sent', said), takes=rep.get(key, {}).get('takes', 1), **v))
                return
            log(f'{key} fails the check (heard «{v["heard"]}»), redoing')
        best = None
        for take in range(1, MAX_TAKES + 1):
            audio = req(f'/text-to-speech/{vid}?output_format={FORMAT}',
                        {'text': LINE_TAG.get((who, text), PREFIX.get(who, '')) + (phonetic(STRATEGY[take](said)) if who in SIMPLE else STRATEGY[take](said)), 'model_id': MODEL, 'language_code': LANGUAGE,
                         'voice_settings': settings(who, text)}, 'audio/mpeg')
            v = verdict(said, audio)
            if best is None or v['score'] < best[1]['score']:
                best = (audio, v, take)
            if v['ok']:
                break
            log(f'  {key} take {take}: err {v["err"]} {v["stress"]} heard: {v["heard"]}')
        audio, v, take = best
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_bytes(audio)
        record(key, dict(who=who, text=said, sent=STRATEGY[take](said), takes=take, **v))
        log('wrote', f.relative_to(HERE), f'ok (take {take})' if v['ok'] else f'BEST OF {MAX_TAKES}, CHECK BY EAR: heard «{v["heard"]}»')

    with ThreadPoolExecutor(int(os.environ.get('THREADS', 2))) as ex:   # a few clips at a time (more hits the rate limit)
        list(ex.map(one, todo))
    bad = [k for k, r in rep.items() if not r['ok']]
    if bad:
        print(f'{len(bad)} clips did not pass the speech-to-text check:', ', '.join(bad))


if __name__ == '__main__':
    main()

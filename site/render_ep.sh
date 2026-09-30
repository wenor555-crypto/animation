#!/bin/bash
# usage: render_ep.sh episode2   -> renders dist/episode2.html to out/episode2.mp4, copies it into video/ (the Drive watcher uploads it)
#                                   and publishes it on the site as the episode's next revision (~/sita-site/publish.py)
EP=${1:-episode1}
cd ~/sita-render
export CHROME=$HOME/.cache/ms-playwright/chromium-1194/chrome-linux/chrome
export FFMPEG=$(venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
if PAGE=$EP.html node tools/export_mp4.js out/$EP.mp4 && $FFMPEG -hide_banner -i out/$EP.mp4 2>&1 | grep -E "Duration|Stream" && cp out/$EP.mp4 video/$EP.mp4; then
  echo COPIED_TO_VIDEO
  python3 ~/sita-site/publish.py $EP || echo PUBLISH_FAILED
else
  echo RENDER_FAILED
fi

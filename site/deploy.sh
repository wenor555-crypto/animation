#!/bin/bash
# Deploy the site to the node: copy the files, install the new render_ep.sh (publishes each render), keep the server running.
#   bash site/deploy.sh
set -e
cd "$(dirname "$0")/.."
C="python3 episode1/tools/compute_client.py"
$C run 'mkdir -p ~/sita-site/static' >/dev/null
for f in server.py publish.py reviewctl.py run.sh site.json static/site.css static/review.css static/review.js; do
  $C put site/$f sita-site/$f >/dev/null && echo "put $f"
done
$C put site/render_ep.sh sita-render/render_ep.sh >/dev/null && echo "put render_ep.sh"
$C run 'cd ~/sita-site && chmod +x run.sh ~/sita-render/render_ep.sh
(crontab -l 2>/dev/null | grep -v "sita-site/run.sh"; echo "@reboot $HOME/sita-site/run.sh"; echo "*/5 * * * * $HOME/sita-site/run.sh") | crontab -
[ -f site.pid ] && kill $(cat site.pid) 2>/dev/null; sleep 1; ./run.sh; sleep 2
python3 -c "import urllib.request; print(urllib.request.urlopen(\"http://127.0.0.1:8790/health\", timeout=5).read().decode())"'

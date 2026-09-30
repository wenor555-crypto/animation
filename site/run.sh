#!/bin/bash
# Keep new drafts as revisions, and start the site if it isn't answering. crontab: @reboot and every 5 minutes (deploy.sh installs both lines).
cd "$(dirname "$0")"
python3 reviewctl.py snapshot >> site.log 2>&1        # every new draft in dist/ becomes the next revision (vNN)
python3 -c "import urllib.request,sys; urllib.request.urlopen('http://127.0.0.1:8790/health', timeout=3)" 2>/dev/null && exit 0
setsid nohup python3 server.py --port 8790 >> site.log 2>&1 < /dev/null &
echo $! > site.pid

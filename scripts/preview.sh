#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
# Reuse this review's isolated dependencies when available; otherwise use local Ruby.
website_ruby=/opt/homebrew/Library/Homebrew/vendor/portable-ruby/3.4.8/bin
if [ -x "$website_ruby/ruby" ] && [ -f /tmp/website-preview-gems/bin/bundle ]; then
  export PATH="$website_ruby:$PATH"
  export GEM_HOME=/tmp/website-preview-gems
  export GEM_PATH=/tmp/website-preview-gems
  export GEM_SPEC_CACHE=/tmp/website-preview-gem-cache
  export BUNDLE_USER_HOME=/tmp/website-preview-bundle
  export BUNDLE_VERSION=4.0.20
fi
case "${1:-serve}" in
  build) bundle exec jekyll build ;;
  check) bundle exec jekyll build; python3 scripts/check_site.py ;;
  serve) bundle exec jekyll serve --host 127.0.0.1 --port "${PORT:-4173}" ;;
  *) echo 'Usage: scripts/preview.sh [build|check|serve]'; exit 1 ;;
esac

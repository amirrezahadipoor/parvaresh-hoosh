#!/usr/bin/env bash
# Normalize a developer-generated Persian neural clip for the app bundle.
# Pitch remains at the neural voice's native setting (+0Hz), not
# with a post-processing transform that can blur Persian consonants.
set -euo pipefail
ffmpeg -hide_banner -loglevel error -y -i "$1" \
  -codec:a libmp3lame -q:a 4 -ar 24000 -ac 1 "$2"

#!/usr/bin/env bash
# Normalize a developer-generated Persian neural clip for the app bundle.
# Pitch must be controlled inside the neural synthesizer (currently +8Hz), not
# with a post-processing transform that can blur Persian consonants.
set -euo pipefail
ffmpeg -hide_banner -loglevel error -y -i "$1" \
  -codec:a libmp3lame -q:a 4 -ar 24000 -ac 1 "$2"

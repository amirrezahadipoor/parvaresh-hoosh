#!/usr/bin/env bash
# Convert an AI-generated Persian voice clip into the approved "child" timbre.
#
# +28% pitch with FORMANT SHIFTING (rubberband). Formant shifting is the part
# that matters: raising pitch alone produces a chipmunk, whereas shifting the
# formants down-scales the simulated vocal tract so the result reads as a real
# child. Clip length is preserved exactly, so nothing sounds sped up.
#
# usage: scripts/kidify.sh <in.mp3> <out.mp3>
set -euo pipefail
ffmpeg -hide_banner -loglevel error -y -i "$1" \
  -af "rubberband=pitch=1.28:formant=shifted" \
  -codec:a libmp3lame -q:a 4 -ar 24000 -ac 1 "$2"

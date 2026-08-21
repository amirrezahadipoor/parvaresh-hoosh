#!/usr/bin/env bash
# Turn a raw AI voice clip into the approved child-voice narration asset.
#
# ONE transformation only: rubberband pitch=1.15 with formant shifting, the
# timbre that was approved. Formant shifting is what avoids the chipmunk
# effect, and the algorithm preserves clip length exactly.
#
# Deliberately NOT done here: silence trimming and loudness normalisation.
# Both were tried and reverted -- they ate the natural lead-in and breathing
# room of the delivery and made short clips sound clipped and abrupt.
# Clip length is controlled by writing shorter TEXT, not by cutting audio.
#
# usage: scripts/kidify.sh <in.mp3> <out.mp3>
set -euo pipefail
ffmpeg -hide_banner -loglevel error -y -i "$1" \
  -af "rubberband=pitch=1.15:formant=shifted" \
  -codec:a libmp3lame -q:a 4 -ar 24000 -ac 1 "$2"

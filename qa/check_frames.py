"""Frame checks on the delivered MP4: caption safe margins, caption contrast, end-card extents.
Usage: python qa/check_frames.py <video.mp4>
Extracts one frame in the middle of each caption and of the end card, then measures real pixels.
"""
import subprocess
import sys
import tempfile
import os

import numpy as np
from PIL import Image

VIDEO = sys.argv[1]
FPS = 30
# (label, start s, end s) copied from src/timeline.ts
ITEMS = [
    ('caption 1', 1.6, 3.9),
    ('caption 2', 5.1, 7.8),
    ('caption 3', 7.8, 10.0),
    ('caption 4', 10.2, 12.5),
    ('end card', 13.15, 14.9),
]
MARGIN = 96


def lum(rgb):
    c = np.asarray(rgb, float) / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


tmp = tempfile.mkdtemp()
ok = True
for label, a, b in ITEMS:
    t = (a + b) / 2 if label != 'end card' else 14.2
    png = os.path.join(tmp, f'{label.replace(" ", "_")}.png')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{t:.3f}', '-i', VIDEO, '-frames:v', '1', png], check=True)
    im = np.asarray(Image.open(png).convert('RGB')).astype(float)
    h, w, _ = im.shape
    band = im[860:, :, :] if label != 'end card' else im[300:780, :, :]
    y0 = 860 if label != 'end card' else 300
    L = lum(band)
    thr = 0.2
    ys, xs = np.where(L > thr)
    if len(xs) == 0:
        print(f'{label}: no text pixels found'); ok = False; continue
    x_min, x_max, y_min, y_max = xs.min(), xs.max(), ys.min() + y0, ys.max() + y0
    # contrast: bright text (95th percentile of text pixels) vs median of dark background in the same band
    text_l = np.percentile(L[L > thr], 95)
    bg_l = np.median(L[L <= thr])
    ratio = (text_l + 0.05) / (bg_l + 0.05)
    left_ok = x_min >= MARGIN - 2
    right_ok = x_max <= w - MARGIN + 2
    bottom_ok = y_max <= h - MARGIN + 2
    flag = 'PASS' if (left_ok and right_ok and bottom_ok and ratio >= 4.5) else 'FAIL'
    if flag == 'FAIL':
        ok = False
    print(f'{label:10s} t={t:5.2f}s bbox x[{x_min},{x_max}] y[{y_min},{y_max}] left_margin={x_min} right_margin={w - 1 - x_max} bottom_margin={h - 1 - y_max} contrast={ratio:5.1f}:1 {flag}')
print('ALL PASS' if ok else 'SOME FAIL')

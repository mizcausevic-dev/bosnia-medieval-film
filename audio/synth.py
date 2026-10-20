"""
Ambient sound design for the 15 s film. Picture-locked: cue times mirror src/timeline.ts (30 fps).
Everything is synthesised with numpy/scipy. No samples, no melody, no claim of 'authentic' or 'period' sound.
Usage: python audio/synth.py <out.wav>
Output: stereo 48 kHz 16-bit WAV, exactly 15.000 s. Deterministic (fixed seeds).
"""
import sys
import zlib

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 15.0
N = int(SR * DUR)
FPS = 30


def fs(frame):
    return int(round(frame * SR / FPS))


def rng(tag):
    return np.random.default_rng(zlib.crc32(tag.encode()))


def bandpass(x, lo, hi, order=3):
    sos = signal.butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def lowpass(x, hz, order=3):
    sos = signal.butter(order, hz, btype='low', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def highpass(x, hz, order=2):
    sos = signal.butter(order, hz, btype='high', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def place(buf, start, sig, pan=0.0, gain=1.0):
    """Add sig into stereo buf at sample `start`. pan -1 (left) .. +1 (right), equal-power."""
    s = max(0, start)
    e = min(N, start + len(sig))
    if e <= s:
        return
    seg = sig[s - start : e - start] * gain
    ang = (pan + 1) * np.pi / 4
    buf[0, s:e] += seg * np.cos(ang)
    buf[1, s:e] += seg * np.sin(ang)


def hann(n):
    return np.hanning(n)


out = np.zeros((2, N))
t = np.arange(N) / SR

# 1. Room tone: soft low drone (55 Hz with a fifth above) and filtered air. Slow level drift, no pulse.
drone = (
    0.55 * np.sin(2 * np.pi * 55.0 * t + 0.4 * np.sin(2 * np.pi * 0.07 * t))
    + 0.28 * np.sin(2 * np.pi * 82.4 * t + 1.1)
    + 0.14 * np.sin(2 * np.pi * 110.0 * t + 2.0)
)
drone *= 0.78 + 0.22 * np.sin(2 * np.pi * 0.11 * t + 0.8)
air = bandpass(rng('air').standard_normal(N), 180, 2400, 2)
air = lowpass(air, 1800)
air *= 0.55 + 0.45 * np.sin(2 * np.pi * 0.05 * t + 2.2)
bed = 0.38 * drone + 0.05 * air
env = np.clip(t / 1.0, 0, 1)  # 1 s fade in
env *= np.where(t > 12.8, np.exp(-(t - 12.8) * 1.1), 1.0)  # decay across the end card
env *= np.clip((DUR - t) / 0.5, 0, 1)  # fade to silence in the last 0.5 s
bed *= env
out[0] += bed
out[1] += bed * 0.97

# 2. Quill-like scratch grains (band-passed noise). One grain per ink stroke, timed to the reveal.
def scratch_run(tag, f0, f1, count, gain, center=(2800, 5600)):
    r = rng(tag)
    # reveal is eased, so grains bunch in the middle of the run like a hand speeding up and slowing down
    u = (np.arange(count) + r.uniform(0.15, 0.85, count)) / count
    eased = 0.5 - 0.5 * np.cos(np.pi * u)
    frames = f0 + (f1 - f0) * eased
    for i, fr in enumerate(frames):
        dur = int(SR * r.uniform(0.035, 0.11))
        noise = r.standard_normal(dur + 64)
        c = r.uniform(*center)
        g = bandpass(noise, c * 0.7, min(c * 1.4, SR / 2 - 100), 2)[:dur] * hann(dur)
        g *= r.uniform(0.55, 1.0) * gain
        place(out, fs(fr), g, pan=((-1) ** i) * 0.18 + r.uniform(-0.08, 0.08))


scratch_run('date', 15, 66, 16, 0.30)  # 0.5 to 2.2 s
scratch_run('l1', 135, 171, 9, 0.28)
scratch_run('l2', 171, 201, 7, 0.28)
scratch_run('l3', 201, 246, 11, 0.28)

# 3. Paper rustle swell at the scene 2 start (4.0 s)
def rustle(start_s, length_s, lo, hi, gain, tag, pan=0.0, peak=0.45):
    n = int(SR * length_s)
    x = bandpass(rng(tag).standard_normal(n), lo, hi, 2)
    # crackle: sparse amplitude modulation so it reads as paper rather than wind
    m = np.clip(rng(tag + 'm').standard_normal(n // 240 + 2), 0, None)
    m = np.interp(np.arange(n), np.arange(len(m)) * 240, m)
    shape = np.sin(np.pi * np.clip(np.linspace(0, 1, n), 0, 1)) ** 1.6
    shape = np.roll(shape, 0)
    x = x * (0.35 + 0.65 * m / (m.max() + 1e-9)) * shape
    place(out, int(SR * start_s), x, pan=pan, gain=gain)


rustle(3.92, 0.7, 700, 4200, 0.36, 'swell')

# 4. Sheet separation (10.0 s): three staggered slides and one soft low thud
rustle(10.00, 0.9, 900, 3200, 0.20, 'slideA', pan=-0.5)
rustle(10.10, 0.9, 1400, 4200, 0.19, 'slideB', pan=0.0)
rustle(10.20, 0.9, 1100, 3800, 0.20, 'slideC', pan=0.5)

n = int(SR * 0.6)
tt = np.arange(n) / SR
thud = np.sin(2 * np.pi * 48 * tt) * np.exp(-tt * 9.0) + 0.4 * np.sin(2 * np.pi * 96 * tt) * np.exp(-tt * 14.0)
thud *= np.clip(tt / 0.006, 0, 1)  # 6 ms attack so it is soft, not a click
place(out, int(SR * 10.06), thud, gain=0.2)

# 5. Three small ink taps for the labels (10.6 to 11.1 s)
def tap(start_s, pan, f0):
    n = int(SR * 0.12)
    tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 38.0)
    click = bandpass(rng(f'tap{start_s}').standard_normal(n), 1400, 3600, 2) * np.exp(-tt * 90.0)
    place(out, int(SR * start_s), 0.5 * body + 0.35 * click, pan=pan, gain=0.45)


tap(10.62, -0.5, 196)
tap(10.74, 0.0, 220)
tap(10.86, 0.5, 247)

# Small synthetic room: 0.9 s decaying noise impulse response, mixed in as a send from everything but the drone.
ir_n = int(SR * 0.9)
ir_t = np.arange(ir_n) / SR
ir = rng('ir').standard_normal((2, ir_n)) * np.exp(-ir_t * 5.2)
ir = lowpass(ir, 5200)
ir /= np.abs(ir).max()
dry = out.copy()
dry_no_bed = dry.copy()
dry_no_bed[0] -= bed
dry_no_bed[1] -= bed * 0.97
wet = np.stack([signal.fftconvolve(dry_no_bed[c], ir[c])[:N] for c in range(2)])
mix = dry + 0.11 * wet

# Gentle high-pass, then clean any DC and hard-limit safely below full scale.
mix = np.stack([highpass(mix[c], 28) for c in range(2)])
mix *= np.clip((DUR - t) / 0.04, 0, 1)  # guarantee the last 40 ms are silent
peak = np.abs(mix).max()
mix *= 0.7 / peak  # about -3 dBFS peak before loudness normalisation

pcm = (np.clip(mix, -1, 1).T * 32767).astype(np.int16)
wavfile.write(sys.argv[1], SR, pcm)
print(f'wrote {sys.argv[1]}: {pcm.shape[0] / SR:.3f} s, peak {20 * np.log10(np.abs(mix).max()):.1f} dBFS')

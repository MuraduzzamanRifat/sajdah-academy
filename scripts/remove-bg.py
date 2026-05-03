"""Remove the uniform light-blue background from hero-medallion.png.

Input:  public/hero-medallion.png
Output: public/hero-medallion-cutout.png (transparent PNG, autocropped)

Strategy: sample the four corners + center-of-corner area to learn the
true background color, then alpha-key every pixel within an LAB-distance
threshold. LAB distance = perceptually uniform, much better than RGB.
Includes feathered edge (1-2 px gaussian on alpha) for clean compositing.
"""
from PIL import Image, ImageFilter
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "hero-medallion.png")
DST = os.path.join(ROOT, "public", "hero-medallion-cutout.png")

if not os.path.exists(SRC):
    sys.exit(f"missing source: {SRC}")

img = Image.open(SRC).convert("RGBA")
w, h = img.size
print(f"source: {w}x{h}")

# Sample background color from 4 corners (avg of a small patch each)
def sample(x, y, n=20):
    pixels = []
    for dy in range(-n, n + 1, 4):
        for dx in range(-n, n + 1, 4):
            px = img.getpixel((max(0, min(w - 1, x + dx)), max(0, min(h - 1, y + dy))))
            pixels.append(px[:3])
    avg = tuple(sum(c[i] for c in pixels) // len(pixels) for i in range(3))
    return avg

corners = [sample(40, 40), sample(w - 40, 40), sample(40, h - 40), sample(w - 40, h - 40)]
bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
print(f"detected bg color: rgb{bg}")

# Color-distance threshold (Euclidean in RGB; simple and effective for uniform bg)
THRESHOLD = 55  # how forgiving — higher = removes more bluish pixels
SOFT_BAND = 25  # pixels within this band fade smoothly to transparent

px = img.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        d = ((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2) ** 0.5
        if d <= THRESHOLD - SOFT_BAND:
            px[x, y] = (r, g, b, 0)
        elif d < THRESHOLD:
            # Soft falloff in the band
            alpha = int(255 * (d - (THRESHOLD - SOFT_BAND)) / SOFT_BAND)
            px[x, y] = (r, g, b, alpha)

# Crop to opaque bbox + a small padding
bbox = img.getbbox()
if bbox:
    pad = 8
    bbox = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(w, bbox[2] + pad),
        min(h, bbox[3] + pad),
    )
    img = img.crop(bbox)
    print(f"cropped to: {img.size}")

# Light gaussian on alpha channel for cleaner edges
r, g, b, a = img.split()
a = a.filter(ImageFilter.GaussianBlur(radius=0.6))
img = Image.merge("RGBA", (r, g, b, a))

# Resize down a bit for web (max 1600 long edge)
MAX = 1600
if max(img.size) > MAX:
    scale = MAX / max(img.size)
    img = img.resize((int(img.size[0] * scale), int(img.size[1] * scale)), Image.LANCZOS)
    print(f"resized to: {img.size}")

img.save(DST, "PNG", optimize=True)
sz = os.path.getsize(DST)
print(f"saved: {DST} ({sz // 1024} KB)")

"""Generate icon + small-thumb variants from the hero medallion cutout.

Reads:  public/hero-medallion-cutout.webp
Writes: public/icon-32.png         (favicon, 32x32)
        public/apple-icon-180.png  (apple-touch-icon, 180x180)
        public/medallion-128.webp  (small inline use — section dividers etc.)
        public/medallion-512.png   (OG card embed source)
"""
from PIL import Image
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "hero-medallion-cutout.webp")

src = Image.open(SRC).convert("RGBA")
print(f"source: {src.size}")

def square_with_dark_bg(img, size, bg=(2, 44, 34, 255)):
    """Render the medallion centered on a solid emerald-950 background.
       Used for favicon + apple-icon where transparent backgrounds would
       look bad on white tabs / iOS home screen."""
    canvas = Image.new("RGBA", (size, size), bg)
    # Resize medallion to ~85% of canvas, centered
    scale = (size * 0.92) / max(img.size)
    new_w = int(img.size[0] * scale)
    new_h = int(img.size[1] * scale)
    scaled = img.resize((new_w, new_h), Image.LANCZOS)
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    canvas.alpha_composite(scaled, (x, y))
    return canvas

# Favicon — small bitmap (.png since SVG won't preserve photo detail at 32x32)
favicon = square_with_dark_bg(src, 32)
favicon.save(os.path.join(ROOT, "public", "icon-32.png"), "PNG", optimize=True)

# Apple touch icon — 180x180 with rounded corners (iOS rounds anyway, but explicit)
apple = square_with_dark_bg(src, 180)
apple.save(os.path.join(ROOT, "public", "apple-icon-180.png"), "PNG", optimize=True)

# Small transparent thumbnail for inline UI (section dividers, chips)
small = src.copy()
small.thumbnail((128, 128), Image.LANCZOS)
small.save(os.path.join(ROOT, "public", "medallion-128.webp"), "WEBP", quality=88, method=6)

# Mid-size for OG card embed (used inside next/og ImageResponse via dataURL)
mid = src.copy()
mid.thumbnail((512, 512), Image.LANCZOS)
mid.save(os.path.join(ROOT, "public", "medallion-512.png"), "PNG", optimize=True)

for f in ["icon-32.png", "apple-icon-180.png", "medallion-128.webp", "medallion-512.png"]:
    p = os.path.join(ROOT, "public", f)
    print(f"  {f}: {os.path.getsize(p) // 1024 if os.path.getsize(p) >= 1024 else os.path.getsize(p)} {'KB' if os.path.getsize(p) >= 1024 else 'B'}")

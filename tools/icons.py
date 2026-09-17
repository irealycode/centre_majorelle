#!/usr/bin/env python3
"""
App icons for Centre Dentaire Majorelle.

Two treatments, because one mark cannot serve 16px and 512px:

  * Large icons (PWA, Android, iOS home screen) use the clinic's real monogram
    as drawn — tooth outline, script M, flourish. There is room for the detail,
    and this is where brand recognition matters.
  * The favicon uses a simplified solid tooth. The real monogram is a hairline
    outline; at 16px it turns to mud, and its interior cannot be filled
    automatically because the M's strokes partition it. So the small mark is a
    deliberate simplification, matching favicon.svg in build.mjs.

Run tools/logo.py first; the large icons read the mark it produces.

    python tools/icons.py
"""

import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARK = os.path.join(ROOT, "assets", "img", "logo-mark-white.png")
OUT = os.path.join(ROOT, "assets", "icons")

BLUE = (48, 86, 205)  # --blue  oklch(0.5 0.19 266)
WHITE = (255, 255, 255)

WORK = 1024

# Simplified tooth, as cubic segments — the same outline as favicon.svg.
VIEWBOX = (24.0, 30.0)
START = (12.0, 2.4)
SEGMENTS = [
    ((7.6, 2.4), (4.0, 4.8), (4.0, 9.4)),
    ((4.0, 12.6), (4.9, 14.4), (5.6, 17.2)),
    ((6.2, 19.6), (6.3, 22.6), (6.6, 24.8)),
    ((6.8, 26.4), (7.4, 27.4), (8.5, 27.4)),
    ((9.7, 27.4), (10.2, 26.3), (10.4, 24.6)),
    ((10.6, 22.8), (10.8, 20.6), (12.0, 20.6)),
    ((13.2, 20.6), (13.4, 22.8), (13.6, 24.6)),
    ((13.8, 26.3), (14.3, 27.4), (15.5, 27.4)),
    ((16.6, 27.4), (17.2, 26.4), (17.4, 24.8)),
    ((17.7, 22.6), (17.8, 19.6), (18.4, 17.2)),
    ((19.1, 14.4), (20.0, 12.6), (20.0, 9.4)),
    ((20.0, 4.8), (16.4, 2.4), (12.0, 2.4)),
]


def bezier(p0, p1, p2, p3, steps=28):
    pts = []
    for i in range(1, steps + 1):
        t = i / steps
        u = 1 - t
        a, b, c, d = u**3, 3 * u * u * t, 3 * u * t * t, t**3
        pts.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
                    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return pts


def simple_tooth():
    """The simplified tooth as a filled alpha mask at the working size."""
    pts, cur = [START], START
    for c1, c2, end in SEGMENTS:
        pts.extend(bezier(cur, c1, c2, end))
        cur = end
    vw, vh = VIEWBOX
    scale = WORK / vh
    img = Image.new("L", (round(vw * scale), round(vh * scale)), 0)
    ImageDraw.Draw(img).polygon([(x * scale, y * scale) for x, y in pts], fill=255)
    return img.crop(img.getbbox())


def real_mark():
    """The clinic's monogram as an alpha mask, upscaled to the working size."""
    if not os.path.exists(MARK):
        raise SystemExit(f"Missing {MARK} — run `python tools/logo.py` first.")
    alpha = Image.open(MARK).convert("RGBA").getchannel("A")
    w, h = alpha.size
    scale = WORK / max(w, h)
    return alpha.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


def compose(size, mask, bg, fg, pad):
    """Paint `fg` through `mask`, centred on a `bg` field, at `size`."""
    inner = max(8, int(size * (1 - 2 * pad)))
    mw, mh = mask.size
    scale = inner / max(mw, mh)
    scaled = mask.resize((max(1, round(mw * scale)), max(1, round(mh * scale))), Image.LANCZOS)
    img = Image.new("RGBA", (size, size), bg + (255,))
    layer = Image.new("RGBA", scaled.size, fg + (255,))
    img.paste(layer, ((size - scaled.width) // 2, (size - scaled.height) // 2), scaled)
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    mark = real_mark()
    tooth = simple_tooth()

    # PWA / Android — real monogram, full-bleed square so it also works maskable
    for size in (192, 512):
        compose(size, mark, BLUE, WHITE, pad=0.20).convert("RGB").save(
            os.path.join(OUT, f"icon-{size}.png"), optimize=True
        )

    # iOS home screen — opaque; iOS applies its own corner mask
    compose(180, mark, BLUE, WHITE, pad=0.19).convert("RGB").save(
        os.path.join(OUT, "apple-touch-icon.png"), optimize=True
    )

    # Classic favicon — simplified tooth, blue on white, legible down to 16px
    compose(256, tooth, WHITE, BLUE, pad=0.08).convert("RGB").save(
        os.path.join(OUT, "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )

    for f in sorted(os.listdir(OUT)):
        kb = os.path.getsize(os.path.join(OUT, f)) / 1024
        print(f"  {f:24s} {kb:6.1f} KB")


if __name__ == "__main__":
    main()

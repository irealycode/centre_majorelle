#!/usr/bin/env python3
"""
Cut the supplied logo into the pieces the site actually uses.

`assets/LOGO_full.png` is the full stacked lockup: tooth monogram, MAJORELLE,
DENTAL CLINIC, and "by dr Zeguendry". The site needs it without the last two
lines, and in two colours.

The artwork is pure white on transparency — an alpha mask with no colour
information — so recolouring is exact: keep the alpha, replace the RGB. No
quality is lost and the two colour versions are pixel-identical in shape.

Bands are found by scanning for empty rows rather than hard-coded pixel
offsets, so a re-exported logo with different padding still cuts correctly.

    python tools/logo.py
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "LOGO_full.png")
OUT = os.path.join(ROOT, "assets", "img")

INK = (13, 15, 21)        # --ink   oklch(0.17 0.012 264)
WHITE = (255, 255, 255)

# Rendered widths. The mark and wordmark sit in the header, the lockup in the
# footer; 3x the largest display size keeps the hairlines crisp.
SIZES = {"logo-mark": 132, "logo-wordmark": 660, "logo-lockup": 720}


def bands(alpha, threshold=2, gap=8):
    """Row ranges containing ink, split wherever `gap` empty rows appear."""
    w, h = alpha.size
    px = alpha.load()
    rows = []
    for y in range(h):
        total = 0
        for x in range(0, w, 2):          # every other column is plenty
            total += px[x, y]
        rows.append(total > threshold * 255)

    out, start, blank = [], None, 0
    for y, filled in enumerate(rows):
        if filled:
            if start is None:
                start = y
            blank = 0
        elif start is not None:
            blank += 1
            if blank >= gap:
                out.append((start, y - blank + 1))
                start = None
    if start is not None:
        out.append((start, h))
    return out


def recolour(mask, rgb):
    """Paint `rgb` through the alpha mask."""
    out = Image.new("RGBA", mask.size, rgb + (255,))
    out.putalpha(mask)
    return out


def emit(mask, name):
    """Trim, scale to the configured width, and write ink + white versions."""
    box = mask.getbbox()
    if not box:
        return
    mask = mask.crop(box)
    target = SIZES[name]
    if mask.width != target:
        h = max(1, round(mask.height * target / mask.width))
        mask = mask.resize((target, h), Image.LANCZOS)

    for suffix, rgb in (("ink", INK), ("white", WHITE)):
        path = os.path.join(OUT, f"{name}-{suffix}.png")
        recolour(mask, rgb).save(path, optimize=True)
        kb = os.path.getsize(path) / 1024
        print(f"  {name}-{suffix}.png".ljust(30) + f"{mask.width}x{mask.height}  {kb:5.1f} KB")


def main():
    if not os.path.exists(SRC):
        raise SystemExit(f"Missing {SRC}")

    im = Image.open(SRC).convert("RGBA")
    alpha = im.getchannel("A")

    found = bands(alpha)
    print(f"  {len(found)} bands in the source: " + ", ".join(f"y{a}-{b}" for a, b in found))
    if len(found) < 4:
        raise SystemExit(
            f"Expected 4 bands (mark / MAJORELLE / DENTAL CLINIC / by dr ...), found {len(found)}.\n"
            "The source layout changed — check tools/logo.py."
        )

    mark_top, mark_bottom = found[0]
    word_top, word_bottom = found[1]

    w = im.width
    emit(alpha.crop((0, mark_top, w, mark_bottom)), "logo-mark")
    emit(alpha.crop((0, word_top, w, word_bottom)), "logo-wordmark")
    # The lockup keeps the original spacing between the two kept bands.
    emit(alpha.crop((0, mark_top, w, word_bottom)), "logo-lockup")

    print("  (DENTAL CLINIC and the 'by dr' line are cropped out)")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
App icons for Centre Dentaire Majorelle.

Every icon uses the clinic's real monogram — tooth outline, script M,
flourish — and no text.

  * Large icons (PWA, Android, iOS home screen): white on Majorelle blue.
  * Favicon: the bare monogram in Majorelle blue on transparency, edge to edge,
    so it sits in the tab like the logo does in the header. It is drawn per
    size because the hairline outline vanishes at 16px; the small frames
    thicken the strokes just enough to stay legible.

Run tools/logo.py first; the icons read the mark it produces.

    python tools/icons.py
"""

import os

from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARK = os.path.join(ROOT, "assets", "img", "logo-mark-white.png")
OUT = os.path.join(ROOT, "assets", "icons")

BLUE = (48, 86, 205)  # --blue  oklch(0.5 0.19 266)
WHITE = (255, 255, 255)

WORK = 1024


def real_mark():
    """The clinic's monogram as an alpha mask, upscaled to the working size."""
    if not os.path.exists(MARK):
        raise SystemExit(f"Missing {MARK} — run `python tools/logo.py` first.")
    alpha = Image.open(MARK).convert("RGBA").getchannel("A")
    w, h = alpha.size
    scale = WORK / max(w, h)
    return alpha.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


# size: stroke growth. Growth is a max-filter kernel at 8x supersampling,
# so each step adds ~1/4px of stroke at the output size.
FAVICON = {16: 5, 32: 5, 48: 3, 64: 3}


def favicon_frame(mark, size, grow, ss=8):
    """The bare monogram at `size`, strokes thickened so the hairline survives."""
    w = size * ss
    h = round(mark.height * w / mark.width)
    scaled = mark.resize((w, h), Image.LANCZOS)
    if grow > 1:
        scaled = scaled.filter(ImageFilter.MaxFilter(grow))
    field = Image.new("L", (size * ss, size * ss), 0)
    field.paste(scaled, ((field.width - w) // 2, (field.height - h) // 2))
    img = Image.new("RGBA", (size, size), BLUE + (255,))
    img.putalpha(field.resize((size, size), Image.LANCZOS))
    return img


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

    # PWA / Android — real monogram, full-bleed square so it also works maskable
    for size in (192, 512):
        compose(size, mark, BLUE, WHITE, pad=0.20).convert("RGB").save(
            os.path.join(OUT, f"icon-{size}.png"), optimize=True
        )

    # iOS home screen — opaque; iOS applies its own corner mask
    compose(180, mark, BLUE, WHITE, pad=0.19).convert("RGB").save(
        os.path.join(OUT, "apple-touch-icon.png"), optimize=True
    )

    # Classic favicon — one hand-weighted frame per size
    frames = [favicon_frame(mark, size, grow) for size, grow in FAVICON.items()]
    frames[-1].save(
        os.path.join(OUT, "favicon.ico"),
        sizes=[f.size for f in frames],
        append_images=frames[:-1],
    )

    for f in sorted(os.listdir(OUT)):
        kb = os.path.getsize(os.path.join(OUT, f)) / 1024
        print(f"  {f:24s} {kb:6.1f} KB")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Responsive image pipeline for Centre Dentaire Majorelle.

Reads originals from assets/img/src/, writes AVIF + WebP + JPEG at several
widths into assets/img/, and records what it produced in manifest.json so the
build never writes a srcset entry for a file that does not exist.

Never upscales: a source narrower than a target width simply does not get that
step. Replace the originals with higher-resolution files and re-run.

    python tools/images.py
"""

import json
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "img", "src")
OUT = os.path.join(ROOT, "assets", "img")

STEPS = [640, 960, 1280, 1600, 1920]

# name -> dict(src, ratio, anchor, cap, quality overrides)
# `cap` limits the widest step; dense foliage and city detail cost far more
# bytes per pixel than a calm interior, and this one is lazy-loaded below the
# fold, so it does not need a 1920 step.
PLAN = {
    "reception":   dict(src="reception.png",   ratio=4 / 3,  anchor=0.50),
    "facade-nuit": dict(src="facade-nuit.png", ratio=4 / 3,  anchor=0.50),
    "tetouan":     dict(src="tetouan.jpg",     ratio=16 / 9, anchor=0.42,
                        cap=1280, quality={"jpg": 74, "webp": 68, "avif": 44}),
    # Portraits. Both sources are shot vertically; 4:5 is the tallest ratio the
    # `.figure` / `.slot--portrait` columns hold without pushing the copy beside
    # them off-screen. The anchors keep the subject's head, and the treatment
    # room's ceiling lights, inside the crop.
    "dr-zeguendry": dict(src="dr-zeguendry.png", ratio=4 / 5, anchor=0.35),
    "salle-soins":  dict(src="salle-soins.png",  ratio=4 / 5, anchor=0.45),
}

# Social card: one fixed-size crop, not a responsive set.
OG = ("reception.png", 1200, 630, 0.42)

QUALITY = {"jpg": 82, "webp": 80, "avif": 58}


def crop_to(im, ratio, anchor):
    """Crop to `ratio` keeping `anchor` (0=top, 1=bottom) as the focal band."""
    if ratio is None:
        return im
    w, h = im.size
    target_h = int(round(w / ratio))
    if target_h <= h:
        top = int(round((h - target_h) * anchor))
        return im.crop((0, top, w, top + target_h))
    target_w = int(round(h * ratio))
    left = int(round((w - target_w) / 2))
    return im.crop((left, 0, left + target_w, h))


def save_all(im, basename, width, quality=None):
    """Write one width in all three formats. Returns bytes written per format."""
    q = dict(QUALITY, **(quality or {}))
    sizes = {}
    for ext in ("avif", "webp", "jpg"):
        path = os.path.join(OUT, f"{basename}-{width}.{ext}")
        params = {"quality": q[ext]}
        if ext == "jpg":
            params.update(optimize=True, progressive=True, subsampling=1)
        elif ext == "webp":
            params.update(method=6)
        try:
            im.save(path, **params)
            sizes[ext] = os.path.getsize(path)
        except Exception as exc:  # AVIF is optional; the build still works without it
            print(f"    ! {ext} failed for {basename}-{width}: {exc}", file=sys.stderr)
            sizes[ext] = 0
    return sizes


def main():
    if not os.path.isdir(SRC):
        print(f"No source directory at {SRC}", file=sys.stderr)
        return 1
    os.makedirs(OUT, exist_ok=True)

    manifest = {}
    total = 0

    for name, spec in PLAN.items():
        path = os.path.join(SRC, spec["src"])
        if not os.path.exists(path):
            print(f"  skip {name}: {spec['src']} not found")
            continue

        im = Image.open(path)
        im = ImageOps.exif_transpose(im).convert("RGB")
        im = crop_to(im, spec.get("ratio"), spec.get("anchor", 0.5))
        native_w, native_h = im.size
        cap = min(spec.get("cap", native_w), native_w)

        widths = [w for w in STEPS if w <= cap]
        if not widths or widths[-1] != cap:
            widths.append(cap)  # always offer the widest step we are willing to serve

        produced = []
        for w in widths:
            h = int(round(w * native_h / native_w))
            resized = im.resize((w, h), Image.LANCZOS)
            sizes = save_all(resized, name, w, spec.get("quality"))
            total += sum(sizes.values())
            produced.append(w)

        # The manifest carries the widest step we actually serve; the markup
        # uses it for width/height, so the aspect ratio is exact either way.
        widest = produced[-1]
        manifest[name] = {
            "w": widest,
            "h": int(round(widest * native_h / native_w)),
            "widths": produced,
        }
        print(f"  {name:12s} {native_w}x{native_h}  ->  {', '.join(str(w) for w in produced)}")

    # Open Graph card
    src_file, og_w, og_h, og_anchor = OG
    og_path = os.path.join(SRC, src_file)
    if os.path.exists(og_path):
        im = ImageOps.exif_transpose(Image.open(og_path)).convert("RGB")
        im = crop_to(im, og_w / og_h, og_anchor).resize((og_w, og_h), Image.LANCZOS)
        out = os.path.join(OUT, "og.jpg")
        im.save(out, quality=86, optimize=True, progressive=True)
        total += os.path.getsize(out)
        manifest["og"] = {"w": og_w, "h": og_h, "widths": []}
        print(f"  {'og':12s} {og_w}x{og_h}  ->  og.jpg")

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2)

    print(f"  total {total / 1024:.0f} KB across {len(manifest)} images")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Generate the Open Graph social card at src/assets/social-card-2.png.

The card renders its text into pixels, so grep cannot find it. That once left
"Tandem Source to Apple Health sync" baked into the shared image after the copy
had moved on. Keep this script as the single source of that text and re-run it
whenever the wording changes.

Two things must stay in sync with the output:
  - the `og:image` filename in src/_includes/layouts/base.njk
  - the `og:image:alt` text, which must describe what the image actually says

Social platforms cache og:image by URL, so change the OUTPUT filename when the
artwork changes; replacing a file in place leaves already-scraped links showing
the old card indefinitely.

Usage: python3 tools/social-card.py
Requires Pillow and the DejaVu fonts.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets"
OUTPUT = ASSETS / "social-card-2.png"
ICON = ASSETS / "icon-512.png"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

WIDTH, HEIGHT = 1200, 630
TITLE = "PumpSync"
SUBTITLE = "Pump data to Apple Health sync"

# --brand-gradient from src/assets/styles.css
STOPS = ((8, 199, 183), (0, 143, 203), (1, 71, 168))
MIDPOINT = 0.45

# Keep the subtitle's right ink edge at or under this so it balances the
# icon's 120px left margin.
RIGHT_INK_BUDGET = 1080


def gradient() -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT))
    start, mid, end = STOPS
    for y in range(HEIGHT):
        for x in range(0, WIDTH, 4):
            t = (x / WIDTH + y / HEIGHT) / 2
            if t < MIDPOINT:
                u = t / MIDPOINT
                a, b = start, mid
            else:
                u = (t - MIDPOINT) / (1 - MIDPOINT)
                a, b = mid, end
            color = tuple(int(a[i] + (b[i] - a[i]) * u) for i in range(3))
            image.paste(color, (x, y, min(x + 4, WIDTH), y + 1))
    return image


def main() -> None:
    image = gradient()

    icon = Image.open(ICON).convert("RGBA").resize((300, 300), Image.LANCZOS)
    # icon-512.png is a square bitmap, so round the corners here to match the
    # app icon's shape.
    mask = Image.new("L", (300, 300), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, 300, 300], radius=66, fill=255)
    image.paste(icon, (120, 165), mask)

    draw = ImageDraw.Draw(image)
    draw.text((480, 225), TITLE, font=ImageFont.truetype(FONT, 96), fill=(255, 255, 255))

    subtitle_font = ImageFont.truetype(FONT, 29)
    draw.text((484, 352), SUBTITLE, font=subtitle_font, fill=(226, 244, 255))

    right_edge = 484 + draw.textlength(SUBTITLE, font=subtitle_font)
    if right_edge > RIGHT_INK_BUDGET:
        raise SystemExit(
            f"Subtitle runs to {right_edge:.0f}px, past the {RIGHT_INK_BUDGET}px budget. "
            "Shorten it or drop the font size."
        )

    image.save(OUTPUT, optimize=True)
    print(f"wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size} bytes)")
    print(f"subtitle right edge: {right_edge:.0f}px (budget {RIGHT_INK_BUDGET}px)")
    print(f'og:image:alt must read: "PumpSync — {SUBTITLE}"')


if __name__ == "__main__":
    main()

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
Requires Pillow. No font needs to be installed: the card is drawn with the same
two woff2 files the site serves from src/assets/fonts, so it matches the
rendered pages and follows the site's display/body split.

Text is placed by measured ink extents rather than baseline offsets, so the
layout survives a font change. The one metric-dependent guard left is the
right-edge budget, asserted before the image is written.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets"
FONTS = ASSETS / "fonts"
OUTPUT = ASSETS / "social-card-2.png"
ICON = ASSETS / "icon-512.png"

DISPLAY_FONT = FONTS / "HubotSans.woff2"  # the site's h1 face
BODY_FONT = FONTS / "MonaSans.woff2"  # the site's body face

WIDTH, HEIGHT = 1200, 630
TITLE = "PumpSync"
SUBTITLE = "Pump data to Apple Health sync"

# --brand-gradient from src/assets/styles.css
STOPS = ((8, 199, 183), (0, 143, 203), (1, 71, 168))
MIDPOINT = 0.45

ICON_BOX = (120, 165, 300)  # left, top, size — the 120px left margin sets the rhythm
TEXT_LEFT = 480
TITLE_SIZE, TITLE_WEIGHT = 104, 800
SUBTITLE_SIZE, SUBTITLE_WEIGHT = 30, 500
TITLE_GAP = 26  # ink-to-ink, so it does not drift with font metrics

# Keep the right ink edge at or under this so it balances the icon's left margin.
RIGHT_INK_BUDGET = 1080


def load_font(path: Path, size: int, weight: int) -> ImageFont.FreeTypeFont:
    """Load a repo-local variable woff2 pinned to one weight.

    No fallback font is substituted. The right-edge budget is measured in these
    faces' metrics, so a substitute would silently shift the text — the same
    reason the previous DejaVu-based version refused to substitute.
    """
    try:
        font = ImageFont.truetype(str(path), size)
    except OSError as error:
        raise SystemExit(
            f"Could not read {path.name}: {error}\n"
            "Pillow's FreeType must be >= 2.11 built with brotli to open woff2.\n"
            "Fix the toolchain (pip install -U pillow) rather than swapping the "
            "font: the layout budget is measured in these faces' metrics."
        ) from error

    # Match axes by name: the two faces do not share an axis order, and Mona Sans
    # has an optical-size axis that Hubot Sans does not.
    coordinates = []
    for axis in font.get_variation_axes():
        name = axis["name"]
        name = name.decode() if isinstance(name, bytes) else name
        if name == "Weight":
            coordinates.append(weight)
        elif name == "Optical size":
            # px -> pt, mirroring the browser's font-optical-sizing: auto.
            coordinates.append(size * 0.75)
        else:
            coordinates.append(axis["default"])
    font.set_variation_by_axes(coordinates)
    return font


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


def ink_size(draw, text, font):
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    return right - left, bottom - top


def draw_at_ink(draw, xy, text, font, fill):
    """Draw so the text's top-left INK corner lands on xy; return its ink box."""
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    draw.text((xy[0] - left, xy[1] - top), text, font=font, fill=fill)
    return (xy[0], xy[1], xy[0] + (right - left), xy[1] + (bottom - top))


def main() -> None:
    image = gradient()

    icon_left, icon_top, icon_size = ICON_BOX
    icon = Image.open(ICON).convert("RGBA").resize((icon_size, icon_size), Image.LANCZOS)
    # icon-512.png is a square bitmap, so round the corners here to match the
    # app icon's shape.
    mask = Image.new("L", (icon_size, icon_size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, icon_size, icon_size], radius=66, fill=255)
    image.paste(icon, (icon_left, icon_top), mask)

    draw = ImageDraw.Draw(image)
    title_font = load_font(DISPLAY_FONT, TITLE_SIZE, TITLE_WEIGHT)
    subtitle_font = load_font(BODY_FONT, SUBTITLE_SIZE, SUBTITLE_WEIGHT)

    # Centre the text block against the icon so the two read as one unit.
    _, title_height = ink_size(draw, TITLE, title_font)
    _, subtitle_height = ink_size(draw, SUBTITLE, subtitle_font)
    block_height = title_height + TITLE_GAP + subtitle_height
    block_top = icon_top + (icon_size - block_height) // 2

    title_box = draw_at_ink(draw, (TEXT_LEFT, block_top), TITLE, title_font, (255, 255, 255))
    subtitle_box = draw_at_ink(
        draw, (TEXT_LEFT, title_box[3] + TITLE_GAP), SUBTITLE, subtitle_font, (226, 244, 255)
    )

    right_edge = max(title_box[2], subtitle_box[2])
    if right_edge > RIGHT_INK_BUDGET:
        raise SystemExit(
            f"Text runs to {right_edge:.0f}px, past the {RIGHT_INK_BUDGET}px budget. "
            "Shorten it or drop the font size."
        )

    image.save(OUTPUT, optimize=True)
    print(f"wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size} bytes)")
    print(f"right ink edge: {right_edge:.0f}px (budget {RIGHT_INK_BUDGET}px)")
    print(f'og:image:alt must read: "PumpSync — {SUBTITLE}"')


if __name__ == "__main__":
    main()

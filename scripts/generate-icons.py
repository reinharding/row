# scripts/generate-icons.py
"""Generate placeholder PWA icons for row. Re-run after swapping in
real branding by editing BG_COLOR / FG_COLOR / GLYPH below."""
from PIL import Image, ImageDraw, ImageFont
import os

BG_COLOR = (20, 19, 26, 255)     # matches --bg from the dark-pastel palette
FG_COLOR = (199, 184, 240, 255)  # lilac accent
GLYPH = "R"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")


def load_font(size):
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make_icon(size, maskable, out_path):
    img = Image.new("RGBA", (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)
    # Maskable icons must be edge-to-edge, with important content inside
    # the centered 80%-diameter safe circle (W3C manifest spec); regular
    # icons get a slightly bigger glyph since nothing gets cropped.
    glyph_size = int(size * (0.42 if maskable else 0.5))
    font = load_font(glyph_size)
    bbox = draw.textbbox((0, 0), GLYPH, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1]), GLYPH, font=font, fill=FG_COLOR)
    img.save(out_path)


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    make_icon(192, False, os.path.join(OUT_DIR, "icon-192.png"))
    make_icon(512, False, os.path.join(OUT_DIR, "icon-512.png"))
    make_icon(512, True, os.path.join(OUT_DIR, "icon-maskable-512.png"))
    print("Wrote icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png")

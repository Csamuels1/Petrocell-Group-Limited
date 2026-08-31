from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/source"
LOGOS = ROOT / "public/assets/logo"
IMAGES = ROOT / "public/assets/images"
SOCIAL = ROOT / "public/assets/social"


def padded_box(box, size, padding=18):
    return (
        max(0, box[0] - padding),
        max(0, box[1] - padding),
        min(size[0], box[2] + padding),
        min(size[1], box[3] + padding),
    )


def process_group_logo():
    source = Image.open(SOURCE / "petrocell-group-primary-original.jpg").convert("RGB")
    pixels = np.asarray(source).astype(np.int16)
    red, green, blue = pixels[:, :, 0], pixels[:, :, 1], pixels[:, :, 2]
    score = np.clip((red - blue) * 2.7 + (green - blue) * 1.25 - 35, 0, 255)
    score = np.where((red > 70) & (green > 55), score, 0).astype(np.uint8)
    mask = Image.fromarray(score).filter(ImageFilter.GaussianBlur(0.45))
    gold = Image.new("RGBA", source.size, (201, 151, 42, 0))
    gold.putalpha(mask)

    wordmark = gold.crop(padded_box(mask.getbbox(), source.size))
    wordmark.thumbnail((1500, 420), Image.Resampling.LANCZOS)
    wordmark.save(LOGOS / "petrocell-group-logo.png", optimize=True)

    icon_width = int(source.width * 0.36)
    icon_mask = mask.crop((0, 0, icon_width, source.height))
    icon_box = padded_box(icon_mask.getbbox(), (icon_width, source.height))
    icon = gold.crop(icon_box)
    icon.thumbnail((640, 640), Image.Resampling.LANCZOS)
    icon.save(LOGOS / "petrocell-group-icon.png", optimize=True)


def process_connect_logo():
    source = Image.open(SOURCE / "petrocell-connect-original.jpg").convert("RGB")
    pixels = np.asarray(source)
    chroma = pixels.max(axis=2) - pixels.min(axis=2)
    colored = (chroma > 22) & ((pixels[:, :, 2] > pixels[:, :, 1]) | (pixels[:, :, 1] > pixels[:, :, 0]))
    mask = Image.fromarray(colored.astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(0.35))
    logo = source.convert("RGBA")
    logo.putalpha(mask)
    logo = logo.crop(padded_box(mask.getbbox(), source.size, 12))
    logo.thumbnail((1100, 500), Image.Resampling.LANCZOS)
    logo.save(LOGOS / "petrocell-connect-logo.png", optimize=True)


def process_photography():
    portrait = Image.open(SOURCE / "chairman-headshot-original.jpg").convert("RGB")
    portrait.thumbnail((1200, 1600), Image.Resampling.LANCZOS)
    portrait.save(IMAGES / "chimezie-ifeanyi-samuel.webp", "WEBP", quality=86, method=4)

    group = Image.open(SOURCE / "petrocell-group-primary-original.jpg").convert("RGB")
    social = ImageOps.fit(group, (1200, 630), method=Image.Resampling.LANCZOS)
    social.save(SOCIAL / "petrocell-group-og.jpg", "JPEG", quality=88, optimize=True)


if __name__ == "__main__":
    process_group_logo()
    process_connect_logo()
    process_photography()

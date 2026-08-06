from PIL import Image
from collections import deque
from pathlib import Path

src_dir = Path(r"C:\Users\miche\.cursor\projects\c-Users-miche-Desktop-demo-cantina-altura\assets")
dst_dir = Path(r"C:\Users\miche\Desktop\demo-cantina-altura\public\images\bottles")
dst_dir.mkdir(parents=True, exist_ok=True)

# Numbers we generated (skip 14,15,17,27 already copied from featured bottles; skip 06 wine-box)
nums = [
    1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29
]


def remove_bg(img: Image.Image, threshold=245, soft=18) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (r, g, b, 0)
            elif r >= threshold - soft and g >= threshold - soft and b >= threshold - soft:
                brightness = (r + g + b) / 3
                t = (brightness - (threshold - soft)) / soft
                t = max(0.0, min(1.0, t))
                alpha = int(255 * (1.0 - t))
                pixels[x, y] = (r, g, b, min(a, alpha))
    return img


def is_bg(r, g, b, a) -> bool:
    if a < 10:
        return True
    if r > 230 and g > 230 and b > 230:
        return True
    mx, mn = max(r, g, b), min(r, g, b)
    if mn > 210 and (mx - mn) < 25:
        return True
    return False


def flood_corners(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]
    q = deque()
    seeds = [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (w // 2, 0),
        (0, h // 2),
        (w - 1, h // 2),
        (w // 2, h - 1),
    ]
    for s in seeds:
        q.append(s)
        visited[s[1]][s[0]] = True

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        if not is_bg(r, g, b, a):
            continue
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                nr, ng, nb, na = px[nx, ny]
                if is_bg(nr, ng, nb, na) or (
                    na > 0
                    and nr > 200
                    and ng > 200
                    and nb > 200
                    and max(nr, ng, nb) - min(nr, ng, nb) < 40
                ):
                    visited[ny][nx] = True
                    q.append((nx, ny))
    return img


def trim(img: Image.Image, pad=12) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(img.width, r + pad)
    b = min(img.height, b + pad)
    return img.crop((l, t, r, b))


for n in nums:
    src = src_dir / f"bottle-{n:02d}-gen.png"
    dst = dst_dir / f"bottle-{n:02d}.png"
    if not src.exists():
        print(f"MISSING {src.name}")
        continue
    im = Image.open(src)
    im = remove_bg(im)
    im = flood_corners(im)
    im = trim(im)
    max_h = 1400
    if im.height > max_h:
        ratio = max_h / im.height
        im = im.resize((int(im.width * ratio), max_h), Image.Resampling.LANCZOS)
    im.save(dst, "PNG", optimize=True)
    print(f"OK {dst.name}: {im.size} bytes={dst.stat().st_size}")

print("done")

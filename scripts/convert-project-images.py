from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = REPO_ROOT / "images-src"
OUT_DIR = REPO_ROOT / "public" / "images"
FILES = [
    "pontocorte.png",
    "nerdolaminer.png",
    "skyfashion.png",
    "ntinformatica.png",
    "lgf-contabilidade.png",
    "transcende.png",
    "frota-segura.png",
    "atrio.png",
    "syncfinance.png",
    "horientando.png",
    "guicodex.png",
]
# Capturas que ficam na proporção original (sem corte lateral nem preenchimento).
# O valor é (esquerda, topo, direita): quantos px cortar de cada borda
# (faixa de progresso, borda da janela, barra de rolagem).
NATIVE_RATIO = {
    "pontocorte.png": (10, 2, 0),
    "frota-segura.png": (0, 0, 0),
}

# Recorte de uma área da captura (esquerda, topo, direita, base), redimensionado
# para a largura alvo. Usado em painéis densos ou telas largas em cards 16:10.
CROP_BOX = {
    "atrio.png": (0, 2, 712, 447),  # 16:10 preenchendo o card (hero + chat)
    "ntinformatica.png": (40, 0, 824, 490),  # 16:10 preenchendo o card (hero + painel)
}
TARGET_W, TARGET_H = 1280, 800  # 16:10
TARGET_RATIO = TARGET_W / TARGET_H


def crop_top_center(img: Image.Image) -> Image.Image:
    w, h = img.size
    current = w / h
    if current > TARGET_RATIO:
        new_w = int(h * TARGET_RATIO)
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:
        new_h = int(w / TARGET_RATIO)
        box = (0, 0, w, new_h)
    return img.crop(box)


def edge_background_color(img: Image.Image) -> tuple:
    """Média das cores das bordas superior e inferior (fundo da captura)."""
    w, h = img.size
    samples = [img.getpixel((x, 0)) for x in range(0, w, 50)]
    samples += [img.getpixel((x, h - 1)) for x in range(0, w, 50)]
    channels = list(zip(*samples))
    return tuple(sum(c) // len(c) for c in channels)


def fit_on_canvas(img: Image.Image) -> Image.Image:
    w, h = img.size
    scale = min(TARGET_W / w, TARGET_H / h, 1.0)
    new_w, new_h = round(w * scale), round(h * scale)
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (TARGET_W, TARGET_H), edge_background_color(img))
    canvas.paste(resized, ((TARGET_W - new_w) // 2, (TARGET_H - new_h) // 2))
    return canvas


def fit_width_native(img: Image.Image, trim: tuple = (0, 0, 0)) -> Image.Image:
    trim_left, trim_top, trim_right = trim
    if trim_left or trim_top or trim_right:
        img = img.crop((trim_left, trim_top, img.size[0] - trim_right, img.size[1]))
    w, h = img.size
    return img.resize((TARGET_W, round(h * TARGET_W / w)), Image.Resampling.LANCZOS)


def main() -> None:
    for name in FILES:
        src = SRC_DIR / name
        if not src.exists():
            print(f"MISSING {name}")
            continue
        with Image.open(src) as im:
            rgb = im.convert("RGB")
            w, h = rgb.size
            if name in CROP_BOX:
                region = rgb.crop(CROP_BOX[name])
                rw, rh = region.size
                final = region.resize((TARGET_W, round(rh * TARGET_W / rw)), Image.Resampling.LANCZOS)
            elif name in NATIVE_RATIO:
                final = fit_width_native(rgb, NATIVE_RATIO[name])
            elif w < TARGET_W or h < TARGET_H:
                # Fonte menor que o alvo: encaixar inteira no quadro 16:10,
                # sem upscale, preenchendo as bordas com a cor de fundo da captura
                final = fit_on_canvas(rgb)
            else:
                cropped = crop_top_center(rgb)
                final = cropped.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
            out = OUT_DIR / f"{src.stem}.webp"
            final.save(out, "WEBP", quality=82, method=6)
            kb = out.stat().st_size / 1024
            print(f"{out.name}: {kb:.1f} KB ({w}x{h} -> {final.size[0]}x{final.size[1]})")


if __name__ == "__main__":
    main()

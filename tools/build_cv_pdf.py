"""Genera los CV visuales y ATS en español e inglés.

Cada salida se imprime y comprime en un solo flujo. No deja .original.pdf ni
archivos intermedios. Chrome headless se lanza aislado (no cierra el navegador
del usuario).
"""

from __future__ import annotations

import io
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import pikepdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
VISUAL_HTML = ROOT / "assets" / "cv-document" / "index.html"
ATS_HTML = ROOT / "assets" / "cv-document" / "ats.html"
CV_DIR = ROOT / "assets" / "cv-document"
BUILDS = (
    ("visual-es", VISUAL_HTML, "es", CV_DIR / "es" / "Kevin-Ayala-CV.pdf"),
    ("visual-en", VISUAL_HTML, "en", CV_DIR / "en" / "Kevin-Ayala-Resume.pdf"),
    ("ats-es", ATS_HTML, "es", CV_DIR / "es" / "Kevin-Ayala-CV-ATS.pdf"),
    ("ats-en", ATS_HTML, "en", CV_DIR / "en" / "Kevin-Ayala-Resume-ATS.pdf"),
)

MIN_BYTES = 20_000
MAX_EDGE = 1400
JPEG_QUALITY = 78

CHROME_CANDIDATES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path.home() / r"AppData\Local\Google\Chrome\Application\chrome.exe",
]


def find_chrome() -> Path:
    for path in CHROME_CANDIDATES:
        if path.is_file():
            return path
    raise FileNotFoundError("No se encontro Chrome. Instala Google Chrome o ajusta CHROME_CANDIDATES.")


def as_pil(stream: pikepdf.Stream) -> Image.Image | None:
    try:
        return pikepdf.PdfImage(stream).as_pil_image()
    except Exception:
        return None


def replace_with_jpeg(stream: pikepdf.Stream, pil: Image.Image, gray: bool) -> int:
    try:
        raw_len = len(stream.read_raw_bytes())
    except Exception:
        return 0

    pil = pil.convert("L" if gray else "RGB")
    if max(pil.size) > MAX_EDGE:
        scale = MAX_EDGE / max(pil.size)
        pil = pil.resize(
            (max(1, round(pil.width * scale)), max(1, round(pil.height * scale))),
            Image.Resampling.LANCZOS,
        )

    buf = io.BytesIO()
    pil.save(buf, "JPEG", quality=JPEG_QUALITY, optimize=True)
    data = buf.getvalue()
    if len(data) >= raw_len:
        return 0

    stream.write(data, filter=pikepdf.Name("/DCTDecode"))
    stream["/Width"] = pil.width
    stream["/Height"] = pil.height
    stream["/ColorSpace"] = pikepdf.Name("/DeviceGray" if gray else "/DeviceRGB")
    stream["/BitsPerComponent"] = 8
    for key in ("/Decode", "/DecodeParms"):
        if key in stream:
            del stream[key]
    return raw_len - len(data)


def recompress(pdf: pikepdf.Pdf) -> int:
    saved = 0
    smasks = set()
    images = [
        obj
        for obj in pdf.objects
        if isinstance(obj, pikepdf.Stream) and obj.get("/Subtype") == "/Image"
    ]
    for stream in images:
        smask = stream.get("/SMask")
        if smask is not None:
            smasks.add(smask.objgen)

    for stream in images:
        is_mask = stream.objgen in smasks
        try:
            if len(stream.read_raw_bytes()) < MIN_BYTES:
                continue
        except Exception:
            continue
        if stream.get("/ImageMask"):
            continue
        pil = as_pil(stream)
        if pil is None:
            continue
        if pil.mode in ("RGBA", "LA", "PA"):
            if "/SMask" not in stream:
                continue
            pil = pil.convert("RGB")
        saved += replace_with_jpeg(stream, pil, gray=is_mask or pil.mode == "L")
    return saved


def print_html_to_pdf(html: Path, dest: Path, lang: str) -> None:
    chrome = find_chrome()
    uri = html.resolve().as_uri()
    if lang == "en":
        uri += "?lang=en"
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        dest.unlink()

    # Perfil temporal aislado: no toca la sesion Chrome del usuario.
    profile = tempfile.mkdtemp(prefix="cv-chrome-")
    try:
        cmd = [
            str(chrome),
            "--headless=new",
            "--disable-gpu",
            f"--user-data-dir={profile}",
            "--no-first-run",
            "--no-default-browser-check",
            "--no-pdf-header-footer",
            f"--print-to-pdf={dest}",
            uri,
        ]
        subprocess.run(cmd, check=True, timeout=90)
        # Headless a veces escribe el archivo un instante despues de salir.
        for _ in range(20):
            if dest.exists() and dest.stat().st_size > 10_000:
                break
            time.sleep(0.15)
        if not dest.exists() or dest.stat().st_size < 10_000:
            raise RuntimeError(f"Chrome no genero un PDF valido en {dest}")
    finally:
        shutil.rmtree(profile, ignore_errors=True)


def compress_to(src: Path, dest: Path) -> tuple[int, int, int]:
    before = src.stat().st_size
    with pikepdf.open(src) as pdf:
        saved = recompress(pdf)
        # Escribe a un temporal y renombra: evita dejar un PDF grande a medias.
        tmp = dest.with_suffix(".tmp.pdf")
        if tmp.exists():
            tmp.unlink()
        pdf.save(
            tmp,
            compress_streams=True,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            linearize=True,
        )
    if dest.exists():
        dest.unlink()
    os.replace(tmp, dest)
    after = dest.stat().st_size
    return before, after, saved


def main() -> None:
    templates = {html for _, html, _, _ in BUILDS}
    missing = [html for html in templates if not html.is_file()]
    if missing:
        raise SystemExit(f"No existe el template: {missing[0]}")

    with tempfile.TemporaryDirectory(prefix="cv-build-") as tmpdir:
        for label, html, lang, out in BUILDS:
            raw = Path(tmpdir) / f"raw-{label}.pdf"
            print(f"[{label}] imprimiendo HTML…")
            print_html_to_pdf(html, raw, lang)
            print(f"[{label}] comprimiendo…")
            before, after, saved = compress_to(raw, out)

            # Limpia residuales de procesos antiguos si quedaron.
            for leftover in (
                out.with_suffix(".original.pdf"),
                out.with_suffix(".tmp.pdf"),
            ):
                if leftover.exists():
                    leftover.unlink()

            print(f"[{label}] listo  {out}")
            print(f"     {before / 1024 / 1024:.2f} MB -> {after / 1024 / 1024:.2f} MB")
            print(f"     ahorro {(before - after) / 1024 / 1024:.2f} MB (imagenes: {saved / 1024:.0f} KB)")


if __name__ == "__main__":
    main()

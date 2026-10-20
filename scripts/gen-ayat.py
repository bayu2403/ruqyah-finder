import json
import re
import sys

src, out = sys.argv[1], sys.argv[2]
quran = {s["id"]: s for s in json.load(open(src, encoding="utf-8"))}

SELECTION = [
    ("al-fatihah", 1, None, "Al-Fatihah", "Dibaca di awal. Rasulullah ﷺ membenarkan sahabat yang meruqyah dengan Al-Fatihah (HR. Bukhari & Muslim)."),
    ("ayat-kursi", 2, [255], "Ayat Kursi (Al-Baqarah: 255)", "Siapa membacanya sebelum tidur, ia senantiasa dijaga oleh Allah dan setan tidak mendekatinya hingga pagi (HR. Bukhari)."),
    ("akhir-al-baqarah", 2, [285, 286], "Dua ayat terakhir Al-Baqarah (285–286)", "Siapa membacanya di malam hari, keduanya mencukupinya (HR. Bukhari & Muslim)."),
    ("al-ikhlas", 112, None, "Al-Ikhlas", "Bersama Al-Falaq dan An-Nas (al-mu'awwidzat) dibaca 3 kali, lalu ditiupkan ke telapak tangan dan diusapkan ke tubuh (HR. Bukhari)."),
    ("al-falaq", 113, None, "Al-Falaq", "Perlindungan dari kejahatan makhluk, sihir, dan hasad."),
    ("an-nas", 114, None, "An-Nas", "Perlindungan dari bisikan setan dari golongan jin dan manusia."),
]

sections = []
for key, surah, ayat, title, note in SELECTION:
    s = quran[surah]
    verses = [v for v in s["verses"] if ayat is None or v["id"] in ayat]
    sections.append({
        "id": key,
        "title": title,
        "surah": s["transliteration"],
        "surahNumber": surah,
        "note": note,
        "verses": [{"number": v["id"], "arabic": v["text"], "translation": re.sub(r"(?<=[^\s\d(])\d+\)", "", v["translation"])} for v in verses],
    })

with open(out, "w", encoding="utf-8") as f:
    f.write("// Generated from the quran-json package (v3.1.2): Uthmani text from QuranEnc,\n")
    f.write("// Indonesian translation by Kementerian Agama RI. License CC BY-SA 4.0.\n")
    f.write("// Do not hand-edit the Arabic; regenerate from the source instead.\n\n")
    f.write("export type AyatSection = {\n  id: string;\n  title: string;\n  surah: string;\n  surahNumber: number;\n  note: string;\n  verses: { number: number; arabic: string; translation: string }[];\n};\n\n")
    f.write("export const AYAT_RUQYAH: AyatSection[] = ")
    f.write(json.dumps(sections, ensure_ascii=False, indent=2))
    f.write(";\n")

print("sections:", len(sections), "verses:", sum(len(s["verses"]) for s in sections))

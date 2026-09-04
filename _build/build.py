# -*- coding: utf-8 -*-
"""Сборка посадочных страниц и sitemap.xml.  Запуск: python3 _build/build.py"""
import os, sys, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shell
from pages import PAGES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = datetime.date.today().isoformat()

for p in PAGES:
    d = os.path.join(ROOT, p["path"].strip("/"))
    os.makedirs(d, exist_ok=True)
    out = os.path.join(d, "index.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(shell.render(p))
    print("  {:<34} {:>6} байт".format(p["path"], os.path.getsize(out)))

# ── sitemap ──────────────────────────────────────────────
urls = [("/", "1.0")] + [(p["path"], "0.9") for p in PAGES]
body = "\n".join(
    '  <url>\n    <loc>{}{}</loc>\n    <lastmod>{}</lastmod>\n'
    '    <changefreq>monthly</changefreq>\n    <priority>{}</priority>\n  </url>'
    .format(shell.SITE, u, TODAY, pr) for u, pr in urls)
sm = ('<?xml version="1.0" encoding="UTF-8"?>\n'
      '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n'
      .replace("www.sitemap.org", "www.sitemaps.org") + body + "\n</urlset>\n")
with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sm)
print("\n  sitemap.xml — {} адресов".format(len(urls)))

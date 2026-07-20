import os
from urllib.parse import quote

ROOT = r"C:\Users\26323\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a5db0d39e70fdf4afc5349f\public"
BASE = "https://njmsf.top"

pages = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if not d.startswith('.')]
    for fn in filenames:
        if fn.lower().endswith(('.html', '.htm')):
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT).replace(os.sep, '/')
            # percent-encode each path segment (handles Chinese filenames)
            enc = '/'.join(quote(seg, safe='') for seg in rel.split('/'))
            pages.append(f"{BASE}/{enc}")

pages = sorted(set(pages))

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p in pages:
    out.append('  <url>')
    out.append(f'    <loc>{p}</loc>')
    out.append('  </url>')
out.append('</urlset>')

with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(out) + '\n')

print(f"Wrote {len(pages)} URLs to sitemap.xml")
for p in pages:
    print(p)

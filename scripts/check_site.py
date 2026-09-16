"""Check rendered local links, assets, and the library's one-entry-per-note rule."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
import json

SITE = Path(__file__).resolve().parents[1] / '_site'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.ids = set(); self.library_urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'): self.ids.add(attrs['id'])
        key = 'href' if tag in ('a', 'link') else 'src' if tag in ('img', 'script') else None
        if key and attrs.get(key): self.links.append((tag, attrs[key]))

pages = {}
for file in SITE.rglob('*.html'):
    page = Page(); page.feed(file.read_text()); pages[file] = page
broken = []
for file, page in pages.items():
    for tag, href in page.links:
        url = urlsplit(href)
        if url.scheme or url.netloc: continue
        resolved = urlsplit(urljoin('/' + str(file.relative_to(SITE)), href))
        target = SITE / unquote(resolved.path).lstrip('/')
        if target.is_dir(): target /= 'index.html'
        if not target.exists(): broken.append({'source': str(file.relative_to(SITE)), 'target': href})
# The note library is complete, links resolve, and generated routes are unique.
assert (SITE / 'notes/index.html').exists()
library_page = pages[SITE / 'notes/index.html']
# Content links point to note routes; exclude shared navigation/footer routes.
shared = {'/', '/zh/', '/zh/projects/', '/zh/publications/', '/notes/', '#main'}
notes = [h for tag,h in library_page.links if tag == 'a' and h not in shared and not urlsplit(h).scheme]
assert len(notes) == len(set(notes)), 'Duplicate note routes in library'
audit = json.loads((SITE.parent / 'docs/notes-audit.json').read_text())
assert len(notes) == audit['library_documents'], 'Library entries missing'
report = {'pages':len(pages), 'library_entries':len(notes), 'broken_local_links_or_assets':broken}
(SITE.parent/'docs/link-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
assert not broken, f'{len(broken)} broken links or assets'

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { RENDER_WORKER_DOWNLOAD, STANDALONE_DOWNLOADS } from '../src/lib/productDownloads.js';

const viz = STANDALONE_DOWNLOADS.find(item => item.productId === 'power-surfacing-visualize');
for (const [name, release] of [['Render Worker', RENDER_WORKER_DOWNLOAD], ['VIZ Windows', viz], ['VIZ Mac', viz.macDownload]]) {
  test(`${name} has a build date matching its published installer and checksum`, async () => {
    assert.match(release.buildDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(`${release.buildDate}T00:00:00Z`).toISOString().slice(0, 10), release.buildDate);
    const filename = release.url.split('/').pop();
    const compactDate = release.buildDate.replaceAll('-', '');
    assert.ok(filename.replaceAll('.', '').includes(compactDate), 'Build date must match the dated installer');
    assert.ok(release.checksumUrl.includes(compactDate), 'Checksum must belong to the same build');
    const checksum = await readFile(new URL('../public' + release.checksumUrl, import.meta.url), 'utf8');
    assert.match(checksum, /^[a-f0-9]{64}\s+/i);
    assert.ok(checksum.includes(filename), 'Checksum must name the published installer');
  });
}

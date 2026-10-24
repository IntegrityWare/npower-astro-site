import test from 'node:test';
import assert from 'node:assert/strict';
import { legacyDownloadDestination } from '../src/lib/downloadChoices.js';

test('existing standalone download bookmarks retain their product destination', () => {
  for (const anchor of ['standalone', 'visualize', 'studio', 're-studio', 'render-worker']) {
    assert.equal(legacyDownloadDestination('#' + anchor), '/pricing/downloads/studio/#' + anchor);
  }
});

test('existing SOLIDWORKS installer and documentation bookmarks retain their destination', () => {
  for (const anchor of ['solidworks', 'power-surfacing', 'power-shell', 'documentation']) {
    assert.equal(legacyDownloadDestination('#' + anchor), '/pricing/downloads/solidworks/#' + anchor);
  }
});

test('generic or unknown bookmarks leave the family chooser available', () => {
  for (const hash of ['', '#all-products', '#unknown', '#https://example.com', '#__proto__']) {
    assert.equal(legacyDownloadDestination(hash), null);
  }
});

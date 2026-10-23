import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { build } from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const names = [
  'index.html', 'styles.css', 'curriculum.css', 'curriculum.js',
  'lesson-content.js', 'lesson-prompts.js', 'data.js', 'app.js'
];
const entries = await Promise.all(names.map(async name => [name, await readFile(join(root, 'site-assets', name), 'utf8')]));
const assets = Object.fromEntries(entries);
const worker = await readFile(join(root, 'worker', 'index.js'), 'utf8');
const source = worker.replace('/* __EMBED_ASSETS__ */', `const embeddedAssets = ${JSON.stringify(assets)};`);
if (source === worker) throw new Error('Asset insertion point is missing');
const result = await build({
  stdin: { contents: source, resolveDir: root, sourcefile: 'worker/index.js', loader: 'js' },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  conditions: ['workerd', 'worker', 'browser'],
  logLevel: 'warning'
});
const output = result.outputFiles[0].text;
const dist = join(root, 'dist');
await mkdir(join(dist, 'server'), { recursive: true });
await mkdir(join(dist, '.openai'), { recursive: true });
await writeFile(join(dist, 'server', 'index.js'), output);
await writeFile(join(dist, '.openai', 'hosting.json'), await readFile(join(root, '.openai', 'hosting.json')));
console.log(`Built protected Worker with ${names.length} course assets`);

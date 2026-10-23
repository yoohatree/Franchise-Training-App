import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = join(root, 'site-assets');
const output = join(root, 'vercel-preview');
const assets = [
  'styles.css', 'curriculum.css', 'curriculum.js', 'lesson-content.js',
  'lesson-prompts.js', 'data.js', 'app.js'
];

await mkdir(output, { recursive: true });
await Promise.all(assets.map(name => copyFile(join(source, name), join(output, name))));

let html = await readFile(join(source, 'index.html'), 'utf8');
html = html.replace(
  '<body>',
  `<body><div class="preview-banner" role="status">관리자용 교육 화면 미리보기 · 직원 승인 및 로그인 기능은 기존 교육 사이트에서 이용하세요.</div>`
);
html = html.replace(
  '<strong>승인된 학습자 전용</strong><small>이메일 계정으로 접근</small>',
  '<strong>관리자 미리보기</strong><small>Vercel 계정으로 접근</small>'
);
html = html.replace(
  '<span class="avatar" aria-label="학습자">Y</span>',
  '<span class="avatar" aria-label="관리자 미리보기">Y</span>'
);
html = html.replace(
  '</head>',
  `<style>.preview-banner{position:relative;z-index:1000;padding:10px 20px;background:#173d33;color:#fff;text-align:center;font:700 13px/1.5 'Noto Sans KR',sans-serif}</style></head>`
);
await writeFile(join(output, 'index.html'), html);
console.log(`Built Vercel administrator preview with ${assets.length} course assets`);

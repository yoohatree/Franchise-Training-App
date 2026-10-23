/* __EMBED_ASSETS__ */

const OWNER_EMAIL = 'yoohatree@gmail.com';
const ASSET_NAMES = new Set(Object.keys(embeddedAssets));
const NO_STORE = { 'cache-control': 'private, no-store, max-age=0', 'x-content-type-options': 'nosniff' };

function html(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function response(body, status = 200, contentType = 'text/html; charset=utf-8') {
  return new Response(body, { status, headers: { ...NO_STORE, 'content-type': contentType } });
}

function redirect(path) {
  return new Response(null, { status: 303, headers: { ...NO_STORE, location: path } });
}

function identity(request) {
  const id = request.headers.get('oai-authenticated-user-id');
  const email = request.headers.get('oai-authenticated-user-email');
  if (!id || !email) return null;
  return { id, email, isOwner: email.toLowerCase() === OWNER_EMAIL };
}

function keyFor(id) {
  return `requests/${encodeURIComponent(id)}.json`;
}

async function recordFor(bucket, id) {
  const object = await bucket.get(keyFor(id));
  if (!object) return null;
  try { return await object.json(); } catch { return null; }
}

async function saveRecord(bucket, record) {
  await bucket.put(keyFor(record.id), JSON.stringify(record), { httpMetadata: { contentType: 'application/json' } });
}

function validPost(request) {
  const origin = request.headers.get('origin');
  return origin === new URL(request.url).origin;
}

function shell(title, body, { refresh = false } = {}) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${refresh ? '<meta http-equiv="refresh" content="30">' : ''}<title>${html(title)} · Yoohastree Franchise Training</title><style>
    :root{font-family:'Noto Sans KR',system-ui,sans-serif;color:#193b32;background:#f5f8f3}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 80% 10%,#e8f2da,transparent 35%),#f5f8f3}header{padding:25px clamp(20px,5vw,64px);display:flex;justify-content:space-between;gap:16px;align-items:center;border-bottom:1px solid #dfe8dc;background:#fff}header strong{font-size:16px;letter-spacing:.1em}header span{font-size:12px;color:#6c8777}main{max-width:860px;margin:70px auto;padding:0 20px 70px}.card{background:#fff;border:1px solid #dfebde;border-radius:18px;padding:clamp(26px,5vw,52px);box-shadow:0 20px 60px #1b4a3220}.eyebrow{font-size:11px;font-weight:800;letter-spacing:.17em;color:#6c9b60}h1{font-size:clamp(26px,4vw,38px);letter-spacing:-.05em;margin:14px 0}h2{font-size:18px;margin:0 0 12px}p{line-height:1.8;color:#546d5c}small{color:#6b8172}a{color:#285c42}.button,button{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:9px;background:#193f34;color:#fff;padding:13px 20px;font-weight:800;font-size:14px;text-decoration:none;cursor:pointer}.button:hover,button:hover{background:#2b624c}.button.secondary,button.secondary{background:#e6f1dc;color:#225339}.button.danger,button.danger{background:#fff0e9;color:#914e39}form{margin:20px 0 0}.notice{margin-top:26px;padding:15px 18px;background:#edf5e8;border-radius:9px;color:#43634b;font-size:13px;line-height:1.7}.row{display:flex;justify-content:space-between;gap:18px;align-items:center;border-top:1px solid #e5ebe5;padding:18px 0}.row:first-child{border-top:0}.row strong,.row small{display:block}.row small{margin-top:5px}.actions{display:flex;gap:8px;flex-wrap:wrap}.actions form{margin:0}.grid{display:grid;gap:20px}.muted{color:#78907d;font-size:13px}.count{display:inline-block;background:#d8edc7;border-radius:20px;padding:3px 9px;color:#315d39;font-size:12px;margin-left:6px}
  </style></head><body><header><strong>YOOHASTREE</strong><span>FRANCHISE TRAINING</span></header><main>${body}</main></body></html>`;
}

function signInPage(returnTo) {
  const path = `/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`;
  return shell('직원 로그인', `<section class="card"><div class="eyebrow">STAFF ACCESS</div><h1>프랜차이즈 교육에 참여하세요</h1><p>직원 본인의 이메일로 로그인한 뒤 접속 승인을 요청할 수 있습니다. 교육 자료는 대표님의 승인을 받은 계정에만 제공됩니다.</p><a class="button" href="${path}" target="_top">로그인하고 승인 요청하기 ↗</a><div class="notice">승인 요청에 사용한 이메일과 이후 로그인할 이메일은 같아야 합니다.</div></section>`);
}

function requestPage(user, record) {
  const state = record?.status;
  const title = state === 'pending' ? '승인 대기 중' : state === 'rejected' ? '접속 승인 요청' : '접속 승인 요청';
  const lead = state === 'pending'
    ? '대표님께 승인 요청이 전달되었습니다. 승인되면 이 페이지를 새로고침하여 교육에 접속할 수 있습니다.'
    : state === 'rejected'
      ? '이전 요청이 승인되지 않았습니다. 다시 요청하려면 아래 버튼을 누르세요.'
      : '아래 버튼을 누르면 대표님에게 접속 승인 요청이 등록됩니다.';
  const action = state === 'pending'
    ? '<a class="button secondary" href="/">승인 상태 새로고침 ↻</a>'
    : '<form method="post" action="/api/request"><button type="submit">접속 승인 요청하기 ↗</button></form>';
  return shell(title, `<section class="card"><div class="eyebrow">ACCESS REQUEST</div><h1>${title}</h1><p>${lead}</p><div class="notice">요청 계정: <strong>${html(user.email)}</strong><br>승인 전에는 교육 내용에 접근할 수 없습니다.</div>${action}</section>`, { refresh: state === 'pending' });
}

function trainingPage(isOwner) {
  const adminLink = isOwner ? '<a class="nav-link" href="/admin"><span class="nav-icon">⚙</span> 직원 접속 승인 관리</a>' : '';
  return embeddedAssets['index.html'].replace('</nav>', `${adminLink}</nav>`);
}

async function allRecords(bucket) {
  const records = [];
  let cursor;
  do {
    const page = await bucket.list({ prefix: 'requests/', limit: 1000, ...(cursor ? { cursor } : {}) });
    for (const item of page.objects) {
      const record = await recordFor(bucket, decodeURIComponent(item.key.slice('requests/'.length, -'.json'.length)));
      if (record?.id && record?.email) records.push(record);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return records.sort((a, b) => String(b.requestedAt).localeCompare(String(a.requestedAt)));
}

async function adminPage(bucket) {
  const records = await allRecords(bucket);
  const pending = records.filter(row => row.status === 'pending');
  const approved = records.filter(row => row.status === 'approved');
  const rejected = records.filter(row => row.status === 'rejected');
  const item = row => `<div class="row"><div><strong>${html(row.email)}</strong><small>요청: ${html(row.requestedAt ? new Date(row.requestedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '')}</small></div><div class="actions">${row.status === 'pending' || row.status === 'rejected' ? `<form method="post" action="/api/admin/status"><input type="hidden" name="id" value="${html(row.id)}"><input type="hidden" name="status" value="approved"><button type="submit">승인</button></form>` : ''}${row.status === 'pending' ? `<form method="post" action="/api/admin/status"><input type="hidden" name="id" value="${html(row.id)}"><input type="hidden" name="status" value="rejected"><button type="submit" class="secondary">거절</button></form>` : ''}${row.status === 'approved' ? `<form method="post" action="/api/admin/status"><input type="hidden" name="id" value="${html(row.id)}"><input type="hidden" name="status" value="rejected"><button type="submit" class="danger">접속 취소</button></form>` : ''}</div></div>`;
  return shell('직원 접속 승인 관리', `<div class="grid"><section class="card"><div class="eyebrow">OWNER CONTROL</div><h1>직원 접속 승인 관리</h1><p>직원은 공유 링크에서 본인 계정으로 로그인하고 승인 요청을 보냅니다. 여기에서 승인하면 같은 계정으로 교육 사이트에 접속할 수 있습니다.</p><a class="button secondary" href="/">교육 사이트 열기 ↗</a><div class="notice">공유 링크: <a href="/">${html('https://yoohastree-franchise-training.earthyeagle4.chatgpt.site/')}</a><br>승인 계정: ${OWNER_EMAIL}</div></section><section class="card"><h2>승인 대기 <span class="count">${pending.length}</span></h2>${pending.length ? pending.map(item).join('') : '<p class="muted">현재 대기 중인 요청이 없습니다.</p>'}</section><section class="card"><h2>승인된 직원 <span class="count">${approved.length}</span></h2>${approved.length ? approved.map(item).join('') : '<p class="muted">아직 승인된 직원이 없습니다.</p>'}</section>${rejected.length ? `<section class="card"><h2>거절·취소된 요청 <span class="count">${rejected.length}</span></h2>${rejected.map(item).join('')}</section>` : ''}</div>`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const user = identity(request);
    const bucket = env.BUCKET;
    if (!bucket) return response('Approval storage is unavailable', 503, 'text/plain; charset=utf-8');

    if (request.method === 'POST') {
      if (!validPost(request)) return response('Forbidden', 403, 'text/plain; charset=utf-8');
      if (path === '/api/request') {
        if (!user) return response('Sign in required', 401, 'text/plain; charset=utf-8');
        if (user.isOwner) return redirect('/admin');
        const existing = await recordFor(bucket, user.id);
        if (existing?.status !== 'approved' && existing?.status !== 'pending') {
          await saveRecord(bucket, { id: user.id, email: user.email, status: 'pending', requestedAt: new Date().toISOString(), approvedAt: null });
        }
        return redirect('/');
      }
      if (path === '/api/admin/status') {
        if (!user?.isOwner) return response('Forbidden', 403, 'text/plain; charset=utf-8');
        const form = await request.formData();
        const id = String(form.get('id') || '');
        const status = String(form.get('status') || '');
        if (!id || !['approved', 'rejected'].includes(status)) return response('Invalid request', 400, 'text/plain; charset=utf-8');
        const record = await recordFor(bucket, id);
        if (!record) return response('Request not found', 404, 'text/plain; charset=utf-8');
        await saveRecord(bucket, { ...record, status, approvedAt: status === 'approved' ? new Date().toISOString() : null });
        return redirect('/admin');
      }
      return response('Not found', 404, 'text/plain; charset=utf-8');
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') return response('Method not allowed', 405, 'text/plain; charset=utf-8');
    if (path === '/admin') {
      if (!user) return response(signInPage('/admin'));
      if (!user.isOwner) return response('Forbidden', 403, 'text/plain; charset=utf-8');
      return response(await adminPage(bucket));
    }

    const approved = user?.isOwner || (user && (await recordFor(bucket, user.id))?.status === 'approved');
    if (path === '/' || path === '/index.html') {
      if (!user) return response(signInPage('/'));
      if (!approved) return response(requestPage(user, await recordFor(bucket, user.id)));
      return response(trainingPage(user.isOwner));
    }
    const assetName = path.slice(1);
    if (ASSET_NAMES.has(assetName)) {
      if (!approved) return response('Forbidden', 403, 'text/plain; charset=utf-8');
      const type = assetName.endsWith('.css') ? 'text/css; charset=utf-8' : assetName.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8';
      return response(embeddedAssets[assetName], 200, type);
    }
    return response('Not found', 404, 'text/plain; charset=utf-8');
  }
};

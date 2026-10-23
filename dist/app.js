const app = document.getElementById('app');
const dialog = document.getElementById('lessonDialog');
const allLessons = modules.flatMap(m => m.lessons.map(l => ({...l,module:m})));
const completed = new Set(JSON.parse(localStorage.getItem('yoohastree-completed-v1') || '[]'));
let view = 'home';
let currentLesson = null;
let filter = 'all';
let query = '';

const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const progress = () => Math.round(completed.size / allLessons.length * 100);
const formatCount = n => String(n).padStart(2,'0');
const lessonCard = (lesson,module) => `<button class="lesson-row" data-lesson="${lesson.id}"><span class="lesson-check ${completed.has(lesson.id)?'done':''}">${completed.has(lesson.id)?'✓':'○'}</span><span class="lesson-row-copy"><strong>${escapeHTML(lesson.title)}</strong><small>${escapeHTML(lesson.summary)}</small></span><span class="lesson-time">${lesson.time}분</span><span class="row-arrow">↗</span></button>`;

function renderHome(){
  app.innerHTML = `<div class="page home-page">
    <section class="welcome"><div class="welcome-copy"><div class="eyebrow light"><span></span> LEARNING PLATFORM</div><h1>현장의 전문성을<br><em>한 단계 더.</em></h1><p>프랜차이즈 운영의 기준을 배우고, 실제 점포에서 실행할 수 있는 역량으로 연결하세요.</p><button class="hero-button" data-go="supervisor">슈퍼바이징 교육 시작하기 <span>↗</span></button></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-monogram">Y<span>.</span></div><div class="hero-pill pill-one">Learn</div><div class="hero-pill pill-two">Apply</div><div class="hero-pill pill-three">Grow</div></div><span class="hero-index">01 / 04</span></section>
    <section class="section-intro"><div><div class="eyebrow">YOUR LEARNING JOURNEY</div><h2>나의 학습 현황</h2><p>작은 학습을 현장의 큰 변화로 이어가세요.</p></div><div class="stat-grid"><div class="stat-card"><span>전체 강의</span><strong>${formatCount(allLessons.length)}<small>개</small></strong></div><div class="stat-card"><span>학습 완료</span><strong>${formatCount(completed.size)}<small>개</small></strong></div><div class="stat-card accent"><span>현재 진도율</span><strong>${progress()}<small>%</small></strong><div class="mini-progress"><i style="width:${progress()}%"></i></div></div></div></section>
    <section class="track-section"><div class="section-heading"><div><div class="eyebrow">EXPLORE THE CURRICULUM</div><h2>교육 과정 살펴보기</h2></div><span>4개의 학습 영역</span></div><div class="track-grid">${tracks.map(t=>t.url?`<a class="track-card ${t.color}" href="${t.url}" target="_blank" rel="noopener noreferrer" aria-label="${t.title} 새 탭에서 열기"><span class="track-icon">${t.icon}</span><span class="track-number">${t.eyebrow}</span><strong>${t.title}</strong><span class="track-description">${t.description}</span><span class="track-footer"><b class="available">${t.status}</b><i>↗</i></span></a>`:`<button class="track-card ${t.color}" data-go="${t.id}"><span class="track-icon">${t.icon}</span><span class="track-number">${t.eyebrow}</span><strong>${t.title}</strong><span class="track-description">${t.description}</span><span class="track-footer"><b class="${t.status==='학습 가능'?'available':''}">${t.status}</b><i>↗</i></span></button>`).join('')}</div></section>
    <section class="bottom-note"><div><span class="eyebrow">FIELD NOTES</span><h3>배움이 현장에서 끝나지 않도록</h3><p>각 강의의 실습 과제를 실제 담당 점포에 적용해 보세요. 완료 표시는 이 브라우저에 저장됩니다.</p></div><div class="note-symbol">✳</div></section>
  </div>`;
}

function renderSupervisor(){
  const showing = modules.filter(m => (filter === 'all' || m.id === filter) && (!query || (m.name + m.lessons.map(l => l.title+' '+l.summary).join(' ')).toLowerCase().includes(query.toLowerCase())));
  app.innerHTML = `<div class="page curriculum-page"><div class="page-head"><div class="eyebrow">TRACK 01 · SUPERVISING</div><h1>슈퍼바이징 직무 교육</h1><p>브랜드 기준을 이해하고, 점포를 진단하며, 점주와 함께 개선을 실행하는 6개 영역의 실무 교육입니다.</p><div class="head-meta"><span>◷ 총 ${allLessons.reduce((n,l)=>n+l.time,0)}분</span><span>▦ ${modules.length}개 대분류</span><span>◈ ${allLessons.length}개 강의</span></div></div>
  <div class="curriculum-toolbar"><div class="section-heading"><div><div class="eyebrow">COURSE OVERVIEW</div><h2>커리큘럼</h2></div><span>${completed.size} / ${allLessons.length} 강의 완료</span></div><div class="toolbar-row"><div class="filter-scroll"><button class="filter-chip ${filter==='all'?'selected':''}" data-filter="all">전체</button>${modules.map(m=>`<button class="filter-chip ${filter===m.id?'selected':''}" data-filter="${m.id}">${m.number} ${m.name}</button>`).join('')}</div><label class="search-box"><span>⌕</span><input id="searchLessons" type="search" placeholder="강의 검색" value="${escapeHTML(query)}" aria-label="강의 검색"></label></div></div>
  <div class="module-list">${showing.length ? showing.map(m=>{const done=m.lessons.filter(l=>completed.has(l.id)).length;const lessons=query&&!m.name.toLowerCase().includes(query.toLowerCase())?m.lessons.filter(l=>(l.title+' '+l.summary).toLowerCase().includes(query.toLowerCase())):m.lessons;return `<section class="module-card"><div class="module-heading"><div class="module-icon ${m.tone}">${m.icon}</div><div class="module-title"><span>MODULE ${m.number}</span><h3>${m.name}</h3><p>${m.subtitle}</p></div><div class="module-progress"><strong>${done}<span> / ${m.lessons.length}</span></strong><small>학습 완료</small></div></div><div class="lesson-list">${lessons.map(l=>lessonCard(l,m)).join('')}</div></section>`}).join(''):'<div class="empty-state">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</div>'}</div></div>`;
  const search = document.getElementById('searchLessons');
  search?.addEventListener('input', e => {query=e.target.value; const pos=e.target.selectionStart;renderSupervisor();const next=document.getElementById('searchLessons');next.focus();next.setSelectionRange(pos,pos)});
}

function renderUpcoming(id){
  const t=tracks.find(item=>item.id===id);
  if(id==='qsc'){
    app.innerHTML=`<div class="page upcoming-page"><div class="page-head"><div class="eyebrow">${t.eyebrow}</div><h1>${t.title}</h1><p>가상 점포를 직접 점검하는 실습 앱에서 QSC 판단과 개선 우선순위 설정을 연습해 보세요.</p></div><div class="qsc-link-panel"><div class="module-icon blue">☑</div><div><span class="eyebrow">PRACTICE NOW</span><h2>QSC 현장 점검 실습</h2><p>아래 버튼을 누르면 시뮬레이션 앱이 새 탭에서 열립니다.</p></div><a class="hero-button" href="${t.url}" target="_blank" rel="noopener noreferrer">시뮬레이션 시작 <span>↗</span></a></div></div>`;
    return;
  }
  const plans={development:{label:'점포개발 직무',items:['입지 후보 발굴과 상권 기초조사','매출 추정과 출점 타당성 검토','계약·인허가·공사 일정 관리','오픈 전 점검과 초기 운영 지원']},qsc:{label:'QSC 모의 점검',items:['가상 점포의 품질·서비스·청결 관찰','기준표에 따른 근거 기록과 채점','위험도에 따른 개선 우선순위 결정','점주 피드백과 후속 계획 수립']},market:{label:'모의 상권분석',items:['상권 범위와 핵심 고객 설정','유동·배후 수요와 접근 동선 검토','경쟁점·집객 시설 비교','입지 점수와 출점 의견 작성']}};
  const p=plans[id];
  app.innerHTML=`<div class="page upcoming-page"><div class="page-head"><div class="eyebrow">${t.eyebrow}</div><h1>${t.title}</h1><p>${t.description}</p></div><div class="upcoming-content"><div class="upcoming-visual"><span>${t.icon}</span><div>COMING<br>SOON.</div></div><div class="upcoming-copy"><span class="eyebrow">NEXT IN THE JOURNEY</span><h2>${p.label} 콘텐츠를<br>준비하고 있습니다.</h2><p>현재는 슈퍼바이징 교육의 6개 영역을 먼저 학습할 수 있습니다. 이 영역은 다음 제작 단계에서 실습 자료와 함께 채워질 예정입니다.</p><h3>예정된 학습 흐름</h3><ol>${p.items.map(i=>`<li>${i}</li>`).join('')}</ol><button class="outline-button" data-go="supervisor">슈퍼바이징 교육 보기 <span>↗</span></button></div></div></div>`;
}

function openLesson(id){
  const item=allLessons.find(l=>l.id===id); if(!item)return;currentLesson=item;
  document.getElementById('lessonModule').textContent=`MODULE ${item.module.number} · ${item.module.name}`;
  document.getElementById('lessonBody').innerHTML=`<span class="lesson-duration">◷ 약 ${item.time}분 · 실무 교육</span><h2 id="lessonTitle">${item.title}</h2><p class="lesson-lead">${item.summary}</p><div class="lesson-divider"></div><h3><span>01</span> 핵심 학습 내용</h3><div class="learning-points">${item.points.map((p,i)=>`<div class="learning-point"><span>${String(i+1).padStart(2,'0')}</span><p>${p}</p></div>`).join('')}</div><div class="practice-box"><div class="practice-heading"><span>✳</span><strong>현장 적용 과제</strong></div><p>${item.practice}</p></div><p class="lesson-disclaimer">교육 내용은 일반적인 프랜차이즈 운영 원칙을 바탕으로 작성했습니다. 실제 업무에는 회사의 최신 운영 매뉴얼과 정책을 우선 적용하세요.</p>`;
  const button=document.getElementById('completeLesson');button.innerHTML=completed.has(id)?'학습 완료 취소 <span>↗</span>':'학습 완료로 표시 <span>↗</span>';
  dialog.showModal();
}

function navigate(next){view=next;filter='all';query='';document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===next));document.getElementById('breadcrumbCurrent').textContent=next==='home'?'대시보드':tracks.find(t=>t.id===next)?.title||'';document.querySelector('.sidebar').classList.remove('open');document.getElementById('menuButton').setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'smooth'});if(next==='home')renderHome();else if(next==='supervisor')renderSupervisor();else renderUpcoming(next);history.replaceState(null,'',`#${next}`)}

document.addEventListener('click',e=>{const go=e.target.closest('[data-go],[data-view]');if(go){navigate(go.dataset.go||go.dataset.view);return}const lesson=e.target.closest('[data-lesson]');if(lesson){openLesson(lesson.dataset.lesson);return}const chip=e.target.closest('[data-filter]');if(chip){filter=chip.dataset.filter;renderSupervisor()}});
document.getElementById('closeDialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.getElementById('completeLesson').addEventListener('click',()=>{if(!currentLesson)return;const id=currentLesson.id;if(completed.has(id))completed.delete(id);else completed.add(id);localStorage.setItem('yoohastree-completed-v1',JSON.stringify([...completed]));dialog.close();view==='home'?renderHome():renderSupervisor();const toast=document.getElementById('toast');toast.textContent=completed.has(id)?'학습 완료로 표시했습니다.':'학습 완료 표시를 취소했습니다.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2500)});
document.getElementById('menuButton').addEventListener('click',()=>{const side=document.querySelector('.sidebar');side.classList.toggle('open');document.getElementById('menuButton').setAttribute('aria-expanded',side.classList.contains('open'))});
document.getElementById('today').textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date());
navigate(['home','supervisor','development','qsc','market'].includes(location.hash.slice(1))?location.hash.slice(1):'home');

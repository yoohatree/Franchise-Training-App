const app = document.getElementById('app');
const dialog = document.getElementById('lessonDialog');
const allLessons = modules.flatMap(module => module.lessons.map(course => ({...course,module})));
const progressKey = 'yoohastree-sv-completed-v2';
let savedProgress = [];
try { savedProgress = JSON.parse(localStorage.getItem(progressKey) || '[]'); } catch {}
const validIds = new Set(allLessons.map(course => course.id));
const completed = new Set(Array.isArray(savedProgress) ? savedProgress.filter(id => validIds.has(id)) : []);
let view = 'home';
let currentLesson = null;
let filter = 'all';
let query = '';

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const progress = () => Math.round(completed.size / allLessons.length * 100);
const formatCount = number => String(number).padStart(2,'0');
const saveProgress = () => { try { localStorage.setItem(progressKey, JSON.stringify([...completed])); } catch {} };
const courseMatches = course => `${course.title} ${course.objective} ${course.topics.map(topic => `${topic.title} ${topic.detail}`).join(' ')} ${course.forms.join(' ')}`.toLowerCase().includes(query.toLowerCase());

function lessonCard(course){
  return `<button class="lesson-row" data-lesson="${course.id}"><span class="lesson-check ${completed.has(course.id)?'done':''}">${completed.has(course.id)?'✓':'○'}</span><span class="course-number">${formatCount(course.number)}</span><span class="lesson-row-copy"><strong>${escapeHTML(course.title)}</strong><small>${escapeHTML(course.objective)}</small></span><span class="lesson-time">${course.topics.length}개 학습 항목</span><span class="row-arrow">↗</span></button>`;
}

function renderHome(){
  app.innerHTML = `<div class="page home-page">
    <section class="welcome"><div class="welcome-copy"><div class="eyebrow light"><span></span> LEARNING PLATFORM</div><h1>현장의 전문성을<br><em>한 단계 더.</em></h1><p>프랜차이즈 운영의 기준을 배우고, 실제 점포에서 실행할 수 있는 역량으로 연결하세요.</p><button class="hero-button" data-go="supervisor">슈퍼바이징 교육 시작하기 <span>↗</span></button></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-monogram">Y<span>.</span></div><div class="hero-pill pill-one">Learn</div><div class="hero-pill pill-two">Apply</div><div class="hero-pill pill-three">Grow</div></div><span class="hero-index">01 / 04</span></section>
    <section class="section-intro"><div><div class="eyebrow">YOUR LEARNING JOURNEY</div><h2>나의 학습 현황</h2><p>24개 SV 실무 과정을 차근차근 학습해 보세요.</p></div><div class="stat-grid"><div class="stat-card"><span>전체 과정</span><strong>${formatCount(allLessons.length)}<small>개</small></strong></div><div class="stat-card"><span>학습 완료</span><strong>${formatCount(completed.size)}<small>개</small></strong></div><div class="stat-card accent"><span>현재 진도율</span><strong>${progress()}<small>%</small></strong><div class="mini-progress"><i style="width:${progress()}%"></i></div></div></div></section>
    <section class="track-section"><div class="section-heading"><div><div class="eyebrow">EXPLORE THE CURRICULUM</div><h2>교육 과정 살펴보기</h2></div><span>4개의 학습 영역</span></div><div class="track-grid">${tracks.map(track => track.url ? `<a class="track-card ${track.color}" href="${track.url}" target="_blank" rel="noopener noreferrer" aria-label="${track.title} 새 탭에서 열기"><span class="track-icon">${track.icon}</span><span class="track-number">${track.eyebrow}</span><strong>${track.title}</strong><span class="track-description">${track.description}</span><span class="track-footer"><b class="available">${track.status}</b><i>↗</i></span></a>` : `<button class="track-card ${track.color}" data-go="${track.id}"><span class="track-icon">${track.icon}</span><span class="track-number">${track.eyebrow}</span><strong>${track.title}</strong><span class="track-description">${track.description}</span><span class="track-footer"><b class="${track.status==='학습 가능'?'available':''}">${track.status}</b><i>↗</i></span></button>`).join('')}</div></section>
    <section class="bottom-note"><div><span class="eyebrow">FIELD NOTES</span><h3>배움이 현장에서 끝나지 않도록</h3><p>각 과정의 실습과 활용 양식을 담당 점포에 적용해 보세요. 완료 표시는 이 브라우저에 저장됩니다.</p></div><div class="note-symbol">✳</div></section>
  </div>`;
}

function renderModuleList(){
  const visible = modules.map(module => ({
    module,
    lessons: module.lessons.filter(course => !query || module.name.toLowerCase().includes(query.toLowerCase()) || courseMatches(course))
  })).filter(entry => (filter === 'all' || entry.module.id === filter) && entry.lessons.length);
  document.getElementById('moduleList').innerHTML = visible.length ? visible.map(({module,lessons}) => {
    const done = module.lessons.filter(course => completed.has(course.id)).length;
    return `<section class="module-card"><div class="module-heading"><div class="module-icon ${module.tone}">${module.icon}</div><div class="module-title"><span>MODULE ${module.number}</span><h3>${module.name}</h3><p>${module.subtitle}</p></div><div class="module-progress"><strong>${done}<span> / ${module.lessons.length}</span></strong><small>학습 완료</small></div></div><div class="lesson-list">${lessons.map(lessonCard).join('')}</div></section>`;
  }).join('') : '<div class="empty-state">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</div>';
}

function renderSupervisor(){
  app.innerHTML = `<div class="page curriculum-page"><div class="page-head"><div class="eyebrow">TRACK 01 · SUPERVISING</div><h1>슈퍼바이징 직무 교육</h1><p>점포 현장을 진단하고 개선을 실행하는 24개 실무 과정입니다. 각 과정에서 목표, 세부 교육 내용, 실습과 활용 양식을 확인하세요.</p><div class="head-meta"><span>▦ ${modules.length}개 대분류</span><span>◈ ${allLessons.length}개 과정</span><span>✳ 과정별 실습·양식 포함</span></div></div>
    <div class="curriculum-toolbar"><div class="section-heading"><div><div class="eyebrow">COURSE OVERVIEW</div><h2>SV 커리큘럼</h2></div><span>${completed.size} / ${allLessons.length} 과정 완료</span></div><div class="toolbar-row"><div class="filter-scroll"><button class="filter-chip ${filter==='all'?'selected':''}" data-filter="all">전체</button>${modules.map(module => `<button class="filter-chip ${filter===module.id?'selected':''}" data-filter="${module.id}">${module.number} ${module.name}</button>`).join('')}</div><label class="search-box"><span>⌕</span><input id="searchLessons" type="search" placeholder="과정·교육 항목 검색" value="${escapeHTML(query)}" aria-label="과정 검색"></label></div></div>
    <div class="module-list" id="moduleList"></div></div>`;
  renderModuleList();
  document.getElementById('searchLessons').addEventListener('input', event => { query = event.target.value; renderModuleList(); });
}

function renderUpcoming(id){
  const track = tracks.find(item => item.id === id);
  if(id === 'qsc'){
    app.innerHTML = `<div class="page upcoming-page"><div class="page-head"><div class="eyebrow">${track.eyebrow}</div><h1>${track.title}</h1><p>가상 점포를 직접 점검하는 실습 앱에서 QSC 판단과 개선 우선순위 설정을 연습해 보세요.</p></div><div class="qsc-link-panel"><div class="module-icon blue">☑</div><div><span class="eyebrow">PRACTICE NOW</span><h2>QSC 현장 점검 실습</h2><p>아래 버튼을 누르면 시뮬레이션 앱이 새 탭에서 열립니다.</p></div><a class="hero-button" href="${track.url}" target="_blank" rel="noopener noreferrer">시뮬레이션 시작 <span>↗</span></a></div></div>`;
    return;
  }
  const plans = {development:{label:'점포개발 직무',items:['입지 후보 발굴과 상권 기초조사','매출 추정과 출점 타당성 검토','계약·인허가·공사 일정 관리','오픈 전 점검과 초기 운영 지원']},market:{label:'모의 상권분석',items:['상권 범위와 핵심 고객 설정','유동·배후 수요와 접근 동선 검토','경쟁점·집객 시설 비교','입지 점수와 출점 의견 작성']}};
  const plan = plans[id];
  app.innerHTML = `<div class="page upcoming-page"><div class="page-head"><div class="eyebrow">${track.eyebrow}</div><h1>${track.title}</h1><p>${track.description}</p></div><div class="upcoming-content"><div class="upcoming-visual"><span>${track.icon}</span><div>COMING<br>SOON.</div></div><div class="upcoming-copy"><span class="eyebrow">NEXT IN THE JOURNEY</span><h2>${plan.label} 콘텐츠를<br>준비하고 있습니다.</h2><p>현재는 슈퍼바이징 직무 교육의 24개 과정을 학습할 수 있습니다. 이 영역은 다음 제작 단계에서 실습 자료와 함께 채워질 예정입니다.</p><h3>예정된 학습 흐름</h3><ol>${plan.items.map(item => `<li>${item}</li>`).join('')}</ol><button class="outline-button" data-go="supervisor">슈퍼바이징 교육 보기 <span>↗</span></button></div></div></div>`;
}

function openLesson(id){
  const course = allLessons.find(item => item.id === id);
  if(!course) return;
  currentLesson = course;
  document.getElementById('lessonModule').textContent = `SV 과정 ${formatCount(course.number)} · ${course.module.name}`;
  document.getElementById('lessonBody').innerHTML = `<span class="lesson-duration">SV COURSE ${formatCount(course.number)} · ${course.topics.length}개 교육 항목</span><h2 id="lessonTitle">${escapeHTML(course.title)}</h2><div class="objective-box"><span>교육 목표</span><p>${escapeHTML(course.objective)}</p></div><div class="lesson-divider"></div><h3><span>01</span> 세부 교육 내용</h3><div class="learning-points">${course.topics.map((topic,index) => `<div class="learning-point"><span>${formatCount(index+1)}</span><div><strong>${escapeHTML(topic.title)}</strong><p>${escapeHTML(topic.detail)}</p></div></div>`).join('')}</div><div class="practice-box"><div class="practice-heading"><span>✳</span><strong>실습</strong></div><p>${escapeHTML(course.practice)}</p>${course.number === 1 ? '<a class="simulation-inline" href="https://qsc-field-simulator-20261022.earthyeagle4.chatgpt.site/" target="_blank" rel="noopener noreferrer">QSC 모의 점검 시뮬레이션 열기 ↗</a>' : ''}</div><div class="forms-section"><h3><span>02</span> 활용 양식</h3><div class="form-list">${course.forms.map(form => `<span>${escapeHTML(form)}</span>`).join('')}</div></div>${course.note ? `<p class="course-note">※ ${escapeHTML(course.note)}</p>` : ''}<p class="lesson-disclaimer">실무에 적용할 때는 해당 브랜드의 최신 운영 매뉴얼과 정책을 확인하세요.</p>`;
  document.getElementById('completeLesson').innerHTML = completed.has(id) ? '학습 완료 취소 <span>↗</span>' : '학습 완료로 표시 <span>↗</span>';
  dialog.showModal();
}

function navigate(next){
  view = next;
  filter = 'all';
  query = '';
  document.querySelectorAll('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === next));
  document.getElementById('breadcrumbCurrent').textContent = next === 'home' ? '대시보드' : tracks.find(track => track.id === next)?.title || '';
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('menuButton').setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'smooth'});
  if(next === 'home') renderHome(); else if(next === 'supervisor') renderSupervisor(); else renderUpcoming(next);
  history.replaceState(null,'',`#${next}`);
}

document.addEventListener('click', event => {
  const navigation = event.target.closest('[data-go],[data-view]');
  if(navigation){ navigate(navigation.dataset.go || navigation.dataset.view); return; }
  const lesson = event.target.closest('[data-lesson]');
  if(lesson){ openLesson(lesson.dataset.lesson); return; }
  const chip = event.target.closest('[data-filter]');
  if(chip){ filter = chip.dataset.filter; document.querySelectorAll('.filter-chip').forEach(button => button.classList.toggle('selected',button.dataset.filter === filter)); renderModuleList(); }
});
document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) dialog.close(); });
document.getElementById('completeLesson').addEventListener('click', () => {
  if(!currentLesson) return;
  const id = currentLesson.id;
  if(completed.has(id)) completed.delete(id); else completed.add(id);
  saveProgress();
  dialog.close();
  view === 'home' ? renderHome() : renderSupervisor();
  const toast = document.getElementById('toast');
  toast.textContent = completed.has(id) ? '학습 완료로 표시했습니다.' : '학습 완료 표시를 취소했습니다.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
});
document.getElementById('menuButton').addEventListener('click', () => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('open');
  document.getElementById('menuButton').setAttribute('aria-expanded',sidebar.classList.contains('open'));
});
document.getElementById('today').textContent = new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date());
navigate(['home','supervisor','development','qsc','market'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home');

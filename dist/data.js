const moduleDefinitions = [
  {id:'foundation',number:'01',name:'슈퍼바이저 기본 역량',subtitle:'역할·권한과 가맹사업의 구조를 이해합니다.',tone:'sage',icon:'◇'},
  {id:'operations',number:'02',name:'점포 운영 및 품질 관리',subtitle:'QSC와 운영 기준을 현장에서 확인하고 개선합니다.',tone:'blue',icon:'▤'},
  {id:'growth',number:'03',name:'매출 및 수익 개선',subtitle:'데이터를 읽고 점포 성과로 연결합니다.',tone:'peach',icon:'↗'},
  {id:'people',number:'04',name:'소통 및 인력 육성',subtitle:'점주·직원과 함께 실행하는 방법을 배웁니다.',tone:'lavender',icon:'♧'},
  {id:'response',number:'05',name:'오픈 및 문제 해결',subtitle:'신규 오픈부터 고객 불만과 위기 대응까지 다룹니다.',tone:'yellow',icon:'✳'},
  {id:'management',number:'06',name:'보고 및 업무 관리',subtitle:'정보를 기록하고 후속 조치를 끝까지 관리합니다.',tone:'mint',icon:'▦'}
];
const modules = moduleDefinitions.map(module => ({
  ...module,
  lessons:courses.filter(course => course.moduleId === module.id)
}));

const tracks = [
  {id:'supervisor',eyebrow:'TRACK 01',title:'슈퍼바이징 직무 교육',description:'24개 실무 과정으로 점포 진단부터 개선 실행까지 체계적으로 학습합니다.',icon:'◈',color:'green',status:'학습 가능'},
  {id:'development',eyebrow:'TRACK 02',title:'점포개발 직무 교육',description:'입지 발굴부터 계약, 오픈 준비까지의 흐름을 배울 예정입니다.',icon:'⌖',color:'sand',status:'준비 중'},
  {id:'qsc',eyebrow:'SIMULATION 01',title:'QSC 모의 점검 시뮬레이션',description:'가상 점포를 직접 점검하는 실습 앱으로 이동합니다.',icon:'☑',color:'blue',status:'실습 가능',url:'https://qsc-field-simulator-20261022.earthyeagle4.chatgpt.site/'},
  {id:'market',eyebrow:'SIMULATION 02',title:'모의 상권분석 시뮬레이션',description:'고객 동선과 경쟁 환경을 읽고 입지를 평가하는 실습입니다.',icon:'◎',color:'purple',status:'준비 중'}
];

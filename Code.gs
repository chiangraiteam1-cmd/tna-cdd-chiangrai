/**
 * Backend ของแบบสำรวจ TNA พช.เชียงราย 2570 (Google Apps Script ผูกกับ Google Sheets)
 * วิธีติดตั้ง ดูใน README.md
 */

// 1) ตั้งรหัสผู้ดูแล (ใช้เข้าหน้าสรุปผล index.html#admin) — เปลี่ยนก่อน Deploy
const ADMIN_KEY = 'CHANGE_ME';

const SHEET = 'คำตอบ';
const DOMAINS = [
  {k:"A",t:"ข้อมูลและดิจิทัล",s:"Data → Information → Insight → Decision → Action",items:[
    ["A1","การจัดเก็บและตรวจสอบคุณภาพข้อมูลชุมชน","จปฐ. กชช.2ค ข้อมูลครัวเรือน ข้อมูลกองทุน"],
    ["A2","การวิเคราะห์ข้อมูลเพื่อหาสาเหตุและกลุ่มเป้าหมาย (Insight)","จัดกลุ่ม เปรียบเทียบ ใช้ข้อมูลประกอบการตัดสินใจ"],
    ["A3","การนำเสนอข้อมูลด้วยภาพและ Dashboard","Excel / Google Sheets / Looker Studio / Infographic"],
    ["A4","การเชื่อมโยงและบูรณาการฐานข้อมูลระหว่างหน่วยงาน","ลดการบันทึกซ้ำซ้อน นิยามข้อมูลกลาง"],
    ["A5","ความปลอดภัยไซเบอร์และการคุ้มครองข้อมูลส่วนบุคคล (PDPA)","รู้เท่าทันภัยออนไลน์ ฟิชชิง การจัดการรหัสผ่าน"]]},
  {k:"B",t:"ปัญญาประดิษฐ์ (AI)",s:"รู้จัก AI → ปรับแต่ง AI → บูรณาการ AI",items:[
    ["B1","การใช้ Generative AI ในงานประจำ","ร่างหนังสือราชการ สรุปรายงาน สรุปการประชุม"],
    ["B2","การเขียนคำสั่ง (Prompt) และปรับแต่ง AI ให้เหมาะกับงาน พช.","สร้างผู้ช่วย AI เฉพาะงาน เช่น CDD AI Assistant"],
    ["B3","การบูรณาการ AI / ระบบอัตโนมัติเข้ากับกระบวนงาน","ลดงานเอกสาร คืนเวลาให้พัฒนากรลงพื้นที่"],
    ["B4","การใช้ AI อย่างมีจริยธรรมและรู้เท่าทัน","ตรวจสอบความถูกต้อง ไม่ใส่ข้อมูลส่วนบุคคล"]]},
  {k:"C",t:"นวัตกรรมและการคิดเชิงออกแบบ",s:"Real Problem → Empathize → Define → Ideate → Prototype → Test → Scale",items:[
    ["C1","การทำความเข้าใจปัญหาและผู้รับบริการอย่างลึกซึ้ง","Empathize / Define จากโจทย์จริงในพื้นที่"],
    ["C2","การระดมความคิดและออกแบบทางออกที่เรียบง่าย","Ideate / Frugal Innovation"],
    ["C3","การสร้างต้นแบบ ทดลอง และวัดผล","Prototype / Test / 90-Day Sandbox"],
    ["C4","การนำเสนอแนวคิดให้น่าสนใจ (Pitching / Storytelling)",""],
    ["C5","การขยายผลนวัตกรรมและการจัดการความรู้ (KM)","ถอดบทเรียน แบ่งปันต้นแบบสู่อำเภออื่น"]]},
  {k:"D",t:"งานพัฒนาชุมชนเชิงพื้นที่",s:"สมรรถนะตามภารกิจของ พช.",items:[
    ["D1","การจัดทำแผนพัฒนาชุมชนเชิงพื้นที่แบบบูรณาการ / แผนตำบล",""],
    ["D2","การส่งเสริม OTOP และการตลาดดิจิทัล / E-Commerce","พัฒนาผลิตภัณฑ์ บรรจุภัณฑ์ แบรนด์ ช่องทางขาย"],
    ["D3","การส่งเสริมท่องเที่ยวชุมชนเชิงสร้างสรรค์","OTOP นวัตวิถี"],
    ["D4","การบริหารจัดการกองทุนและทุนชุมชน","กข.คจ. กลุ่มออมทรัพย์ฯ กองทุนพัฒนาบทบาทสตรี หมู่บ้านกองทุนแม่ฯ"],
    ["D5","การส่งเสริมสัมมาชีพ / โคก หนอง นา",""],
    ["D6","การพัฒนาคุณภาพชีวิตกลุ่มเปราะบางและสังคมสูงวัย","ครัวเรือนตกเกณฑ์ จปฐ. Smart Aging Community"],
    ["D7","การบริหารโครงการแบบมุ่งผลลัพธ์และการติดตามประเมินผล","ตั้งตัวชี้วัด วัดผลก่อน–หลัง ใช้งบให้ตอบโจทย์พื้นที่"]]},
  {k:"E",t:"การทำงานร่วมกันและภาวะผู้นำ",s:"Power of every Gen",items:[
    ["E1","การทำงานเป็นทีมข้ามรุ่น (ทุก Gen)",""],
    ["E2","การเป็นวิทยากรกระบวนการ (Facilitator)","ประชุมเวทีประชาคม ระดมความคิดชุมชน"],
    ["E3","การสร้างและประสานภาคีเครือข่าย","ท้องถิ่น สถาบันการศึกษา เอกชน ผู้นำ อช."],
    ["E4","การโค้ชและเป็นพี่เลี้ยงผู้อื่น",""],
    ["E5","การปรับตัวและกรอบคิดแบบเติบโต (Growth Mindset)","จาก “เป็นไปไม่ได้” สู่ “ต้องเริ่มตรงไหน”"],
    ["E6","ภาวะผู้นำดิจิทัลและการนำการเปลี่ยนแปลง","ชวนทีมทดลองวิธีทำงานใหม่ ตัดสินใจจากข้อมูล"]]},
  {k:"F",t:"ทักษะแห่งอนาคตและการเรียนรู้ตลอดชีวิต",s:"Future Skills · WEF 2025",items:[
    ["F1","การคิดวิเคราะห์และการคิดเชิงระบบ","มองเห็นความเชื่อมโยงของปัญหาเศรษฐกิจ สังคม สิ่งแวดล้อม"],
    ["F2","การคิดเชิงอนาคตและการวางภาพฉากทัศน์ (Foresight)","คาดการณ์เชียงราย 2030 สังคมสูงวัย ภูมิอากาศ ชายแดน"],
    ["F3","การเรียนรู้ด้วยตนเองอย่างต่อเนื่อง (Self-directed Learning)","หาความรู้จากแหล่งออนไลน์ ตั้งเป้าการเรียนรู้ของตนเอง"],
    ["F4","ความยืดหยุ่นทางใจและการดูแลสุขภาวะในการทำงาน (Resilience)","จัดการความเครียด สมดุลชีวิตและงาน"],
    ["F5","การสื่อสารสร้างสรรค์ผ่านสื่อดิจิทัล","ทำคลิปสั้น โพสต์ Infographic เล่าเรื่องชุมชน"]]},
  {k:"G",t:"งานบริหารและสนับสนุน",s:"",items:[
    ["G1","ระเบียบการเงิน การคลัง และพัสดุ (e-GP / GFMIS)",""],
    ["G2","งานสารบรรณอิเล็กทรอนิกส์และการเขียนหนังสือราชการ",""],
    ["G3","การเขียนโครงการและจัดทำคำของบประมาณ",""]]}
];
const ITEMS = DOMAINS.reduce((a, d) => a.concat(d.items.map(i => ({ id: i[0], t: i[1], d: d.t }))), []);
const BASE = ['respId','submittedAt','updatedAt','name','position','level','unit','subunit','gen','tenure','hack','aiuse',
  'goal','aiimpact','cred','hours','formats','duration','period','barriers','top_1','top_2','top_3','top_4','top_5','topOther',
  'pain','share','mentor','other'];
const LABELS = {respId:'รหัสคำตอบ',submittedAt:'ส่งครั้งแรก',updatedAt:'แก้ไขล่าสุด',name:'ชื่อ–สกุล',position:'ประเภทตำแหน่ง',level:'ระดับ',
  unit:'สังกัด',subunit:'กลุ่มงาน/ฝ่าย',gen:'ช่วงอายุ',tenure:'อายุราชการ',hack:'Hackathon',aiuse:'การใช้ AI',goal:'เป้าหมายการพัฒนา',
  aiimpact:'ผลกระทบ AI',cred:'Micro-credential',hours:'ชม.เรียนรู้/สัปดาห์',formats:'รูปแบบการเรียนรู้',duration:'ระยะเวลา',period:'ช่วงเวลา',
  barriers:'อุปสรรค',top_1:'อันดับ 1',top_2:'อันดับ 2',top_3:'อันดับ 3',top_4:'อันดับ 4',top_5:'อันดับ 5',topOther:'อื่น ๆ (ระบุ)',
  pain:'ปัญหาหน้างาน',share:'ถ่ายทอดได้',mentor:'วิทยากร/พี่เลี้ยง',other:'ข้อเสนอแนะ'};
const HEADER = BASE.map(k => LABELS[k]).concat(ITEMS.reduce((a, it) => a.concat([it.id + '_I', it.id + '_D']), [])).concat(['JSON']);

function setup() {
  const sh = sheet_();
  sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold').setBackground('#1f2f7a').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  if (ADMIN_KEY === 'CHANGE_ME') Logger.log('อย่าลืมเปลี่ยน ADMIN_KEY ที่บรรทัดบนสุดก่อน Deploy');
  Logger.log('พร้อมแล้ว: ' + SpreadsheetApp.getActive().getUrl());
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('TNA').addItem('สรุปผล PNI และ Top 5', 'summarizeTNA').addToUi();
}

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(SHEET) || ss.insertSheet(SHEET, 0);
}
const safe_ = v => { v = v == null ? '' : String(v).slice(0, 2000); return /^[=+\-@]/.test(v) ? "'" + v : v; };
const json_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const body = JSON.parse(e.postData.contents);
    const r = body.data || {};
    if (!r.respId || !r.name || !r.ratings) return json_({ ok: false, error: 'invalid' });
    const sh = sheet_();
    if (sh.getLastRow() === 0) setup();
    const now = new Date().toISOString();
    const found = sh.getRange(1, 1, Math.max(1, sh.getLastRow()), 1).createTextFinder(r.respId).matchEntireCell(true).findNext();
    const row = found ? found.getRow() : sh.getLastRow() + 1;
    const first = found ? sh.getRange(row, 2).getValue() : now;
    const vals = BASE.map(k => k === 'submittedAt' ? first : k === 'updatedAt' ? now :
      Array.isArray(r[k]) ? r[k].join('; ') : r[k]);
    ITEMS.forEach(it => { const v = r.ratings[it.id]; vals.push(v === 'NA' ? 'NA' : (v && v[0]) || '', v === 'NA' ? 'NA' : (v && v[1]) || ''); });
    vals.push(JSON.stringify(r));
    sh.getRange(row, 1, 1, vals.length).setValues([vals.map(safe_)]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action !== 'list') return json_({ ok: true, service: 'TNA CDD Chiang Rai 2570' });
  if (ADMIN_KEY === 'CHANGE_ME' || p.key !== ADMIN_KEY) return json_({ ok: false, error: 'unauthorized' });
  return json_({ ok: true, rows: readAll_() });
}

function readAll_() {
  const sh = sheet_(); const n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, HEADER.length, n - 1, 1).getValues().map(r => { try { return JSON.parse(String(r[0]).replace(/^'/, '')); } catch (e) { return null; } }).filter(Boolean);
}

function summarizeTNA() {
  const rows = readAll_(); const ss = SpreadsheetApp.getActive();
  const out = [];
  ITEMS.forEach(it => {
    let sI = 0, sD = 0, n = 0;
    rows.forEach(r => { const v = (r.ratings || {})[it.id]; if (Array.isArray(v) && v[0] && v[1]) { sI += +v[0]; sD += +v[1]; n++; } });
    if (n) { const I = sI / n, D = sD / n; out.push([it.id, it.t, it.d, n, I, D, I - D, (I - D) / D]); }
  });
  out.sort((a, b) => b[7] - a[7]);
  write_(ss, 'สรุป PNI', ['อันดับ','รหัส','หัวข้อ','ด้าน','จำนวนผู้ตอบ','ค่าเฉลี่ย I','ค่าเฉลี่ย D','I − D','PNI modified'], out.map((r, i) => [i + 1].concat(r)), true);
  const pts = {}; const label = id => { const it = ITEMS.find(x => x.id === id); return it ? it.id + ' ' + it.t : 'อื่น ๆ'; };
  rows.forEach(r => [1,2,3,4,5].forEach(n => { const v = r['top_' + n]; if (v) { const k = label(v); pts[k] = (pts[k] || 0) + (6 - n); } }));
  const top = Object.keys(pts).map(k => [k, pts[k]]).sort((a, b) => b[1] - a[1]);
  write_(ss, 'สรุป Top 5', ['อันดับ','หัวข้อ','คะแนนถ่วงน้ำหนัก (อันดับ 1 = 5 … อันดับ 5 = 1)'], top.map((r, i) => [i + 1].concat(r)), false);
  try { SpreadsheetApp.getUi().alert('สรุปผลจาก ' + rows.length + ' คำตอบเรียบร้อย'); } catch (e) {}
}

function write_(ss, name, header, rows, pni) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name); sh.clear();
  sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold').setBackground('#1f2f7a').setFontColor('#ffffff');
  if (rows.length) {
    sh.getRange(2, 1, rows.length, header.length).setValues(rows);
    if (pni) { sh.getRange(2, 6, rows.length, 3).setNumberFormat('0.00'); sh.getRange(2, 9, rows.length, 1).setNumberFormat('0.000'); }
    sh.getRange(2, 1, Math.min(5, rows.length), header.length).setBackground('#f7eed9');
  }
  sh.setFrozenRows(1); sh.autoResizeColumns(1, header.length);
}

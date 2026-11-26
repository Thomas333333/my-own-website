export const VERSION = 'presentation-study-5';
export const PIDS = Array.from({length: 15}, (_, i) => 'P' + String(i + 1).padStart(2, '0'));
export function parseCSV(text) {
  const rows=[]; let row=[], cell='', quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(c==='"') { if(quoted && text[i+1]==='"'){cell+='"';i++;} else quoted=!quoted; }
    else if(c===',' && !quoted){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';}
    else cell+=c;
  }
  if(quoted)throw new Error('CSV 引号未闭合');
  if(cell!==''||row.length){row.push(cell);rows.push(row);}
  return rows;
}
export function readAnswerFile(text) {
  const [header,...lines]=parseCSV(text);
  const required=['版本','参与编号','指标ID','原始答案','评分（1–5）','是否实际播放'];
  if(!header||required.some(x=>!header.includes(x)))throw new Error('缺少新版问卷字段，请使用本次答卷');
  if(!lines.length)throw new Error('答卷为空');
  const records=lines.map(values=>{if(values.length!==header.length)throw new Error('CSV 列数不一致');return Object.fromEntries(header.map((key,i)=>[key,values[i]]));});
  const ids=new Set(records.map(r=>r['参与编号']));
  if(ids.size!==1)throw new Error('一份文件应只含一个参与编号');
  const pid=[...ids][0];
  if(!PIDS.includes(pid))throw new Error('试跑或未知编号不计入正式统计');
  if(records.some(r=>r['版本']!==VERSION))throw new Error('问卷版本不匹配，旧版答卷请单独分析');
  if(header.includes('答卷状态') && records.some(r=>r['答卷状态']!=='正式答卷'))throw new Error('草稿暂不计入汇总，请补充反馈后下载正式答卷 CSV');
  const answers={};
  for(const r of records){
    const key=r['指标ID'];
    if(!key||key.startsWith('action:'))continue;
    if(answers[key])throw new Error('同一指标重复出现');
    let value;try{value=JSON.parse(r['原始答案']);}catch{throw new Error('原始答案格式无效');}
    if(typeof value!=='string' && !(Array.isArray(value)&&value.every(x=>typeof x==='string')))throw new Error('答案类型无效');
    const rating=/^[1-5]$/.test(r['评分（1–5）'])?Number(r['评分（1–5）']):null;
    if(rating!==null && String(value)!==String(rating))throw new Error('数值列和原始答案不一致');
    answers[key]={value,rating,played:r['是否实际播放']==='是',label:r['指标'],section:r['部分'],setting:r['条件']};
  }
  return {pid,answers,exportedAt:records[0]['导出时间']||''};
}
export function numeric(person,key){return person.answers[key]?.rating ?? null;}
export function points(people,key){return people.map(p=>({pid:p.pid,value:numeric(p,key)})).filter(p=>p.value!==null);}
export function paired(people,leftKeys,rightKeys,{requirePlayed=false}={}){
  return people.flatMap(person=>{
    const all=[...leftKeys,...rightKeys];
    if(all.some(key=>numeric(person,key)===null || (requirePlayed&&!person.answers[key]?.played)))return [];
    const mean=keys=>keys.reduce((sum,key)=>sum+numeric(person,key),0)/keys.length;
    return [{pid:person.pid,left:mean(leftKeys),right:mean(rightKeys)}];
  });
}
export function counts(people,key,options){
  const valid=people.filter(p=>{const v=p.answers[key]?.value;return Array.isArray(v)?v.length>0:typeof v==='string'&&v!==''&&v!=='na';});
  return {n:valid.length,rows:options.map(([value,label])=>({value,label,count:valid.filter(p=>{const v=p.answers[key].value;return Array.isArray(v)?v.includes(value):v===value;}).length}))};
}
export function median(values){if(!values.length)return null;const x=[...values].sort((a,b)=>a-b),m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;}

export const RATING_KEYS = ["need_lips", "need_practice", "need_repair", "context_frequency", "current_support", "intro_clarity", "exchange_ease", "exchange_clarity", "exchange_confirm", "clip1_mouth", "clip1_full", "clip2_mouth", "clip2_full", "lesson_start", "lesson_pace", "lesson_locate", "lesson_independent", "pace_normal_detail", "pace_slow_detail", "pace_normal_natural", "pace_slow_natural", "correction_find", "correction_control", "correction_status", "correction_comfort", "reading_standard", "reading_large", "reading_status", "context_need", "scenario_practice", "scenario_meeting", "scenario_service", "satisfaction", "reuse", "learning", "communication", "learning_interest"];

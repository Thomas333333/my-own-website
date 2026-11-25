import {PIDS,RATING_KEYS,readAnswerFile,points,paired,counts,median} from './analysis-core.mjs';
const people=new Map(), $=s=>document.querySelector(s);
const colors=['#1d4ed8','#087f8c','#8942b5','#b45b06','#12805c'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const color=pid=>colors[PIDS.indexOf(pid)]||'#485a73';
const txt=(x,y,text,size=20,fill='#142541',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(text)}</text>`;
const line=(x1,y1,x2,y2,stroke='#dbe3ef',extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" ${extra}/>`;
function svg(title,body,height=650){return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img" aria-label="${esc(title)}"><rect width="1200" height="${height}" fill="white"/><g font-family="Arial, sans-serif">${txt(38,48,title,30)}${body}</g></svg>`;}
function legend(y, ids=PIDS){return PIDS.filter(pid=>ids.includes(pid)).map((pid,i)=>`<circle cx="${46+i*140}" cy="${y-7}" r="6" fill="${color(pid)}"/>`+txt(61+i*140,y,pid,17)).join('');}
function dotChart(title,rows,people,{frequency=false}={}){
  const h=205+rows.length*92, x=v=>520+(v-1)*140;
  let body=txt(38,85,'Individual responses · missing / not applicable excluded',17,'#4b5c75');
  for(let n=1;n<=5;n++)body+=txt(x(n),120,n,19,'#4b5c75','text-anchor="middle"')+line(x(n),133,x(n),h-98);
  rows.forEach(([key,label],i)=>{
    const y=170+i*92, vals=points(people,key),med=median(vals.map(p=>p.value));
    body+=txt(38,y,label,21)+txt(38,y+25,`n = ${vals.length} · median ${med===null?'—':med.toFixed(1)} · 4–5 ratings ${vals.filter(p=>p.value>=4).length}/${vals.length}`,15,'#4b5c75');
    vals.forEach(p=>{const py=y-6+(PIDS.indexOf(p.pid)-2)*12;body+=`<circle cx="${x(p.value)}" cy="${py}" r="6" fill="${color(p.pid)}"><title>${p.pid}: ${p.value}/5</title></circle>`;});
  });
  body+=legend(h-52,people.map(p=>p.pid))+txt(38,h-18,frequency?'1 Never · 5 Very often | Remote pilot; self-reported experience in the past 3 months':'1 Low · 5 High | Remote pilot; subjective ratings, not measured performance',16,'#4b5c75');
  return svg(title,body,h);
}
function pairedPanel(data,left,right,{ox=0,width=1200,heading='',note=''}={}){
  const x1=ox+width*.22,x2=ox+width*.77,y=v=>390-(v-1)*59;
  let body=heading?txt(ox+38,99,heading,23):'';
  for(let n=1;n<=5;n++)body+=line(x1-30,y(n),x2+30,y(n))+txt(x1-49,y(n)+6,n,17,'#4b5c75');
  data.forEach(p=>{
    const j=(PIDS.indexOf(p.pid)-2)*12;
    body+=line(x1+j,y(p.left),x2+j,y(p.right),color(p.pid),'stroke-width="2" opacity=".65"');
    for(const [x,v]of[[x1+j,p.left],[x2+j,p.right]])body+=`<circle cx="${x}" cy="${y(v)}" r="6" fill="${color(p.pid)}"><title>${p.pid}: ${v.toFixed(1)}</title></circle>`;
  });
  body+=txt(x1,429,left,19,'#142541','text-anchor="middle"')+txt(x2,429,right,19,'#142541','text-anchor="middle"');
  body+=txt(ox+38,469,`Complete pairs: n = ${data.length}`,19)+txt(ox+38,498,note,15,'#4b5c75');
  if(!data.length)body+=txt((x1+x2)/2,270,'Awaiting complete paired responses',17,'#687892','text-anchor="middle"');
  return body;
}
function videoChart(people){
 const data=paired(people,['clip1_mouth','clip2_mouth'],['clip1_full','clip2_full'],{requirePlayed:true});
 return svg('Ease of following actions by video view',pairedPanel(data,'Mouth close-up','Full hand–mouth view',{note:'Each point = one participant’s mean across two clips; both views played.'})+legend(555,data.map(p=>p.pid))+txt(38,595,'Presentation preference only; cropping changes framing. No cue-recognition or comprehension test.',16,'#4b5c75'),620);
}
function paceChart(people){
 const a=paired(people,['pace_normal_detail'],['pace_slow_detail'],{requirePlayed:true}), b=paired(people,['pace_normal_natural'],['pace_slow_natural'],{requirePlayed:true});
 return svg('Playback pace: detail visibility and naturalness',pairedPanel(a,'Normal 1×','Slow 0.65×',{width:600,heading:'Ease of seeing details',note:'1 Very difficult · 5 Very easy'})+pairedPanel(b,'Normal 1×','Slow 0.65×',{ox:600,width:600,heading:'Perceived naturalness',note:'1 Very unnatural · 5 Very natural'})+legend(555,[...a,...b].map(p=>p.pid))+txt(38,595,'Same clip; playback speed comparison. This does not measure motion-refinement model improvement.',16,'#4b5c75'),620);
}
function bars(title,key,options,people,multi=false){
 const data=counts(people,key,options),h=160+options.length*56;
 let body=txt(38,84,`Respondents with an answer: n = ${data.n}${multi?' · up to three choices per person':''}`,18,'#4b5c75');
 data.rows.forEach((r,i)=>{const y=130+i*56;body+=txt(38,y,r.label,20)+`<rect x="470" y="${y-22}" height="28" width="${r.count*115}" rx="4" fill="#1d4ed8"/>`+txt(490+r.count*115,y,data.n?`${r.count}/${data.n}`:'—',20);});
 body+=txt(38,h-16,multi?'Counts are selections, not independent participants. Total may exceed n.':'Counts describe this pilot sample only.',16,'#4b5c75');return svg(title,body,h);
}
const featureOptions=[['bidirectional','Bidirectional workflow'],['playback','Slow playback / replay'],['lesson','Word-level practice'],['correction','Edit / confirm text'],['reading','Adjustable text size'],['context','More context / tone cues'],['none-needed','No priority at present']];
const barrierOptions=[['familiarity','MCS familiarity'],['accuracy','Uncertain result accuracy'],['extra-steps','Steps / waiting'],['no-situation','No suitable use case'],['access','Device / network access'],['no-barrier','No obvious barrier'],['other','Other']];
const defs=[
 {id:'needs',owner:'Jiangshan · Problem Framing',title:'日常需要：哪些困难在这五人中出现？',note:'演示前填写。展示过去三个月四类需要的个人频率分布。用“本轮参与者报告……”描述；需求频率不能证明原型已解决该问题。',make:p=>dotChart('Support needs reported before the demo',[['need_lips','Difficulty distinguishing lip movements'],['need_practice','Need for repeatable learning examples'],['need_repair','Need to repeat / confirm a message'],['context_frequency','Difficulty judging tone in text']],p,{frequency:true})},
 {id:'views',owner:'Yihua · Interface & Presentation',title:'画面呈现：口型特写和完整手口画面',note:'主图仅纳入同一参与者的两段素材、两种画面均有评分且触发播放的完整数据。每人每种画面取两段均值，不把两段当成两个参与者。两种裁切的构图也不同，因此结论限于画面呈现偏好。',make:videoChart},
 {id:'pace',owner:'Xinya · Readability & Pacing',title:'播放节奏：看得清楚与看起来自然',note:'同一条“明天见”视频以 1× 和 0.65× 播放；两个面板分别比较细节容易度和节奏自然度。保留有两种评分且两种速度触发过播放的参与者。该对比支持播放控制设计，不能当作插帧算法改进的结果。',make:paceChart},
 {id:'value',owner:'Xiaoyang · Outcomes & Impact',title:'原型价值：满意度、用途和再次使用意愿',note:'每项分别报告五人的分布、中位数和 4–5 分人数/有效作答人数。题目为本项目自编单项题；不合成 SUS、可用性总分或“社会影响百分比”。学习和交流为感知帮助。',make:p=>dotChart('Perceived usefulness and willingness to reuse',[['satisfaction','Overall satisfaction'],['learning','Perceived learning usefulness'],['communication','Perceived communication usefulness'],['reuse','Willingness to reuse']],p)},
 {id:'usability',owner:'备份图 · 系统层面的体验',title:'操作体验：定位具体薄弱环节',note:'同一张图中每项保留独立含义，不合成总分。修改文字使用预设交互样例。主观容易度与任务成功率分开记录。',make:p=>dotChart('Ease of using specific prototype functions',[['exchange_ease','Completing the example dialogue'],['exchange_confirm','Finding the reply text'],['lesson_locate','Locating a word to replay'],['correction_find','Finding the text edit control'],['reading_status','Identifying the message status']],p)},
 {id:'features',owner:'备份图 · 后续优先级',title:'用户希望优先完善的功能',note:'每人最多三项，按选择人数统计。此图可以用于团队讨论下一步，但不能单独证明团队已经完成相应迭代。',make:p=>bars('Features participants would prioritise','priorities',featureOptions,p,true)},
 {id:'barriers',owner:'备份图 · 使用边界',title:'什么因素可能影响实际使用？',note:'保留“暂时没有合适场景”和“目前没有明显障碍”等选项。如有不同意见，主图中照常呈现。',make:p=>bars('Reported barriers to adoption','barrier',barrierOptions,p)}
];
const topics={P01:'对话流程',P02:'视频与播放',P03:'真实需要',P04:'确认与纠错',P05:'初次上手'};
function render(){
 const list=PIDS.filter(p=>people.has(p)).map(p=>people.get(p));$('#sample-n').textContent=list.length+' / 5';
 $('#participants').innerHTML='<div class="participant-list">'+list.map(p=>`<span class="pill">${p.pid} · ${Object.values(p.answers).filter(a=>Array.isArray(a.value)?a.value.length:a.value!=='').length} 项已答</span>`).join('')+'</div>';
 $('#charts').innerHTML=defs.map(d=>`<section class="panel report-section"><div class="chart-head"><div><p class="chart-owner">${esc(d.owner)}</p><h2>${esc(d.title)}</h2></div><button class="secondary" data-export="${d.id}" ${list.length?'':'disabled'}>下载英文图 SVG</button></div>${list.length?`<div class="chart-canvas" id="chart-${d.id}">${d.make(list)}</div>`:'<div class="empty">等待真实答卷。导入后显示个人分数与有效人数。</div>'}<p class="chart-note">${esc(d.note)}</p></section>`).join('');
 $('#quotes').innerHTML=list.length?'<div class="quote-grid">'+list.map(p=>`<article class="quote-card"><strong>${p.pid} · ${topics[p.pid]}</strong>`+(p.answers.quote_permission?.value==='quote-yes'?[1,2].map(n=>'<p>'+n+'. '+esc(p.answers['feedback'+n]?.value||'未填写')+'</p>').join(''):'<p>未获匿名原话引用许可。请仅使用汇总分析。</p>')+'</article>').join('')+'</div>':'<p class="empty">等待反馈。</p>';
 const keys=RATING_KEYS.filter(key=>list.some(p=>p.answers[key]));
 $('#data-table').innerHTML=keys.length?'<table><thead><tr><th>评分项</th>'+PIDS.map(pid=>'<th>'+pid+'</th>').join('')+'<th>有效 n</th></tr></thead><tbody>'+keys.map(key=>{
 const first=list.find(p=>p.answers[key])?.answers[key];return '<tr><td>'+esc(first.label)+(first.setting?' · '+esc(first.setting):'')+'</td>'+PIDS.map(pid=>'<td>'+(people.get(pid)?.answers[key]?.rating??'—')+'</td>').join('')+'<td>'+points(list,key).length+'</td></tr>';
 }).join('')+'</tbody></table>':'<p class="microcopy">尚无可用评分。</p>';
}
$('#files').addEventListener('change',async event=>{
 const messages=[];
 for(const file of event.target.files){try{
  if(file.size>3_000_000)throw new Error('文件超过 3 MB，请确认选择的是答卷');
  const person=readAnswerFile(await file.text());
  if(people.has(person.pid))throw new Error(person.pid+' 已导入；如需替换，请清空后重新选择答卷');
  people.set(person.pid,person);messages.push(person.pid+' 导入成功');
 }catch(e){messages.push(file.name+'：'+e.message);}}
 $('#import-status').textContent=messages.join('；');event.target.value='';render();
});
$('#clear').addEventListener('click',()=>{people.clear();$('#import-status').textContent='已清空本次导入，原 CSV 文件保持不变。';render();});
$('#charts').addEventListener('click',event=>{
 const button=event.target.closest('[data-export]');if(!button)return;
 const chart=$('#chart-'+button.dataset.export+' svg');if(!chart)return;
 const blob=new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n'+chart.outerHTML],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='MCS-study-'+button.dataset.export+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
});render();

import {COMPLETION_RULE,FEEDBACK_MIN_LENGTH,FEEDBACK_KEYS,ANSWER_GROUPS,REQUIRED_VIDEOS,feedbackLength,answerComplete,videoPlayed,checkCompletion} from './completion.mjs';
const CHAPTERS = ['使用背景', '认识 MCS', '对话体验', '视频呈现', '句子跟练', '文字确认', '阅读显示', '歧义场景', '总体评价'];
const PARTICIPANTS = ['P00', ...Array.from({length: 15}, (_, i) => 'P' + String(i + 1).padStart(2, '0'))];
const VERSION = 'presentation-study-5';

const CLIPS = [
  { id: 'clip1', label: '片段一', asset: 's01', text: '快（kuai）' },
  { id: 'clip2', label: '片段二', asset: 's06', text: '帅（shuai）' }
];

const VIEWS = { mouth: '口型特写', full: '完整手口画面' };

const USE_CASES = [
  ['learn', '学习或跟练'], ['conversation', '日常短句交流'], ['video', '辅助看视频'],
  ['none', '暂时没有合适场景'], ['other', '其他']
];
const PLAYBACK_PRIORITIES = [
  ['slow', '慢放'], ['repeat', '一键重播'], ['zoom', '放大画面'], ['switch', '切换画面呈现'], ['sufficient', '现在的方式已够用']
];
const CONTEXT_PRIORITIES = [
  ['expression', '说话者的表情和动作'], ['surrounding', '前后文或背景说明'], ['tone-label', '显式语气提示'],
  ['keep-text', '保留当前文字就好'], ['other', '其他']
];
const FOLLOW_UP = [
  ['edit', '在发送前可以自己修改文字'], ['preview', '先预览对方将收到的内容'], ['source', '先说明文字是怎么得出的'],
  ['no-extra', '这一步暂时不需要额外功能']
];
const FEEDBACK = {
  P01: ['对话流程', '哪一个操作让你最犹豫？请指出页面位置或按钮。', '如果只能改动一个步骤，你希望它怎么做？'],
  P02: ['视频和播放', '哪一个片段或呈现方式的动作细节更容易看清？具体是什么让你更容易看？', '在实际使用时，你最希望增加或改善哪一种播放控制？为什么？'],
  P03: ['真实需求', '请举一个你自己遇过的场景，说明现在通常怎么处理。', '在这个场景里，原型能帮到哪一步？还有哪一步需要其他方式？'],
  P04: ['确认与纠错', '看完回复后，什么信息能让你更清楚接下来会发生什么？', '如果回复文字写错，你希望在哪里改、用什么提示确认改成功？'],
  P05: ['初次上手', '第一次打开页面时，有没有一个词或按钮需要解释？请指出具体位置。', '如果把原型发给从未接触过 MCS 的朋友，你最想给他加哪一条提示？'],
  P06: ["文字与显示", "默认显示和大字显示，哪一种更适合你当前的设备？请说明原因，也可以说两种都不合适。", "阅读回复时，有哪条文字或状态提示让你觉得难读、难找或不清楚？希望怎么改？"],
  P07: ["场景适配", "你愿意在哪个具体场景尝试这个原型？如果暂时没有，也请说明原因。", "在这个场景中，你会在什么时候继续使用原来的交流方式？为什么？"],
  P08: ["学习与观看", "整句播放、单字重看和慢放中，哪项对你观看示例最有帮助？也可以说都没有或无法判断。", "第一次遇到不理解的动作时，你希望页面提供什么解释或辅助？请举一个具体例子。"],
  P09: ["使用顾虑", "决定是否在实际生活中使用前，你还需要知道哪些信息？", "实际使用时，你最担心出现什么情况？希望原型怎样处理？没有明显顾虑也可以说明。"],
  P10: ["功能取舍", "如果只能保留一项功能，你会保留哪项？为什么？也可以说暂时没有想保留的。", "哪项内容或操作对你用处较小，可以简化？如果都想保留，也请说明理由。"],
  P11: ["注意力分配", "同时看视频和旁边的文字时，你的注意力通常放在哪里？有没有需要来回寻找的地方？", "如果调整页面布局，你希望哪些内容靠近、放大或暂时收起？请说明原因。"],
  P12: ["文字与视频配合", "同一句话同时提供文字和视频时，你分别会在什么时候看它们？也可以说明只需要其中一种的原因。", "如果文字和视频让你产生不同理解，你希望页面提供什么帮助来核对？"],
  P13: ["隐私与分享", "如果在真实交流中使用，你希望哪些内容只让自己看到，哪些可以展示给对方？请说明原因。", "关于保存或分享交流内容，你希望页面让你做哪些选择？没有特别要求也可以说明。"],
  P14: ["中断与恢复", "如果视频加载慢或操作中断，你希望页面怎样提示，才能知道下一步怎么办？", "中途退出后重新打开时，你希望保留哪些内容或进度？哪些内容希望重新开始？"],
  P15: ["持续使用", "这次体验后，什么情况下你可能再次使用这个原型？如果暂时不会，也请说明原因。", "如果以后继续使用，哪一个问题最需要先解决？它为什么会影响你的使用决定？"]
};

const LESSON_PARTS = [
  { label: '明', pinyin: 'ming', start: 0, end: 0.97 },
  { label: '天', pinyin: 'tian', start: 1.7, end: 3.8 },
  { label: '见', pinyin: 'jian', start: 3.8, end: 4.43 }
];
const EXTRA_RATINGS = {
  lesson: [
    ['lesson_start', '开始这句练习有多容易？', '很难', '很容易'],
    ['lesson_pace', '调节到适合自己的观看节奏有多容易？', '很难', '很容易'],
    ['lesson_locate', '找到想重新看的那个字有多容易？', '很难', '很容易'],
    ['lesson_independent', '下次独自使用播放、重播和慢放按钮，你有多大把握？', '没把握', '很有把握']
  ],
  correction: [
    ['correction_find', '找到修改文字的入口有多容易？', '很难', '很容易'],
    ['correction_control', '确认前，你有多清楚自己可以修改哪些内容？', '很不清楚', '很清楚'],
    ['correction_status', '确认后，你有多清楚最后保留的是哪一句？', '很不清楚', '很清楚'],
    ['correction_comfort', '用这个确认方式表达自己的意思，你感觉多自在？', '很不自在', '很自在']
  ],
  reading: [
    ['reading_standard', '默认显示的文字读起来有多轻松？', '很费力', '很轻松'],
    ['reading_large', '大字显示的文字读起来有多轻松？', '很费力', '很轻松'],
    ['reading_status', '阅读回复时，辨认当前处理状态有多容易？', '很难', '很容易']
  ],
  scenarios: [
    ['scenario_practice', '自己想学一句 MCS 时，你预期这个原型有多大帮助？', '没帮助', '很有帮助'],
    ['scenario_meeting', '与熟人确认见面安排时，你预期这个原型有多大帮助？', '没帮助', '很有帮助'],
    ['scenario_service', '在问路或办事时交流一条短消息，你预期这个原型有多大帮助？', '没帮助', '很有帮助']
  ]
};
const LESSON_PREFERENCES = [
  ['whole', '先看整句，再按需重看'], ['by-character', '按字分段跟练'], ['flexible', '两种随时切换'], ['no-practice', '暂时没有练习需求']
];
const CONFIRM_PREFERENCES = [
  ['always-confirm', '每次确认后再继续'], ['optional-confirm', '需要时自己打开确认'], ['auto-continue', '默认继续，之后可以纠正'], ['undecided', '暂时不确定']
];
const READING_PREFERENCES = [
  ['standard', '默认显示'], ['large', '大字显示'], ['adjustable', '按场景自己调整'], ['undecided', '暂时不确定']
];
const FEATURE_PRIORITIES = [
  ['bidirectional', '双向对话流程'], ['playback', '慢放与重播'], ['lesson', '按字跟练'], ['correction', '修改与确认文字'],
  ['reading', '可调节的文字显示'], ['context', '更多语气或背景线索'], ['none-needed', '暂时没有想优先用的功能']
];
const BARRIERS = [
  ['familiarity', '自己或对方不熟悉 MCS'], ['accuracy', '对结果是否准确还没把握'], ['extra-steps', '操作步骤或等待'],
  ['no-situation', '目前没有合适场景'], ['access', '手机或网络使用不方便'], ['no-barrier', '目前没有明显障碍'], ['other', '其他']
];
const DEVICES = [['phone', '手机'], ['tablet', '平板'], ['computer', '电脑'], ['other-device', '其他']];

const MCS_EXPERIENCE = [
  ['none-used', '从未听过，第一次接触'], ['heard-only', '听说过，但没有学过'],
  ['basics', '了解一些原理或学过基础'], ['have-practised', '实际练习或使用过']
];
const DIFFICULTIES = [
  ['instructions', '说明或按钮含义不够清楚'], ['visual-details', '画面中的动作细节看不清'],
  ['cue-meaning', '不熟悉 MCS，不知道动作代表什么'], ['relevance', '暂时想不到适合自己的用途'],
  ['other-difficulty', '其他困难'], ['no-difficulty', '没有明显困难']
];

const NEED_RATINGS = [
  ['need_lips', '过去三个月，你多常遇到看口型仍分不清说了什么的情况？', '从未', '非常经常'],
  ['need_practice', '过去三个月，你多常需要可以反复观看的口型或发音示例？', '从未', '非常经常'],
  ['need_repair', '过去三个月，交流时你多常需要重新打字或请对方重复，才能确认一句消息？', '从未', '非常经常'],
  ['context_frequency', '过去三个月，纯文字交流时你多常遇到语气不好判断的情况？', '从未', '非常经常'],
  ['current_support', '你目前使用的交流方式，整体有多能满足自己的需要？', '完全不能', '完全能']
];
const COMMUNICATION_MODES = [
  ['text-chat', '打字或文字聊天'], ['captions', '字幕或语音转文字'], ['lipreading', '看口型'],
  ['sign-language', '手语'], ['spoken', '口语交流'], ['mcs-cues', '中文线索语'], ['other-mode', '其他方式']
];
const GAPS = [
  ['gap-clarity', '看清口型或动作'], ['gap-practice', '找到方便跟练的材料'], ['gap-repair', '确认或纠正交流内容'],
  ['gap-tone', '理解语气和上下文'], ['gap-none', '目前没有明显未满足的需要'], ['gap-other', '其他需要']
];
const PACE_RATINGS = [
  ['pace_normal_detail', '正常速度：看清动作细节有多容易？', '很难', '很容易'],
  ['pace_slow_detail', '慢放速度：看清动作细节有多容易？', '很难', '很容易'],
  ['pace_normal_natural', '正常速度：动作节奏看起来有多自然？', '很不自然', '很自然'],
  ['pace_slow_natural', '慢放速度：动作节奏看起来有多自然？', '很不自然', '很自然']
];
const PACE_PREFERENCES = [['pace-normal', '正常速度'], ['pace-slow', '慢放速度'], ['pace-switch', '希望随时切换'], ['pace-neither', '两种都不适合'], ['pace-unsure', '暂时无法判断']];
const QUOTE_OPTIONS = [['quote-yes', '可以匿名引用'], ['quote-no', '请只汇总分析，不直接引用原话']];

const LABELS = Object.fromEntries([
  ...MCS_EXPERIENCE, ...DIFFICULTIES, ...COMMUNICATION_MODES, ...GAPS, ...PACE_PREFERENCES, ...QUOTE_OPTIONS,
  ...LESSON_PREFERENCES, ...CONFIRM_PREFERENCES, ...READING_PREFERENCES, ...FEATURE_PRIORITIES, ...BARRIERS, ...DEVICES,
  ...USE_CASES, ...PLAYBACK_PRIORITIES, ...CONTEXT_PRIORITIES, ...FOLLOW_UP,
  ...Object.entries(VIEWS), ['both', '两种都可以'], ['neither', '两种都有困难'],
  ['na', '无法判断']
]);

const $ = (selector) => document.querySelector(selector);
const demo = $('#demo');
const questions = $('#questions');
const participantSelect = $('#participant');
const url = new URL(location.href);
const initialId = (url.searchParams.get('p') || '').toUpperCase();
let participant = PARTICIPANTS.includes(initialId) ? initialId : 'P00';
let storageAvailable = true;
let draft = loadDraft();
let chapter = draft.chapter ?? 0;
let clipIndex = draft.clipIndex ?? 0;
let view = firstView();
let context = 'plain';
let stage = 0;
let playbackRate = 1;
let lessonEnd = null;
let readingMode = 'standard';
let feedbackErrorsShown = false;
let completionShown = false;

function loadDraft() {
  const blank = { answers: {}, played: {}, actions: {}, editorText: '我今天过来接你。' };
  try {
    const current = localStorage.getItem(storageKey());
    const raw = JSON.parse(current || '{}');
    const restored = { ...blank, ...raw };
    restored.chapter = Number.isInteger(restored.chapter) ? Math.max(0, Math.min(CHAPTERS.length - 1, restored.chapter)) : 0;
    return restored;
  } catch {
    return blank;
  }
}

function recordAction(key) {
  draft.actions[key] = (draft.actions[key] ?? 0) + 1;
  persist();
}

function storageKey() {
  return 'qyutong-study:' + VERSION + ':' + participant;
}

function persist() {
  try {
    localStorage.setItem(storageKey(), JSON.stringify({ ...draft, chapter, clipIndex }));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  updateProgress();
}

function has(key) {
  return answerComplete(key,draft.answers[key]);
}

function updateFeedbackFields() {
  for (const key of FEEDBACK_KEYS) {
    const field = questions.querySelector('[name="' + key + '"]');
    if (!field) continue;
    const length = feedbackLength(draft.answers[key]);
    const remaining = Math.max(0, FEEDBACK_MIN_LENGTH - length);
    $('#' + key + '-count').textContent = '已写 ' + length + ' 字 · ' + (remaining ? '还差 ' + remaining + ' 字' : '已达到最低字数');
    field.setAttribute('aria-invalid', String(feedbackErrorsShown && remaining > 0));
  }
  const summary = $('#feedback-summary');
  if (summary) summary.hidden = !feedbackErrorsShown || FEEDBACK_KEYS.every(has);
}

function count(keys) {
  return keys.filter(has).length;
}

function requiredKeys() {
  return ANSWER_GROUPS;
}

function updateProgress() {
  const groups = requiredKeys();
  const complete = groups.map((keys,index) => count(keys) === keys.length && REQUIRED_VIDEOS.filter(item=>item.chapter===index).every(item=>videoPlayed(item,draft.played)));
  const total = complete.filter(Boolean).length;
  $('#progress').value = total;
  $('#progress-label').textContent = '完成 ' + total + ' / ' + CHAPTERS.length + ' 部分';
  for (const button of $('#chapters').querySelectorAll('button')) {
    const index = Number(button.dataset.index);
    button.querySelector('.complete-mark').hidden = !complete[index];
    button.setAttribute('aria-label', CHAPTERS[index] + (complete[index] ? '，已完成' : ''));
  }
  document.querySelectorAll('.saved').forEach((status) => {
    status.textContent = storageAvailable ? '已保存在当前浏览器' : '草稿保存失败，请先下载草稿';
  });
  updateFeedbackFields();
  updateCompletionUI();
}

function questionLabels() {
  // Reuse the exported question labels so reminders and CSV refer to the same items.
  return Object.fromEntries(exportRows('draft').slice(1).filter(row=>!row[10].startsWith('action:')).map(row=>[row[10],(row[2]==='视频呈现'?row[4]+' · ':'')+row[3]]));
}

function updateCompletionUI() {
  const state=checkCompletion(participant,draft.answers,draft.played);
  const trial=participant==='P00';
  $('#participant-notice').classList.toggle('trial-notice',trial);
  $('#participant-notice').innerHTML=trial
    ? '<strong>当前为 P00 试跑模式，不计入正式统计。</strong><p>正式参与请先选择组织者分配的 P01–P15。切换编号会打开对应的独立答卷，当前试跑内容会保留。</p>'+button('选择正式编号','choose-participant','mini-button')
    : '<strong>当前编号：'+participant+'</strong><p>请使用组织者分配的唯一编号。完成题目和指定视频体验后，才能下载正式答卷。</p>';
  const panel=$('#completion-panel');
  panel.hidden=!completionShown;
  if(completionShown){
    const labels=questionLabels();
    $('#completion-title').textContent=state.ready?'答卷检查：可以下载正式答卷':'答卷检查：'+state.missingAnswers.length+' 项待答，'+state.missingVideos.length+' 段视频未记录播放'+(trial?' · 当前为试跑':'');
    const questionGroups=CHAPTERS.map((name,index)=>{
      const items=state.missingAnswers.filter(item=>item.chapter===index);
      return items.length?'<li><strong>'+name+' · '+items.length+' 项待完成</strong><ul>'+items.map(item=>'<li>'+button(esc(labels[item.key]||item.key)+(FEEDBACK_KEYS.includes(item.key)?'（至少 20 字）':''),'resolve-answer','issue-link','data-key="'+item.key+'"')+'</li>').join('')+'</ul></li>':'';
    }).join('');
    $('#completion-content').innerHTML=(trial?'<p class="feedback-error">P00 只能下载试跑答卷或草稿。正式参与请先选择已分配的编号。</p>':'')
      +(state.ready?'<p>题目已答齐，两条反馈字数达标，指定视频均已记录播放。</p>':'<p>点击下方项目可直接前往补做。评分可以选择「无法判断」；未完成时仍可下载草稿。</p>')
      +(questionGroups?'<ul class="completion-list">'+questionGroups+'</ul>':'')
      +(state.missingVideos.length?'<h3>需要播放的视频</h3><ul class="completion-list">'+state.missingVideos.map(item=>'<li>'+button(esc(item.label),'resolve-video','issue-link','data-key="'+item.key+'"')+'</li>').join('')+'</ul>':'');
  }
  for(const field of questions.querySelectorAll('[data-question]')) field.classList.toggle('question-missing',completionShown&&!has(field.dataset.question));
  const videoList=$('#video-checklist');
  if(videoList){
    videoList.innerHTML='<strong>本部分的视频体验</strong><ul>'+REQUIRED_VIDEOS.filter(item=>item.chapter===chapter).map(item=>'<li class="'+(videoPlayed(item,draft.played)?'video-done':'video-pending')+'">'+button(esc(item.label),'resolve-video','issue-link','data-key="'+item.key+'"')+'<span>'+(videoPlayed(item,draft.played)?'已记录播放':'尚未记录播放')+'</span></li>').join('')+'</ul><p class="microcopy">请点击播放按钮。仅切换画面或速度不算播放；记录表示开始播放，不表示已看完或理解正确。</p>';
  }
  const status=$('#download-status');
  if(status) status.textContent=trial?'当前是试跑，导出的文件不会计入正式统计。':state.ready?'已完成检查，可以下载正式答卷。':'还需完成 '+state.missingAnswers.length+' 项回答和 '+state.missingVideos.length+' 段视频体验。';
}

function showCompletion() {
  completionShown=true;
  feedbackErrorsShown=true;
  updateProgress();
  $('#completion-panel').open=true;
  $('#completion-title').focus({preventScroll:true});
  $('#completion-panel').scrollIntoView({block:'start'});
  $('#announcement').textContent=$('#completion-title').textContent;
}

function resolveItem(key,isVideo) {
  const target=isVideo?REQUIRED_VIDEOS.find(item=>item.key===key):ANSWER_GROUPS.flatMap((keys,chapter)=>keys.map(key=>({key,chapter}))).find(item=>item.key===key);
  if(!target)return;
  if(target.chapter===3){
    clipIndex=target.clipIndex??(key.startsWith('clip2')||key==='playback_priority'?1:0);
    view=target.view??(key.endsWith('_full')?'full':key.endsWith('_mouth')?'mouth':firstView());
  }
  if(target.stage!==undefined)stage=target.stage;
  playbackRate=target.rate??1;
  chapter=target.chapter;
  persist();
  render();
  $('#completion-panel').open=false;
  const destination=isVideo?demo.querySelector('video'):questions.querySelector('[name="'+key+'"]');
  destination?.focus({preventScroll:true});
  (isVideo?demo:destination?.closest('[data-question]')||questions).scrollIntoView({block:'center'});
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function selected(key, value) {
  return String(draft.answers[key]) === String(value) ? ' checked' : '';
}

function options(key, legend, values) {
  return `<fieldset data-question="${key}"><legend>${esc(legend)}</legend><div class="choice-stack">${values.map(([value, label]) =>
    `<label class="choice"><input type="radio" name="${key}" value="${esc(value)}"${selected(key, value)}><span>${esc(label)}</span></label>`
  ).join('')}</div></fieldset>`;
}

function scale(key, legend, low, high, optionalLabel) {
  const values = [1, 2, 3, 4, 5];
  return `<fieldset data-question="${key}"><legend>${esc(legend)}</legend><div class="scale-row">${values.map((value) =>
    `<label class="scale-option"><input type="radio" name="${key}" value="${value}" aria-label="${value}${value === 1 ? ' ' + esc(low) : value === 5 ? ' ' + esc(high) : ''}"${selected(key, value)}><span aria-hidden="true">${value}</span></label>`
  ).join('')}</div><div class="scale-endpoints" aria-hidden="true"><span>1 ${esc(low)}</span><span>5 ${esc(high)}</span></div>${optionalLabel ?
    `<label class="choice" style="margin-top:6px"><input type="radio" name="${key}" value="na"${selected(key, 'na')}><span>${esc(optionalLabel)}</span></label>` : ''}</fieldset>`;
}

function textField(key, legend, placeholder = '请写明具体位置、经历或原因，至少 20 字') {
  return `<div class="text-field" data-question="${key}"><label class="field-label" for="${key}">${esc(legend)}</label>
    <textarea id="${key}" name="${key}" minlength="${FEEDBACK_MIN_LENGTH}" maxlength="600" required aria-describedby="${key}-hint ${key}-count" placeholder="${esc(placeholder)}">${esc(draft.answers[key])}</textarea>
    <p id="${key}-hint" class="microcopy">每条至少 ${FEEDBACK_MIN_LENGTH} 字，按汉字、字母和数字计数；空格和标点不计入。</p>
    <p id="${key}-count" class="feedback-count" aria-live="polite" aria-atomic="true"></p></div>`;
}

function panelTitle(label, title, intro = '') {
  return `<p class="panel-label">${label}</p><h2 id="demo-title" tabindex="-1">${title}</h2>${intro ? `<p class="panel-intro">${intro}</p>` : ''}`;
}

function questionTitle(title, intro, index) {
  return `<div class="question-head"><h2 id="question-title" tabindex="-1">${title}</h2>${index ? `<span class="question-count">${index}</span>` : ''}</div>
    <p class="panel-intro">${intro}</p>`;
}

function button(label, action, kind = 'primary', data = '') {
  return `<button type="button" class="${kind}" data-action="${action}" ${data}>${label}</button>`;
}

function media(file, label, poster = '') {
  return `<div class="media-stage"><video aria-label="${esc(label)}" src="assets/${file}" ${poster ? `poster="assets/${poster}"` : ''} controls playsinline muted preload="metadata"></video></div>`;
}

function demoTools() {
  return `<div class="media-tools"><span>播放速度</span>
    ${button('正常', 'rate', 'mini-button', `data-rate="1" aria-pressed="${playbackRate === 1}"`)}
    ${button('慢放', 'rate', 'mini-button', `data-rate="0.65" aria-pressed="${playbackRate === 0.65}"`)}
    ${button('重播', 'replay', 'mini-button')}</div>`;
}

function needsDemo() {
  return panelTitle('开始体验', '先了解你的日常需要', '先回想自己的日常经历，再进入演示。没有相关经历可以选「不适用」。')
    + '<div class="context-card"><strong>你会体验什么</strong><p>一次预设对话、两种视频画面、句子跟练、文字确认和字号切换。</p></div>'
    + '<div class="context-card"><strong>怎样填写</strong><p>按真实感受评价，低分、高分和无法判断都同样有用。无需辨认音节，也无需自己做手势。</p></div>'
    + '<div class="context-card"><strong>填写与使用</strong><p>共九部分，可中途下载或暂停。答案仅保存在你的浏览器，最后下载后交给团队，用于课程项目的汇总分析。正式下载前需答齐题目、播放指定视频，两条文字反馈各至少 20 字（不计空格和标点）。未完成可先下载草稿。末尾可选择是否允许匿名引用你的两条意见。</p></div>';
}
function needsQuestions() {
  return questionTitle('你的使用背景', '请在观看演示前填写。这些问题没有标准答案。')
    + '<div class="form-content">'
    + options('mcs', '参加前，你对中文线索语有多熟悉？', MCS_EXPERIENCE)
    + options('device', '这次主要用哪种设备体验？', DEVICES)
    + multiField('communication_modes', '日常最常用哪些交流方式？', COMMUNICATION_MODES, 3)
    + NEED_RATINGS.map(([key,title,low,high]) => scale(key,title,low,high,'不适用或无法判断')).join('')
    + options('biggest_gap', '目前最希望得到哪方面的额外支持？', GAPS)
    + '</div><div class="action-row">' + button('先看入门说明', 'chapter', 'primary', 'data-index="1"') + '</div>';
}

function introDemo() {
  return panelTitle('统一入门说明', '第一次接触，也可以参加', '先读下面的说明，再观看一个带文字的示例。你可以暂停或反复看。')
    + '<div class="context-card"><strong>什么是中文线索语（MCS）？</strong><p>它用手形、手的位置与口型配合，为普通话语音提供视觉线索。它与日常手语不同，读懂这些线索需要学习。</p></div>'
    + '<div class="example-caption"><span>这个示例对应的文字</span><strong>明天见</strong></div>'
    + media('greeting.mp4', '明天见，入门示例', 'greeting-poster.jpg') + demoTools()
    + '<p class="source-note">这是预录示例。文字已经给出，可以静音观看，无需猜测它说了什么。</p>';
}

function introQuestions() {
  return questionTitle('接下来怎样体验', '所有参与者都看同一份说明，按自己的真实感受作答。')
    + '<div class="context-card"><strong>你需要做什么</strong><p>试用播放与切换画面、修改文字、调整字号等功能，评价画面是否看得清、按钮是否好用，以及自己是否预期有用。</p></div>'
    + '<div class="context-card"><strong>不要求你会 MCS</strong><p>无需辨认音节、模仿手势或判断动作是否规范。暂时不理解动作含义，不影响你继续体验。无法评价的题目可选「无法判断」。</p></div>'
    + '<div class="form-content">'
    + scale('intro_clarity', '看完说明后，你对接下来要做什么有多清楚？', '很不清楚', '很清楚', '未体验或无法判断')
    + '</div><div class="action-row">' + button('开始对话体验', 'chapter', 'primary', 'data-index="2"') + '</div>';
}

function exchangeDemo() {
  const steps = ['发出文字', '收到回应', '查看结果'];
  const stageTabs = steps.map((label, index) =>
    button(`<small>${index + 1}</small> ${label}`, 'stage', 'stage-tab',
      `data-stage="${index}" aria-pressed="${index === stage}"`)
  ).join('');
  let content = '';
  if (stage === 0) {
    content = media('greeting.mp4', '我方发出的预设中文线索语视频', 'greeting-poster.jpg') + demoTools()
      + '<p class="source-note">输入「明天见」后，原型以已有音节视频合成的预设样例。</p>';
  } else if (stage === 1) {
    content = media('reply.mp4', '对方发来的预录中文线索语回应', 'reply-poster.jpg') + demoTools()
      + '<p class="source-note">预录的真人手口回应。可以慢放或重播，然后查看结果。</p>';
  } else {
    content = `<div class="media-stage media-text"><div class="answer-card"><p class="subtitle">我明天过来接你。</p>
      <audio src="assets/reply-voice.m4a" aria-label="可选的合成语音播报" controls preload="none"></audio></div></div>
      <p class="source-note">文字来自预先标注的样例。语音是该文字的合成播报。</p>`;
  }
  return panelTitle('互动演示', '体验一次双向对话', '按顺序走完三个步骤。可以静音完成所有题目。')
    + `<div class="stage-tabs" aria-label="示例步骤">${stageTabs}</div>` + content
    + '<p class="tip">线索语通过手形、手势位置与口型提供语音线索。体验无需你自己做手势。</p>';
}

function exchangeQuestions() {
  return questionTitle('对话流程反馈', '走完三个步骤后，按你自己的体验评分。')
    + '<div class="form-content">'
    + scale('exchange_ease', '走完这次对话有多容易？', '很难', '很容易', '无法判断')
    + scale('exchange_clarity', '你有多清楚目前在看对话的哪一步？', '很不清楚', '很清楚', '无法判断')
    + scale('exchange_confirm', '想核对对方的回复时，你有多容易找到那条文字？', '很难', '很容易', '无法判断')
    + options('follow_up', '如果你发现回复文字有问题，最想先看到哪项功能？', FOLLOW_UP)
    + '</div><div class="action-row">' + button('继续视频呈现', 'chapter', 'primary', 'data-index="3"') + '</div>';
}

function firstView() {
  return participant !== 'P00' && Number(participant.slice(1)) % 2 === 0 ? 'full' : 'mouth';
}

function videoDemo() {
  const clip = CLIPS[clipIndex];
  const order = firstView() === 'full' ? ['full', 'mouth'] : ['mouth', 'full'];
  const next = clipIndex === 0 ? 1 : 0;
  return panelTitle('互动演示', '切换视频呈现方式', '以正常速度观看同一个片段的两种画面，再分别评分。')
    + `<div class="media-tools"><span>当前素材</span>
      ${CLIPS.map(({ label }, index) => button(label, 'clip', 'mini-button',
        `data-index="${index}" aria-pressed="${clipIndex === index}"`)).join('')}</div>`
    + `<div class="media-tools" aria-label="呈现方式">${order.map((key) => button(VIEWS[key], 'view', 'mini-button',
      `data-view="${key}" aria-pressed="${view === key}"`)).join('')}</div>`
    + `<div class="example-caption"><span>当前示例对应的文字</span><strong>${clip.text}</strong></div>`
    + media(clip.asset + '-' + view + '.mp4', clip.label + '，' + VIEWS[view]) + '<div class="media-tools">' + button('重播', 'replay', 'mini-button') + '</div>'
    + `<p class="source-note">这是原型学习模式中的短片。${next === 1 ? '评完片段一后，可以切换到片段二。' : ''}</p>`;
}

function videoQuestions() {
  const { id, label } = CLIPS[clipIndex];
  const order = firstView() === 'full' ? ['full', 'mouth'] : ['mouth', 'full'];
  const mediaRatings = order.map((key) => scale(id + '_' + key, '看「' + VIEWS[key] + '」时，画面中展示的动作细节有多容易看清？',
    '很难', '很容易', '无法判断')).join('');
  return questionTitle('视频呈现反馈', '看完两种画面后，分别评价视觉细节。无需理解或辨认 MCS。', label + ' / 共两段')
    + '<div class="form-content">' + mediaRatings
    + options(id + '_preference', '继续观看这类示例时，你更希望保留哪种画面？',
      [...order.map((key) => [key, VIEWS[key]]), ['both', '两种都可以'], ['neither', '两种都有困难']])
    + (clipIndex === 1 ? options('playback_priority', '如果原型只能优先保留一项观看功能，你会选什么？', PLAYBACK_PRIORITIES) : '')
    + '</div><div class="action-row">'
    + (clipIndex === 0 ? button('体验片段二', 'clip', 'primary', 'data-index="1"') :
      button('继续句子跟练', 'chapter', 'primary', 'data-index="4"'))
    + '</div>';
}


function ratingSet(group) {
  return EXTRA_RATINGS[group].map(([key, title, low, high]) => scale(key, title, low, high, '未体验或无法判断')).join('');
}

function lessonDemo() {
  return panelTitle('互动演示', '按自己的节奏看一句', '试着播放「明天见」，点一个字重看，再试慢放。这里只评价播放操作，无需模仿手势。')
    + media('greeting.mp4', '明天见，句子跟练视频', 'greeting-poster.jpg')
    + '<div class="media-tools" aria-label="按字定位">' + LESSON_PARTS.map(({ label, pinyin }, index) =>
      button(label + '<small>' + pinyin + '</small>', 'lesson-part', 'character-button', 'data-index="' + index + '"')
    ).join('') + '</div>'
    + '<div class="media-tools">' + button('播放整句', 'lesson-whole', 'secondary') + '</div>' + demoTools()
    + '<div class="context-card"><strong>比较两种播放速度</strong><p>' + (firstView() === 'full' ? '请先看慢放，再看正常速度。' : '请先看正常速度，再看慢放。') + '两种使用同一条视频。</p><div class="media-tools">' + (firstView() === 'full' ? ['slow','normal'] : ['normal','slow']).map(key => button(key === 'normal' ? '观看正常速度' : '观看慢放', 'pace', 'secondary', 'data-pace="' + key + '"')).join('') + '</div></div>'
    + '<p class="source-note">单字按钮播放对应片段。速度对比为 1× 与 0.65×；慢放改变播放速度。</p>';
}

function paceQuestions() {
  const order = firstView() === 'full' ? [1,0,3,2] : [0,1,2,3];
  return order.map(index => { const [key,title,low,high] = PACE_RATINGS[index]; return scale(key,title,low,high,'未体验或无法判断'); }).join('');
}

function lessonQuestions() {
  return questionTitle('跟练体验反馈', '体验整句播放、单字重看和慢放，再评价这些控制是否顺手。')
    + '<div class="form-content">' + ratingSet('lesson')
    + '<h3 class="subsection">两种速度的体验</h3>' + paceQuestions()
    + options('pace_preference', '以后跟练时，你更希望使用哪种速度？', PACE_PREFERENCES)
    + options('lesson_preference', '你更喜欢哪种练习方式？', LESSON_PREFERENCES)
    + '</div><div class="action-row">' + button('继续文字确认', 'chapter', 'primary', 'data-index="5"') + '</div>';
}

function correctionDemo() {
  return panelTitle('交互样例', '改好一句话，再确认', '你想表达「我明天过来接你」。请检查下面这条预设文字，按你的需要修改后确认。')
    + '<div class="context-card"><strong>你想表达的意思</strong><p>我明天过来接你。</p></div>'
    + '<div class="editor-area"><label class="field-label" for="correction-input">待确认的文字</label>'
    + '<textarea id="correction-input" maxlength="120">' + esc(draft.editorText) + '</textarea>'
    + '<div class="action-row">' + button('确认这条文字', 'confirm-text', 'primary', draft.editorText.trim() ? '' : 'disabled')
    + button('重新体验', 'reset-text', 'secondary') + '</div></div>'
    + '<div id="confirmation-result" class="context-card" role="status">'
    + (draft.confirmedText ? '<strong>确认后的文字</strong><p>' + esc(draft.confirmedText) + '</p>' : '<strong>等待你确认</strong><p>确认后会在这里显示最后保留的文字。</p>')
    + '</div><p class="source-note">这是预设文字的修改与确认体验，内容仅保存在当前浏览器。</p>';
}

function correctionQuestions() {
  return questionTitle('修改与确认反馈', '实际修改或确认一条文字后，评价这一步是否清楚、是否符合你的习惯。')
    + '<div class="form-content">' + ratingSet('correction')
    + options('confirm_preference', '以后使用时，你希望系统什么时候请你确认？', CONFIRM_PREFERENCES)
    + '</div><div class="action-row">' + button('继续阅读显示', 'chapter', 'primary', 'data-index="6"') + '</div>';
}

function readingDemo() {
  return panelTitle('显示体验', '换一种字号读回复', '切换默认显示和大字显示，看看哪种更适合你当前的设备。')
    + '<div class="media-tools" aria-label="文字显示方式">' + ['standard', 'large'].map((mode) =>
      button(mode === 'standard' ? '默认显示' : '大字显示', 'reading-mode', 'mini-button',
        'data-mode="' + mode + '" aria-pressed="' + (mode === readingMode) + '"')
    ).join('') + '</div>'
    + '<div class="reading-sample ' + readingMode + '"><p class="message-speaker">对方的回复</p>'
    + '<p class="message-body">我明天过来接你。</p><p class="message-status">文字已确认，可继续交流。</p></div>'
    + '<p class="source-note">两种显示使用同一条文字和状态提示。</p>';
}

function readingQuestions() {
  return questionTitle('显示与阅读反馈', '分别试过两种显示后，告诉我们阅读起来是否轻松。')
    + '<div class="form-content">' + ratingSet('reading')
    + options('reading_preference', '你希望原型默认提供哪种文字显示？', READING_PREFERENCES)
    + '</div><div class="action-row">' + button('继续歧义场景', 'chapter', 'primary', 'data-index="7"') + '</div>';
}

function multiField(key, title, values, limit) {
  const chosen = draft.answers[key] ?? [];
  return '<fieldset data-question="'+key+'"><legend>' + title + '</legend><p class="microcopy">最多选择 ' + limit + ' 项。</p><div class="choice-stack">' + values.map(([value,label]) =>
    '<label class="choice"><input type="checkbox" name="' + key + '" value="' + value + '"' + (chosen.includes(value) ? ' checked' : '') + '><span>' + label + '</span></label>').join('') + '</div></fieldset>';
}

function prioritiesField() {
  const chosen = draft.answers.priorities ?? [];
  return '<fieldset data-question="priorities"><legend>如果后续优先打磨三项功能，你会选哪些？</legend><p class="microcopy">最多选三项，也可以选择暂时没有。</p><div class="choice-stack">'
    + FEATURE_PRIORITIES.map(([value, label]) =>
      '<label class="choice"><input type="checkbox" name="priorities" value="' + value + '"' + (chosen.includes(value) ? ' checked' : '') + '><span>' + label + '</span></label>'
    ).join('') + '</div></fieldset>';
}


const CONTEXT_VIEWS = [
  ['plain', '只看一句话', '你收到了一条消息。'],
  ['punctual', '查看情境一', '你在约定时间到达，朋友看到你时说了这句话。'],
  ['late', '查看情境二', '你比约定晚到二十分钟，朋友看到你时说了同一句话。']
];

function contextDemo() {
  const selectedContext = CONTEXT_VIEWS.find(([key]) => key === context);
  return panelTitle('使用场景', '「你真准时」是什么意思？', '切换两个情境，感受同一句话在交流中可能需要哪些线索。')
    + `<div class="stage-tabs" aria-label="示例情境">${CONTEXT_VIEWS.map(([key, label]) =>
      button(label, 'context', 'stage-tab', `data-context="${key}" aria-pressed="${context === key}"`)).join('')}</div>`
    + '<div class="media-stage media-text"><p class="subtitle">你真准时。</p></div>'
    + `<div class="context-card"><strong>${selectedContext[1]}</strong><p>${selectedContext[2]}</p></div>`;
}

function contextQuestions() {
  return questionTitle('歧义场景反馈', '按你的真实交流习惯回答。')
    + '<div class="form-content">'
    + scale('context_need', '如果这类消息能附上说话者的表情和动作，你预期有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + options('context_priority', '遇到这种情形，你最想在原型里看到哪一种补充信息？', CONTEXT_PRIORITIES)
    + ratingSet('scenarios')
    + '</div><div class="action-row">' + button('继续总体评价', 'chapter', 'primary', 'data-index="8"') + '</div>';
}

function feedbackDemo() {
  const selectedFeedback = FEEDBACK[participant] ?? FEEDBACK.P01;
  return panelTitle('回顾演示', '回看线索语回应', '填反馈时可以回看片段，也可以切回已经做过的部分。')
    + media('reply.mp4', '预录中文线索语回复', 'reply-poster.jpg') + demoTools()
    + `<div class="context-card"><strong>${participant === 'P00' ? '试跑' : participant} 的反馈方向</strong><p>${selectedFeedback[0]}</p></div>`
    + '<p class="source-note">答卷会以参与编号标记。请勿填写姓名、联系方式或其他可识别个人的信息。</p>';
}

function feedbackQuestions() {
  const [, first, second] = FEEDBACK[participant] ?? FEEDBACK.P01;
  return questionTitle('满意度与反馈', '按你的实际感受填写。没法判断的评分可以选「无法判断」。')
    + '<div class="form-content">'
    + scale('satisfaction', '整体体验有多满意？', '很不满意', '很满意', '无法判断')
    + scale('reuse', '如果有类似需求，你有多愿意再用一次这个原型？', '很不愿意', '很愿意', '无法判断')
    + scale('learning', '这些视频示例和播放功能，对你了解或练习中文线索语可能有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + scale('communication', '仅根据这次示例，你预计这个原型在日常短句交流中对自己有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + scale('learning_interest', '体验后，你对继续了解或尝试中文线索语有多大兴趣？', '完全不感兴趣', '很有兴趣', '无法判断')
    + multiField('difficulty_reasons', '这次体验中，哪些因素让你感到困难或难以判断？', DIFFICULTIES, 3)
    + options('use_case', '你最可能在哪个场景用一次？', USE_CASES)
    + options('barrier', '如果考虑实际使用，最可能影响你使用的因素是什么？', BARRIERS)
    + prioritiesField()
    + textField('feedback1', '反馈一。' + first)
    + textField('feedback2', '反馈二。' + second)
    + options('quote_permission', '是否允许团队在课程答辩中用参与编号匿名引用这两条意见？', QUOTE_OPTIONS)
    + `<div class="export-note"><strong>${participant==='P00'?'当前为试跑':'完成后保存答卷'}</strong><p>${participant==='P00'?'试跑答卷可随时下载用于检查流程，不会计入正式统计。正式参与请先选择组织者分配的编号。':'正式下载前会检查各题、两条反馈字数和指定视频播放记录。评分无法判断时可以选对应选项；未完成时可用页面上方的「下载草稿 CSV」保存进度。'}</p><p id="download-status" role="status"></p></div>
    <p id="feedback-summary" class="feedback-error" role="alert" hidden>请将两条反馈各补充到至少 ${FEEDBACK_MIN_LENGTH} 字，再下载正式答卷。当前内容已保留。</p></div>
    <div class="action-row">${button('检查未完成项','check-completion','secondary')}${button(participant==='P00'?'下载试跑答卷 CSV':'检查并下载正式答卷 CSV',participant==='P00'?'export-trial':'export')}<span class="saved" role="status"></span></div>`;
}

function renderMedia() {
  lessonEnd = null;
  demo.innerHTML = [needsDemo, introDemo, exchangeDemo, videoDemo, lessonDemo, correctionDemo, readingDemo, contextDemo, feedbackDemo][chapter]();
  if(REQUIRED_VIDEOS.some(item=>item.chapter===chapter))demo.insertAdjacentHTML('beforeend','<div id="video-checklist" class="video-checklist"></div><p id="media-error" class="feedback-error" role="status" hidden></p>');
  const video = demo.querySelector('video');
  if (video) video.playbackRate = playbackRate;
  if (video) {
    const section=chapter,exchangeStep=stage,clipKey=section===3?CLIPS[clipIndex].id+'_'+view:null;
    const recordPlayback=()=>{
      if(video!==demo.querySelector('video')||video.paused||video.seeking||video.readyState<2)return;
      let keys=[];
      if(section===1)keys=['intro_example'];
      if(section===2&&exchangeStep<2)keys=[exchangeStep===0?'exchange_sent':'exchange_reply'];
      if(clipKey)keys=[clipKey];
      if(section===4){
        const speed=video.playbackRate===0.65?'slow':video.playbackRate===1?'normal':null;
        if(speed)keys=['pace_'+speed+'_detail','pace_'+speed+'_natural'];
      }
      let changed=false;
      for(const key of keys)if(draft.played[key]!==true){draft.played[key]=true;changed=true;}
      if(changed)persist();
      const error=$('#media-error');if(error)error.hidden=true;
    };
    video.addEventListener('playing',()=>{recordPlayback();recordAction('video-play-'+section);});
    video.addEventListener('timeupdate',recordPlayback);
    video.addEventListener('error',()=>{
      const error=$('#media-error');
      if(error){error.textContent='视频未能加载，请检查网络后重试。没有成功播放时不会记为已体验；也可以先下载草稿。';error.hidden=false;}
    });
  }
  if (video && chapter === 4) {
    video.addEventListener('timeupdate', () => {
      if (lessonEnd !== null && video.currentTime >= lessonEnd - 0.025) {
        video.pause();
        lessonEnd = null;
      }
    });
  }
  updateCompletionUI();
}

function render(focus = '') {
  $('#chapters').innerHTML = CHAPTERS.map((name, index) =>
    `<button type="button" class="chapter-button" data-action="chapter" data-index="${index}" ${chapter === index ? 'aria-current="step"' : ''}>
      ${name}<span class="complete-mark" aria-hidden="true" hidden>✓</span></button>`
  ).join('');
  renderMedia();
  questions.innerHTML = [needsQuestions, introQuestions, exchangeQuestions, videoQuestions, lessonQuestions, correctionQuestions, readingQuestions, contextQuestions, feedbackQuestions][chapter]();
  updateProgress();
  if (focus) $(focus)?.focus({ preventScroll: true });
}

function goToChapter(index) {
  playbackRate = 1;
  chapter = Math.max(0, Math.min(CHAPTERS.length - 1, index));
  persist();
  render('#demo-title');
  if (matchMedia('(max-width: 720px)').matches) demo.scrollIntoView({ block: 'start' });
}

function csvCell(value) {
  let raw = String(value ?? '');
  if (/^\s*[=+@-]|^[\t\r\n]/.test(raw)) raw = "'" + raw;
  return '"' + raw.replace(/"/g, '""') + '"';
}

function exportRows(kind = 'final') {
  const rows = [['版本', '参与编号', '部分', '指标', '条件', '评分（1–5）', '选择或反馈', '是否实际播放', '记录类型', '答案来源', '指标ID', '原始答案', '导出时间']];
  const exportedAt = new Date().toISOString();
  const append = (section, label, key, setting = '') => {
    const value = draft.answers[key] ?? '';
    const rating = /^[1-5]$/.test(value) && !key.startsWith('feedback');
    const display = Array.isArray(value) ? value.map((item) => LABELS[item] ?? item).join('；') : LABELS[value] ?? value;
    rows.push([VERSION, participant, section, label, setting, rating ? value : '',
      rating ? '' : display, draft.played[key] ? '是' : '', rating ? '主观评分' : '选择或反馈', '当前版填写', key, JSON.stringify(value), exportedAt]);
  };
  for (const [key,label] of NEED_RATINGS) append('使用背景', label, key, '演示前自报');
  append('使用背景', 'MCS 熟悉度', 'mcs');
  append('使用背景', '主要交流方式', 'communication_modes');
  append('使用背景', '最需要的支持', 'biggest_gap');
  append('认识 MCS', '任务说明清晰度', 'intro_clarity', '统一入门说明后');
  append('对话体验', '操作容易度', 'exchange_ease', '预设双向对话');
  append('对话体验', '步骤清晰度', 'exchange_clarity', '预设双向对话');
  append('对话体验', '查找结果文字的容易度', 'exchange_confirm', '预设双向对话');
  append('对话体验', '优先改进需求', 'follow_up');
  for (const { id, label } of CLIPS) {
    for (const [key, display] of Object.entries(VIEWS)) append('视频呈现', '看清动作细节的容易度', id + '_' + key, label + ' / ' + display);
    append('视频呈现', '呈现方式偏好', id + '_preference', label);
  }
  append('视频呈现', '优先观看功能', 'playback_priority');
  for (const [group, section] of [['lesson', '句子跟练'], ['correction', '文字确认'], ['reading', '阅读显示'], ['scenarios', '场景价值']]) {
    for (const [key, label] of EXTRA_RATINGS[group]) append(section, label, key, group === 'scenarios' ? '情境描述后的预期帮助' : '交互样例体验后');
  }
  for (const [key,label] of PACE_RATINGS) append('播放速度对比', label, key, '同一片段 / 1x 与 0.65x');
  append('句子跟练', '播放速度偏好', 'pace_preference');
  append('句子跟练', '跟练方式偏好', 'lesson_preference');
  append('文字确认', '确认时机偏好', 'confirm_preference');
  append('阅读显示', '字号偏好', 'reading_preference');
  append('使用背景', '体验设备', 'device');
  append('总体评价', '本次体验困难', 'difficulty_reasons', '最多三项');
  append('总体评价', '使用障碍', 'barrier');
  append('总体评价', '优先打磨功能', 'priorities');
  append('歧义场景', '表情和动作的预期帮助', 'context_need', '文字情境演示');
  append('歧义场景', '首选补充信息', 'context_priority');
  for (const [key, label] of [
    ['satisfaction', '整体满意度'], ['reuse', '再次使用意愿'],
    ['learning', '预期的学习帮助'], ['communication', '预期的交流帮助'], ['learning_interest', '继续了解或尝试 MCS 的兴趣'], ['use_case', '首选使用场景']
  ]) append('总体评价', label, key, '体验后');
  const [topic] = FEEDBACK[participant] ?? FEEDBACK.P01;
  append('定向反馈', '反馈一', 'feedback1', topic);
  append('定向反馈', '反馈二', 'feedback2', topic);
  append('定向反馈', '匿名原话引用许可', 'quote_permission');
  const actionLabels = {
    'lesson-whole': '播放整句', 'lesson-part-0': '重看明', 'lesson-part-1': '重看天', 'lesson-part-2': '重看见',
    'confirm-text': '确认文字', 'reset-text': '重置文字样例',
    'pace-normal': '体验正常速度', 'pace-slow': '体验慢放速度',
    'reading-standard': '切换默认字号', 'reading-large': '切换大字'
  };
  CHAPTERS.forEach((name, index) => {
    actionLabels['video-play-' + index] = name + ' / 视频播放';
    actionLabels['replay-' + index] = name + ' / 重播';
    actionLabels['rate-' + index + '-1'] = name + ' / 正常播放';
    actionLabels['rate-' + index + '-0.65'] = name + ' / 慢放';
  });
  for (const [key, count] of Object.entries(draft.actions)) {
    rows.push([VERSION, participant, '操作记录', actionLabels[key] ?? key, '当前浏览器操作次数', '', count, '', '操作次数', '当前版操作', 'action:' + key, JSON.stringify(count), exportedAt]);
  }
  const state=kind==='draft'?'草稿':kind==='trial'?'试跑答卷':'正式答卷';
  const played=JSON.stringify(REQUIRED_VIDEOS.filter(item=>videoPlayed(item,draft.played)).map(item=>item.key));
  return rows.map((row,index)=>[...row,...(index===0?['答卷状态','完成校验规则','必看视频记录']:[state,COMPLETION_RULE,played])]);
}

function download(kind = 'final') {
  if(kind==='final'&&!checkCompletion(participant,draft.answers,draft.played).ready){showCompletion();return;}
  if(kind==='trial'&&participant!=='P00')return;
  const content = '\uFEFF' + exportRows(kind).map((row) => row.map(csvCell).join(',')).join('\r\n');
  const file = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = file;
  anchor.download = 'qyutong-' + participant + (kind==='draft'?'-draft.csv':kind==='trial'?'-trial.csv':'-answers.csv');
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(file), 1500);
  $('#announcement').textContent = kind==='draft'?'已请求下载草稿 CSV':kind==='trial'?'已请求下载试跑答卷，不计入正式统计':'已请求下载正式答卷 CSV';
}

participantSelect.value = participant;
participantSelect.addEventListener('change', () => {
  participant = participantSelect.value;
  const current = new URL(location.href);
  current.searchParams.set('p', participant);
  history.replaceState(null, '', current);
  draft = loadDraft();
  chapter = draft.chapter ?? 0;
  clipIndex = draft.clipIndex ?? 0;
  view = firstView();
  context = 'plain';
  stage = 0;
  playbackRate = 1;
  readingMode = 'standard';
  feedbackErrorsShown = false;
  completionShown = false;
  $('#completion-panel').open=false;
  render();
});

questions.addEventListener('input', (event) => {
  const field = event.target;
  if (!field.name || (field.type === 'radio' && !field.checked)) return;
  if (field.name === 'communication_modes') {
    const chosen = [...questions.querySelectorAll('[name=communication_modes]:checked')];
    if (chosen.length > 3) { field.checked = false; $('#announcement').textContent = '最多选择三种交流方式'; }
    draft.answers.communication_modes = [...questions.querySelectorAll('[name=communication_modes]:checked')].map(input => input.value);
  } else if (field.name === 'difficulty_reasons') {
    const selector = '[name="difficulty_reasons"]';
    if (field.checked && field.value === 'no-difficulty') {
      questions.querySelectorAll(selector).forEach(input => { input.checked = input === field; });
    } else if (field.checked) {
      questions.querySelector(selector + '[value="no-difficulty"]').checked = false;
      if (questions.querySelectorAll(selector + ':checked').length > 3) {
        field.checked = false;
        $('#announcement').textContent = '最多选择三项体验困难';
      }
    }
    draft.answers.difficulty_reasons = [...questions.querySelectorAll(selector + ':checked')].map(input => input.value);
  } else if (field.name === 'priorities') {
    let checked = [...questions.querySelectorAll('[name="priorities"]:checked')];
    if (field.checked && field.value === 'none-needed') {
      checked.forEach((input) => { input.checked = input === field; });
    } else if (field.checked) {
      questions.querySelector('[name="priorities"][value="none-needed"]').checked = false;
      checked = [...questions.querySelectorAll('[name="priorities"]:checked')];
      if (checked.length > 3) {
        field.checked = false;
        $('#announcement').textContent = '最多选择三项优先功能';
      }
    }
    draft.answers.priorities = [...questions.querySelectorAll('[name="priorities"]:checked')].map((input) => input.value);
  } else {
    draft.answers[field.name] = field.value;
  }
  draft.importedKeys = (draft.importedKeys ?? []).filter((key) => key !== field.name);
  persist();
});

demo.addEventListener('input', (event) => {
  if (event.target.id !== 'correction-input') return;
  draft.editorText = event.target.value;
  demo.querySelector('[data-action="confirm-text"]').disabled = !draft.editorText.trim();
  if (draft.confirmedText) {
    draft.confirmedText = '';
    $('#confirmation-result').textContent = '文字已修改，等待你重新确认。';
  }
  persist();
});

document.addEventListener('click', (event) => {
  const control = event.target.closest('button[data-action]');
  if (!control) return;
  const action = control.dataset.action;
  switch (action) {
    case 'choose-participant':
      participantSelect.focus();
      participantSelect.scrollIntoView({block:'center'});
      break;
    case 'check-completion':
      showCompletion();
      break;
    case 'resolve-answer':
      resolveItem(control.dataset.key,false);
      break;
    case 'resolve-video':
      resolveItem(control.dataset.key,true);
      break;
    case 'chapter':
      goToChapter(Number(control.dataset.index));
      break;
    case 'stage':
      stage = Number(control.dataset.stage);
      renderMedia();
      demo.querySelector('[data-stage="' + stage + '"]')?.focus({ preventScroll: true });
      break;
    case 'pace': {
      const video = demo.querySelector('video');
      lessonEnd = null;
      playbackRate = control.dataset.pace === 'slow' ? 0.65 : 1;
      video.playbackRate = playbackRate;
      video.currentTime = 0;
      recordAction('pace-' + control.dataset.pace);
      video.play().catch(() => { $('#announcement').textContent = '请点击视频播放按钮继续'; });
      demo.querySelectorAll('[data-rate]').forEach(item => item.setAttribute('aria-pressed', String(Number(item.dataset.rate) === playbackRate)));
      break;
    }
    case 'rate':
      recordAction('rate-' + chapter + '-' + control.dataset.rate);
      playbackRate = Number(control.dataset.rate);
      demo.querySelector('video').playbackRate = playbackRate;
      demo.querySelectorAll('[data-rate]').forEach((item) => {
        item.setAttribute('aria-pressed', String(Number(item.dataset.rate) === playbackRate));
      });
      break;
    case 'replay': {
      lessonEnd = null;
      recordAction('replay-' + chapter);
      const video = demo.querySelector('video');
      video.currentTime = 0;
      video.play().catch(() => {});
      break;
    }
    case 'clip':
      clipIndex = Number(control.dataset.index);
      view = firstView();
      persist();
      render('#demo-title');
      if (matchMedia('(max-width: 720px)').matches) demo.scrollIntoView({ block: 'start' });
      break;
    case 'view':
      view = control.dataset.view;
      renderMedia();
      demo.querySelector('[data-view="' + view + '"]')?.focus({ preventScroll: true });
      break;
    case 'context':
      context = control.dataset.context;
      renderMedia();
      demo.querySelector('[data-context="' + context + '"]')?.focus({ preventScroll: true });
      break;
    case 'lesson-part': {
      const index = Number(control.dataset.index);
      const segment = LESSON_PARTS[index];
      const video = demo.querySelector('video');
      video.currentTime = segment.start;
      lessonEnd = segment.end;
      recordAction('lesson-part-' + index);
      video.play().catch(() => { $('#announcement').textContent = '请点击视频播放按钮继续'; });
      break;
    }
    case 'lesson-whole': {
      const video = demo.querySelector('video');
      lessonEnd = null;
      video.currentTime = 0;
      recordAction('lesson-whole');
      video.play().catch(() => { $('#announcement').textContent = '请点击视频播放按钮继续'; });
      break;
    }
    case 'confirm-text':
      if (!draft.editorText.trim()) return;
      draft.confirmedText = draft.editorText.trim();
      recordAction('confirm-text');
      renderMedia();
      demo.querySelector('[data-action="confirm-text"]').focus({ preventScroll: true });
      break;
    case 'reset-text':
      draft.editorText = '我今天过来接你。';
      draft.confirmedText = '';
      recordAction('reset-text');
      renderMedia();
      $('#correction-input').focus({ preventScroll: true });
      break;
    case 'reading-mode':
      readingMode = control.dataset.mode;
      recordAction('reading-' + readingMode);
      renderMedia();
      demo.querySelector('[data-mode="' + readingMode + '"]').focus({ preventScroll: true });
      break;
    case 'export':
      download();
      break;
    case 'export-draft':
      download('draft');
      break;
    case 'export-trial':
      download('trial');
      break;
  }
});

render();

const CHAPTERS = ['对话体验', '视频呈现', '句子跟练', '文字确认', '阅读显示', '歧义场景', '总体评价'];
const PARTICIPANTS = ['P00', 'P01', 'P02', 'P03', 'P04', 'P05'];
const VERSION = 'prototype-feedback-3';

const CLIPS = [
  { id: 'clip1', label: '片段一', asset: 's01' },
  { id: 'clip2', label: '片段二', asset: 's06' }
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
  P02: ['视频和播放', '哪一个片段或呈现方式最容易跟上？具体是什么让你更容易看？', '在实际使用时，你最希望增加或改善哪一种播放控制？为什么？'],
  P03: ['真实需求', '请举一个你自己遇过的场景，说明现在通常怎么处理。', '在这个场景里，原型能帮到哪一步？还有哪一步需要其他方式？'],
  P04: ['确认与纠错', '看完回复后，什么信息能让你更清楚接下来会发生什么？', '如果回复文字写错，你希望在哪里改、用什么提示确认改成功？'],
  P05: ['初次上手', '第一次打开页面时，有没有一个词或按钮需要解释？请指出具体位置。', '如果把原型发给只懂 MCS 基本原理的朋友，你最想给他加哪一条提示？']
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
    ['lesson_independent', '按这种方式独自进行下一次练习，你有多大把握？', '没把握', '很有把握']
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

const LABELS = Object.fromEntries([
  ...LESSON_PREFERENCES, ...CONFIRM_PREFERENCES, ...READING_PREFERENCES, ...FEATURE_PRIORITIES, ...BARRIERS, ...DEVICES,
  ...USE_CASES, ...PLAYBACK_PRIORITIES, ...CONTEXT_PRIORITIES, ...FOLLOW_UP,
  ...Object.entries(VIEWS), ['both', '两种都可以'], ['neither', '两种都有困难'],
  ['none-used', '以前没接触过'], ['basics', '懂基本原理'], ['have-practised', '练习过或在使用'],
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

function loadDraft() {
  const blank = { answers: {}, played: {}, actions: {}, editorText: '我今天过来接你。' };
  try {
    const current = localStorage.getItem(storageKey());
    const previous = current ? null : localStorage.getItem('qyutong-study:prototype-feedback-2:' + participant);
    const raw = JSON.parse(current || previous || '{}');
    if (previous) {
      raw.chapter = [0, 1, 5, 6][raw.chapter ?? 0];
      raw.importedFrom = 'prototype-feedback-2';
      raw.importedKeys = Object.keys(raw.answers ?? {});
    }
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
  return String(draft.answers[key] ?? '').trim() !== '';
}

function count(keys) {
  return keys.filter(has).length;
}

function requiredKeys() {
  return [
    ['exchange_ease', 'exchange_clarity', 'exchange_confirm', 'follow_up'],
    [...CLIPS.flatMap(({ id }) => [id + '_mouth', id + '_full', id + '_preference']), 'playback_priority'],
    [...EXTRA_RATINGS.lesson.map(([key]) => key), 'lesson_preference'],
    [...EXTRA_RATINGS.correction.map(([key]) => key), 'confirm_preference'],
    [...EXTRA_RATINGS.reading.map(([key]) => key), 'reading_preference'],
    ['context_frequency', 'context_need', 'context_priority', ...EXTRA_RATINGS.scenarios.map(([key]) => key)],
    ['mcs', 'device', 'satisfaction', 'reuse', 'learning', 'communication', 'use_case', 'barrier', 'priorities', 'feedback1', 'feedback2']
  ];
}

function updateProgress() {
  const groups = requiredKeys();
  const complete = groups.map((keys) => count(keys) === keys.length);
  const total = complete.filter(Boolean).length;
  $('#progress').value = total;
  $('#progress-label').textContent = '完成 ' + total + ' / ' + CHAPTERS.length + ' 部分';
  for (const button of $('#chapters').querySelectorAll('button')) {
    const index = Number(button.dataset.index);
    button.querySelector('.complete-mark').hidden = !complete[index];
    button.setAttribute('aria-label', CHAPTERS[index] + (complete[index] ? '，已完成' : ''));
  }
  document.querySelectorAll('.saved').forEach((status) => {
    status.textContent = storageAvailable ? '已保存在当前浏览器' : '草稿保存失败，请先下载答案';
  });
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
  return `<fieldset><legend>${esc(legend)}</legend><div class="choice-stack">${values.map(([value, label]) =>
    `<label class="choice"><input type="radio" name="${key}" value="${esc(value)}"${selected(key, value)}><span>${esc(label)}</span></label>`
  ).join('')}</div></fieldset>`;
}

function scale(key, legend, low, high, optionalLabel) {
  const values = [1, 2, 3, 4, 5];
  return `<fieldset><legend>${esc(legend)}</legend><div class="scale-row">${values.map((value) =>
    `<label class="scale-option"><input type="radio" name="${key}" value="${value}" aria-label="${value}${value === 1 ? ' ' + esc(low) : value === 5 ? ' ' + esc(high) : ''}"${selected(key, value)}><span aria-hidden="true">${value}</span></label>`
  ).join('')}</div><div class="scale-endpoints" aria-hidden="true"><span>1 ${esc(low)}</span><span>5 ${esc(high)}</span></div>${optionalLabel ?
    `<label class="choice" style="margin-top:6px"><input type="radio" name="${key}" value="na"${selected(key, 'na')}><span>${esc(optionalLabel)}</span></label>` : ''}</fieldset>`;
}

function textField(key, legend, placeholder = '写一到两句话即可') {
  return `<label class="text-field"><span class="field-label">${esc(legend)}</span><textarea name="${key}" maxlength="600" placeholder="${esc(placeholder)}">${esc(draft.answers[key])}</textarea></label>`;
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
    + '</div><div class="action-row">' + button('继续视频呈现', 'chapter', 'primary', 'data-index="1"') + '</div>';
}

function firstView() {
  return participant === 'P02' || participant === 'P04' ? 'full' : 'mouth';
}

function videoDemo() {
  const clip = CLIPS[clipIndex];
  const order = firstView() === 'full' ? ['full', 'mouth'] : ['mouth', 'full'];
  const next = clipIndex === 0 ? 1 : 0;
  return panelTitle('互动演示', '切换视频呈现方式', '播放同一个片段的两种画面。也可以试试慢放或重播。')
    + `<div class="media-tools"><span>当前素材</span>
      ${CLIPS.map(({ label }, index) => button(label, 'clip', 'mini-button',
        `data-index="${index}" aria-pressed="${clipIndex === index}"`)).join('')}</div>`
    + `<div class="media-tools" aria-label="呈现方式">${order.map((key) => button(VIEWS[key], 'view', 'mini-button',
      `data-view="${key}" aria-pressed="${view === key}"`)).join('')}</div>`
    + media(clip.asset + '-' + view + '.mp4', clip.label + '，' + VIEWS[view]) + demoTools()
    + `<p class="source-note">这是原型学习模式中的短片。${next === 1 ? '评完片段一后，可以切换到片段二。' : ''}</p>`;
}

function videoQuestions() {
  const { id, label } = CLIPS[clipIndex];
  const order = firstView() === 'full' ? ['full', 'mouth'] : ['mouth', 'full'];
  const mediaRatings = order.map((key) => scale(id + '_' + key, '看「' + VIEWS[key] + '」时，你有多容易跟上动作？',
    '很难', '很容易', '无法判断')).join('');
  return questionTitle('视频呈现反馈', '看完两种画面后，分别为它们打分。', label + ' / 共两段')
    + '<div class="form-content">' + mediaRatings
    + options(id + '_preference', '如果用它学习或跟练，你更希望保留哪种画面？',
      [...order.map((key) => [key, VIEWS[key]]), ['both', '两种都可以'], ['neither', '两种都有困难']])
    + (clipIndex === 1 ? options('playback_priority', '如果原型只能优先保留一项观看功能，你会选什么？', PLAYBACK_PRIORITIES) : '')
    + '</div><div class="action-row">'
    + (clipIndex === 0 ? button('体验片段二', 'clip', 'primary', 'data-index="1"') :
      button('继续句子跟练', 'chapter', 'primary', 'data-index="2"'))
    + '</div>';
}


function ratingSet(group) {
  return EXTRA_RATINGS[group].map(([key, title, low, high]) => scale(key, title, low, high, '未体验或无法判断')).join('');
}

function lessonDemo() {
  return panelTitle('互动演示', '按自己的节奏练一句', '试着播放「明天见」，点一个字重看，再用慢放跟练。')
    + media('greeting.mp4', '明天见，句子跟练视频', 'greeting-poster.jpg')
    + '<div class="media-tools" aria-label="按字定位">' + LESSON_PARTS.map(({ label, pinyin }, index) =>
      button(label + '<small>' + pinyin + '</small>', 'lesson-part', 'character-button', 'data-index="' + index + '"')
    ).join('') + '</div>'
    + '<div class="media-tools">' + button('播放整句', 'lesson-whole', 'secondary') + '</div>' + demoTools()
    + '<p class="source-note">每个字的片段来自已有原型视频。点击单字后播放对应片段并暂停。</p>';
}

function lessonQuestions() {
  return questionTitle('跟练体验反馈', '体验整句播放、单字重看和慢放，再评价这些控制是否顺手。')
    + '<div class="form-content">' + ratingSet('lesson')
    + options('lesson_preference', '你更喜欢哪种练习方式？', LESSON_PREFERENCES)
    + '</div><div class="action-row">' + button('继续文字确认', 'chapter', 'primary', 'data-index="3"') + '</div>';
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
    + '</div><div class="action-row">' + button('继续阅读显示', 'chapter', 'primary', 'data-index="4"') + '</div>';
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
    + '</div><div class="action-row">' + button('继续歧义场景', 'chapter', 'primary', 'data-index="5"') + '</div>';
}

function prioritiesField() {
  const chosen = draft.answers.priorities ?? [];
  return '<fieldset><legend>如果后续优先打磨三项功能，你会选哪些？</legend><p class="microcopy">最多选三项，也可以选择暂时没有。</p><div class="choice-stack">'
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
    + scale('context_frequency', '在纯文字交流中，你多常遇到语气不好判断的情况？', '从未遇到', '经常遇到', '无法判断')
    + scale('context_need', '如果这类消息能附上说话者的表情和动作，你预期有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + options('context_priority', '遇到这种情形，你最想在原型里看到哪一种补充信息？', CONTEXT_PRIORITIES)
    + ratingSet('scenarios')
    + '</div><div class="action-row">' + button('继续总体评价', 'chapter', 'primary', 'data-index="6"') + '</div>';
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
    + options('mcs', '参加前，你对中文线索语有多熟悉？', [['none-used', '以前没接触过'], ['basics', '懂基本原理'], ['have-practised', '练习过或在使用']])
    + options('device', '这次主要用哪种设备体验？', DEVICES)
    + scale('satisfaction', '整体体验有多满意？', '很不满意', '很满意', '无法判断')
    + scale('reuse', '如果有类似需求，你有多愿意再用一次这个原型？', '很不愿意', '很愿意', '无法判断')
    + scale('learning', '如果你想学一句普通话对应的 MCS，你觉得有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + scale('communication', '和不会 MCS 的人确认一句简单消息时，你觉得有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + options('use_case', '你最可能在哪个场景用一次？', USE_CASES)
    + options('barrier', '如果考虑实际使用，最可能影响你使用的因素是什么？', BARRIERS)
    + prioritiesField()
    + textField('feedback1', '反馈一。' + first)
    + textField('feedback2', '反馈二。' + second)
    + `<div class="export-note"><strong>完成后保存答卷</strong><p>下载 CSV，再用团队约定的方式发送。中途也可以导出当前进度。</p></div></div>
    <div class="action-row">${button('下载答案 CSV', 'export')}<span class="saved" role="status"></span></div>`;
}

function renderMedia() {
  lessonEnd = null;
  demo.innerHTML = [exchangeDemo, videoDemo, lessonDemo, correctionDemo, readingDemo, contextDemo, feedbackDemo][chapter]();
  const video = demo.querySelector('video');
  if (video) video.playbackRate = playbackRate;
  if (video) {
    const section = chapter;
    video.addEventListener('play', () => recordAction('video-play-' + section));
  }
  if (video && chapter === 2) {
    video.addEventListener('timeupdate', () => {
      if (lessonEnd !== null && video.currentTime >= lessonEnd - 0.025) {
        video.pause();
        lessonEnd = null;
      }
    });
  }
  if (video && chapter === 1) {
    const key = CLIPS[clipIndex].id + '_' + view;
    video.addEventListener('play', () => {
      draft.played[key] = true;
      persist();
    }, { once: true });
  }
}

function render(focus = '') {
  $('#chapters').innerHTML = CHAPTERS.map((name, index) =>
    `<button type="button" class="chapter-button" data-action="chapter" data-index="${index}" ${chapter === index ? 'aria-current="step"' : ''}>
      ${name}<span class="complete-mark" aria-hidden="true" hidden>✓</span></button>`
  ).join('');
  renderMedia();
  questions.innerHTML = [exchangeQuestions, videoQuestions, lessonQuestions, correctionQuestions, readingQuestions, contextQuestions, feedbackQuestions][chapter]();
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

function exportRows() {
  const rows = [['版本', '参与编号', '部分', '指标', '条件', '评分（1–5）', '选择或反馈', '是否实际播放', '记录类型', '答案来源']];
  const append = (section, label, key, setting = '') => {
    const value = draft.answers[key] ?? '';
    const rating = /^[1-5]$/.test(value) && !key.startsWith('feedback');
    const display = Array.isArray(value) ? value.map((item) => LABELS[item] ?? item).join('；') : LABELS[value] ?? value;
    rows.push([VERSION, participant, section, label, setting, rating ? value : '',
      rating ? '' : display, draft.played[key] ? '是' : '', rating ? '主观评分' : '选择或反馈', (draft.importedKeys ?? []).includes(key) ? '沿用上一版答卷' : '当前版填写']);
  };
  append('对话体验', '操作容易度', 'exchange_ease', '预设双向对话');
  append('对话体验', '步骤清晰度', 'exchange_clarity', '预设双向对话');
  append('对话体验', '查找结果文字的容易度', 'exchange_confirm', '预设双向对话');
  append('对话体验', '优先改进需求', 'follow_up');
  for (const { id, label } of CLIPS) {
    for (const [key, display] of Object.entries(VIEWS)) append('视频呈现', '跟上动作的容易度', id + '_' + key, label + ' / ' + display);
    append('视频呈现', '呈现方式偏好', id + '_preference', label);
  }
  append('视频呈现', '优先观看功能', 'playback_priority');
  for (const [group, section] of [['lesson', '句子跟练'], ['correction', '文字确认'], ['reading', '阅读显示'], ['scenarios', '场景价值']]) {
    for (const [key, label] of EXTRA_RATINGS[group]) append(section, label, key, group === 'scenarios' ? '情境描述后的预期帮助' : '交互样例体验后');
  }
  append('句子跟练', '跟练方式偏好', 'lesson_preference');
  append('文字确认', '确认时机偏好', 'confirm_preference');
  append('阅读显示', '字号偏好', 'reading_preference');
  append('总体评价', '体验设备', 'device');
  append('总体评价', '使用障碍', 'barrier');
  append('总体评价', '优先打磨功能', 'priorities');
  append('歧义场景', '遇到歧义的频率', 'context_frequency');
  append('歧义场景', '表情和动作的预期帮助', 'context_need', '文字情境演示');
  append('歧义场景', '首选补充信息', 'context_priority');
  for (const [key, label] of [
    ['mcs', 'MCS 熟悉度'], ['satisfaction', '整体满意度'], ['reuse', '再次使用意愿'],
    ['learning', '感知的学习帮助'], ['communication', '感知的交流帮助'], ['use_case', '首选使用场景']
  ]) append('总体评价', label, key, '体验后');
  const [topic] = FEEDBACK[participant] ?? FEEDBACK.P01;
  append('定向反馈', '反馈一', 'feedback1', topic);
  append('定向反馈', '反馈二', 'feedback2', topic);
  const actionLabels = {
    'lesson-whole': '播放整句', 'lesson-part-0': '重看明', 'lesson-part-1': '重看天', 'lesson-part-2': '重看见',
    'confirm-text': '确认文字', 'reset-text': '重置文字样例',
    'reading-standard': '切换默认字号', 'reading-large': '切换大字'
  };
  CHAPTERS.forEach((name, index) => {
    actionLabels['video-play-' + index] = name + ' / 视频播放';
    actionLabels['replay-' + index] = name + ' / 重播';
    actionLabels['rate-' + index + '-1'] = name + ' / 正常播放';
    actionLabels['rate-' + index + '-0.65'] = name + ' / 慢放';
  });
  for (const [key, count] of Object.entries(draft.actions)) {
    rows.push([VERSION, participant, '操作记录', actionLabels[key] ?? key, '当前浏览器操作次数', '', count, '', '操作次数', '当前版操作']);
  }
  return rows;
}

function download() {
  const content = '\uFEFF' + exportRows().map((row) => row.map(csvCell).join(',')).join('\r\n');
  const file = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = file;
  anchor.download = 'qyutong-' + participant + '-answers.csv';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(file), 1500);
  $('#announcement').textContent = '已请求下载当前答卷 CSV';
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
  render();
});

questions.addEventListener('input', (event) => {
  const field = event.target;
  if (!field.name || (field.type === 'radio' && !field.checked)) return;
  if (field.name === 'priorities') {
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
    case 'chapter':
      goToChapter(Number(control.dataset.index));
      break;
    case 'stage':
      stage = Number(control.dataset.stage);
      renderMedia();
      demo.querySelector('[data-stage="' + stage + '"]')?.focus({ preventScroll: true });
      break;
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
  }
});

render();

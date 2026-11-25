const CHAPTERS = ['对话体验', '视频呈现', '歧义场景', '总体评价'];
const PARTICIPANTS = ['P00', 'P01', 'P02', 'P03', 'P04', 'P05'];
const VERSION = 'prototype-feedback-2';

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
const LABELS = Object.fromEntries([
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

function loadDraft() {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey()) || '{}');
    return { answers: {}, played: {}, ...raw };
  } catch {
    return { answers: {}, played: {} };
  }
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
    ['context_frequency', 'context_need', 'context_priority'],
    ['mcs', 'satisfaction', 'reuse', 'learning', 'communication', 'use_case', 'feedback1', 'feedback2']
  ];
}

function updateProgress() {
  const groups = requiredKeys();
  const complete = groups.map((keys) => count(keys) === keys.length);
  const total = complete.filter(Boolean).length;
  $('#progress').value = total;
  $('#progress-label').textContent = '完成 ' + total + ' / 4 部分';
  for (const button of $('#chapters').querySelectorAll('button')) {
    const index = Number(button.dataset.index);
    button.querySelector('.complete-mark').hidden = !complete[index];
    button.setAttribute('aria-label', CHAPTERS[index] + (complete[index] ? '，已完成' : ''));
  }
  const status = $('.saved');
  if (status) {
    status.textContent = storageAvailable ? '已保存在当前浏览器' : '此浏览器无法保存草稿，请先下载答案';
  }
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
      button('继续歧义场景', 'chapter', 'primary', 'data-index="2"'))
    + '</div>';
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
    + '</div><div class="action-row">' + button('继续总体评价', 'chapter', 'primary', 'data-index="3"') + '</div>';
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
    + scale('satisfaction', '整体体验有多满意？', '很不满意', '很满意', '无法判断')
    + scale('reuse', '如果有类似需求，你有多愿意再用一次这个原型？', '很不愿意', '很愿意', '无法判断')
    + scale('learning', '如果你想学一句普通话对应的 MCS，你觉得有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + scale('communication', '和不会 MCS 的人确认一句简单消息时，你觉得有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + options('use_case', '你最可能在哪个场景用一次？', USE_CASES)
    + textField('feedback1', '反馈一。' + first)
    + textField('feedback2', '反馈二。' + second)
    + `<div class="export-note"><strong>完成后保存答卷</strong><p>下载 CSV，再用团队约定的方式发送。中途也可以导出当前进度。</p></div></div>
    <div class="action-row">${button('下载答案 CSV', 'export')}<span class="saved" role="status"></span></div>`;
}

function renderMedia() {
  demo.innerHTML = [exchangeDemo, videoDemo, contextDemo, feedbackDemo][chapter]();
  const video = demo.querySelector('video');
  if (video) video.playbackRate = playbackRate;
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
  questions.innerHTML = [exchangeQuestions, videoQuestions, contextQuestions, feedbackQuestions][chapter]();
  updateProgress();
  if (focus) $(focus)?.focus({ preventScroll: true });
}

function goToChapter(index) {
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
  const rows = [['版本', '参与编号', '部分', '指标', '条件', '评分（1–5）', '选择或反馈', '是否实际播放']];
  const append = (section, label, key, setting = '') => {
    const value = draft.answers[key] ?? '';
    const rating = /^[1-5]$/.test(value) && !key.startsWith('feedback');
    rows.push([VERSION, participant, section, label, setting, rating ? value : '',
      rating ? '' : LABELS[value] ?? value, draft.played[key] ? '是' : '']);
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
  render();
});

questions.addEventListener('input', (event) => {
  const field = event.target;
  if (!field.name || (field.type === 'radio' && !field.checked)) return;
  draft.answers[field.name] = field.value;
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
      playbackRate = Number(control.dataset.rate);
      demo.querySelector('video').playbackRate = playbackRate;
      demo.querySelectorAll('[data-rate]').forEach((item) => {
        item.setAttribute('aria-pressed', String(Number(item.dataset.rate) === playbackRate));
      });
      break;
    case 'replay': {
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
    case 'export':
      download();
      break;
  }
});

render();

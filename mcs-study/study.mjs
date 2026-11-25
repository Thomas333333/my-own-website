const CHAPTERS = ['对话体验', '语境判断', '音节辨认', '满意度与反馈'];
const PARTICIPANTS = ['P00', 'P01', 'P02', 'P03', 'P04', 'P05'];
const VERSION = 'remote-pilot-1';

const CONTEXTS = [
  { id: 'c01', quote: '你真准时。', scene: '朋友在约定的时间到达，大家正准备出发。', expected: 'sincere' },
  { id: 'c02', quote: '你回得真快。', scene: '同事等了一整天才收到这条紧急消息的回复。', expected: 'ironic' },
  { id: 'c03', quote: '你想得真周到。', scene: '出门时下起雨，同行的人正好替大家带了伞。', expected: 'sincere' },
  { id: 'c04', quote: '这地方真好找。', scene: '店门口没有标识，朋友绕了几条街才找到入口。', expected: 'ironic' },
  { id: 'c05', quote: '你准备得真充分。', scene: '开会前，同伴把展示资料、转接头和备份文件都准备好了。', expected: 'sincere' },
  { id: 'c06', quote: '这个办法真省事。', scene: '本来只要填一张表，新流程增加了好几个重复步骤。', expected: 'ironic' }
];

const SYLLABLES = [
  { id: 's01', pair: ['kuai', 'huai'], expected: 'kuai', base: 'mouth' },
  { id: 's02', pair: ['kuai', 'huai'], expected: 'huai', base: 'full' },
  { id: 's03', pair: ['kuang', 'huang'], expected: 'kuang', base: 'full' },
  { id: 's04', pair: ['kuang', 'huang'], expected: 'huang', base: 'mouth' },
  { id: 's05', pair: ['zhuai', 'shuai'], expected: 'zhuai', base: 'mouth' },
  { id: 's06', pair: ['zhuai', 'shuai'], expected: 'shuai', base: 'full' },
  { id: 's07', pair: ['zhuang', 'shuang'], expected: 'zhuang', base: 'full' },
  { id: 's08', pair: ['zhuang', 'shuang'], expected: 'shuang', base: 'mouth' }
];
const ORDER = [0, 5, 2, 7, 4, 1, 6, 3];

const INTENTS = [
  ['sincere', '真心称赞'], ['ironic', '说反话'], ['unsure', '无法判断']
];
const SCENARIOS = [
  ['learn', '学习或跟练'], ['conversation', '日常短句交流'], ['video', '辅助看视频'],
  ['none', '暂时没有合适场景'], ['other', '其他']
];
const FEEDBACK = {
  P01: ['语气与歧义', '哪一句你最拿不准？当时依据了什么？', '如果能多提供一种线索，你最希望看到什么？为什么？'],
  P02: ['手形、口型与播放', '哪个音节最难分辨？你没看清哪里？', '如果只能调整一个播放选项，你希望怎么调？'],
  P03: ['真实使用场景', '想到一次真实的沟通困难，你当时是怎么处理的？', '在那次经历里，你愿意在哪一步用这个原型，或者会继续用原来的方式？为什么？'],
  P04: ['结果确认与纠错', '哪一步让你最不确定系统显示了什么，或对方会收到什么？', '如果文字有误，你希望在哪里纠正，又怎么确认修改成功？'],
  P05: ['第一次上手', '打开页面时你会先做什么？哪个地方最需要提示？', '如果分享给没接触过 MCS 的朋友，你会在什么位置加哪一句说明？']
};
const LABELS = Object.fromEntries([
  ...INTENTS, ...SCENARIOS, ['tomorrow', '明天'], ['today', '今天'], ['no-time', '没有提到时间'],
  ['pickup', '接对方'], ['text-next', '再发一条消息'], ['cancel', '取消见面'],
  ['none-used', '以前没接触过'], ['basics', '懂基本原理'], ['have-practised', '练习过或在使用'],
  ['annotated', '预先标注的样例'], ['live', '对新视频的现场识别']
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
let scenarioIndex = draft.scenarioIndex ?? 0;
let syllableIndex = draft.syllableIndex ?? 0;
let stage = 0;
let playbackRate = 1;

function loadDraft() {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey()) || '{}');
    return { answers: {}, revealed: {}, ...raw };
  } catch {
    return { answers: {}, revealed: {} };
  }
}

function storageKey() {
  return 'qyutong-study:' + VERSION + ':' + participant;
}

function persist() {
  try {
    localStorage.setItem(storageKey(), JSON.stringify({ ...draft, chapter, scenarioIndex, syllableIndex }));
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
    ['exchange_ease', 'exchange_time', 'exchange_action', 'exchange_source'],
    CONTEXTS.flatMap(({ id }) => [id + '_before', id + '_after']),
    SYLLABLES.flatMap(({ id }) => [id + '_choice', id + '_confidence']),
    ['mcs', 'satisfaction', 'clarity', 'learning', 'communication', 'use_case', 'feedback1', 'feedback2']
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

function options(key, legend, values, { locked = false } = {}) {
  return `<fieldset${locked ? ' disabled' : ''}><legend>${esc(legend)}</legend><div class="choice-stack">${values.map(([value, label]) =>
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
  return questionTitle('对话体验问卷', '体验三个步骤后，根据你看到的内容回答。')
    + '<div class="form-content">'
    + options('exchange_time', '对方说什么时候来？', [['today', '今天'], ['tomorrow', '明天'], ['no-time', '没有提到时间'], ['unsure', '不确定']])
    + options('exchange_action', '对方说要做什么？', [['pickup', '过来接我'], ['text-next', '再发一条消息'], ['cancel', '取消见面'], ['unsure', '不确定']])
    + options('exchange_source', '示例回复的文字来自哪里？', [['annotated', '预先标注的样例'], ['live', '对新视频的现场识别'], ['unsure', '不确定']])
    + scale('exchange_ease', '走完这次对话有多容易？', '很难', '很容易')
    + '</div><div class="action-row">' + button('继续语境判断', 'chapter', 'primary', 'data-index="1"') + '</div>';
}

function contextDemo() {
  const scenario = CONTEXTS[scenarioIndex];
  const revealed = draft.revealed[scenario.id];
  return panelTitle('语境练习', '同一句话，不同语境', '先读一句话作判断，再看补充背景。')
    + `<div class="media-stage media-text" aria-label="对白"><p class="subtitle">${scenario.quote}</p></div>`
    + (revealed ? `<div class="context-card"><strong>补充背景</strong><p>${scenario.scene}</p></div>`
      : '<p class="source-note">先完成右侧第一问，即可查看这一句的情境。</p>');
}

function contextQuestions() {
  const scenario = CONTEXTS[scenarioIndex];
  const { id } = scenario;
  const revealed = draft.revealed[id];
  const before = options(id + '_before', '只看这句话，你怎么理解对方的意思？', INTENTS, { locked: revealed });
  const after = revealed ? options(id + '_after', '读完背景后，你现在怎么理解这句话？', INTENTS)
    + scale(id + '_confidence', '你对现在的判断有多大把握？', '很没把握', '很有把握') : '';
  return questionTitle('语境判断问卷', '根据自己看到的信息选择。可以回答「无法判断」。', (scenarioIndex + 1) + ' / ' + CONTEXTS.length)
    + '<div class="form-content">' + before + after + '</div><div class="action-row">'
    + (revealed ? trialNav('context', scenarioIndex, CONTEXTS.length, 2) :
      button('查看背景', 'reveal', 'primary', has(id + '_before') ? '' : 'id="reveal" disabled')
      + trialNav('context', scenarioIndex, CONTEXTS.length, 2, true))
    + '</div>';
}

function syllable() {
  const index = ORDER[syllableIndex];
  return SYLLABLES[index];
}

function condition(item) {
  const flip = participant === 'P02' || participant === 'P04';
  return flip ? (item.base === 'full' ? 'mouth' : 'full') : item.base;
}

function syllableDemo() {
  const item = syllable();
  return panelTitle('音节练习', '看看口型和手形', '每题播放一条短片，试着判断是哪一个音节。')
    + media(item.id + '-' + condition(item) + '.mp4', '音节辨认片段 ' + (syllableIndex + 1))
    + '<p class="source-note">所有片段均为静音，可以重看。模糊时可以选「不确定」。</p>'
    + `<div class="context-card"><strong>可随时查看的手形提示</strong>
      <div class="example-pair">${[[2, 'k'], [3, 'h'], [1, 'zh'], [8, 'sh']].map(([index, label]) =>
        `<figure><img alt="声母 ${label} 的手形示意" src="assets/hand-${index}.png"><figcaption>${label}</figcaption></figure>`
      ).join('')}</div></div>`;
}

function trialNav(prefix, index, length, nextChapter, skipping = false) {
  const last = index === length - 1;
  const prev = index > 0 ? button('上一题', prefix, 'secondary', 'data-delta="-1"') : '';
  const next = button(last ? '进入下一部分' : skipping ? '跳到下一题' : '下一题',
    last ? 'chapter' : prefix, skipping ? 'secondary' : 'primary',
    last ? 'data-index="' + nextChapter + '"' : 'data-delta="1"');
  return prev + next;
}

function syllableQuestions() {
  const { id, pair } = syllable();
  return questionTitle('音节辨认问卷', '请选你看到的音节，然后给自己的判断打分。', (syllableIndex + 1) + ' / ' + SYLLABLES.length)
    + '<div class="form-content">'
    + options(id + '_choice', '你看到的是哪个音节？', [...pair.map((value) => [value, value]), ['unsure', '不确定']])
    + scale(id + '_confidence', '你对这个判断有多大把握？', '很没把握', '很有把握')
    + '</div><div class="action-row">' + trialNav('syllable', syllableIndex, SYLLABLES.length, 3) + '</div>';
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
    + scale('clarity', '你觉得对话流程有多清楚？', '很不清楚', '很清楚', '无法判断')
    + scale('learning', '如果你想学一句普通话对应的 MCS，你觉得有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + scale('communication', '和不会 MCS 的人确认一句简单消息时，你觉得有多大帮助？', '没帮助', '很有帮助', '无法判断')
    + options('use_case', '你最可能在哪个场景用一次？', SCENARIOS)
    + textField('feedback1', '反馈一。' + first)
    + textField('feedback2', '反馈二。' + second)
    + `<div class="export-note"><strong>完成后保存答卷</strong><p>下载 CSV，再用团队约定的方式发送。中途也可以导出当前进度。</p></div></div>
    <div class="action-row">${button('下载答案 CSV', 'export')}<span class="saved" role="status"></span></div>`;
}

function renderMedia() {
  demo.innerHTML = [exchangeDemo, contextDemo, syllableDemo, feedbackDemo][chapter]();
  const video = demo.querySelector('video');
  if (video && (chapter === 0 || chapter === 3)) video.playbackRate = playbackRate;
}

function render(focus = '') {
  $('#chapters').innerHTML = CHAPTERS.map((name, index) =>
    `<button type="button" class="chapter-button" data-action="chapter" data-index="${index}" ${chapter === index ? 'aria-current="step"' : ''}>
      ${name}<span class="complete-mark" aria-hidden="true" hidden>✓</span></button>`
  ).join('');
  renderMedia();
  questions.innerHTML = [exchangeQuestions, contextQuestions, syllableQuestions, feedbackQuestions][chapter]();
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
  const columns = ['版本', '参与编号', '部分', '题目', '条件', '回答', '参考答案', '结果', '把握程度'];
  const rows = [columns];
  const append = (section, item, setting, key, expected = '', confidenceKey = '') => {
    const value = draft.answers[key] ?? '';
    const result = expected && value ? (value === 'unsure' ? '不确定' : value === expected ? '一致' : '不一致') : '';
    rows.push([VERSION, participant, section, item, setting, LABELS[value] ?? value, LABELS[expected] ?? expected, result, draft.answers[confidenceKey] ?? '']);
  };
  append('对话体验', '时间信息', '预设双向对话', 'exchange_time', 'tomorrow');
  append('对话体验', '行动信息', '预设双向对话', 'exchange_action', 'pickup');
  append('对话体验', '文字来源', '预设双向对话', 'exchange_source', 'annotated');
  append('对话体验', '流程容易度', '预设双向对话', 'exchange_ease');
  for (const { id, quote, expected } of CONTEXTS) {
    append('语境判断', id + ' ' + quote, '仅对白', id + '_before');
    append('语境判断', id + ' ' + quote, '对白与文字背景', id + '_after', expected, id + '_confidence');
  }
  for (const item of SYLLABLES) {
    append('音节辨认', item.id, condition(item) === 'full' ? '口型与手形' : '仅口型',
      item.id + '_choice', item.expected, item.id + '_confidence');
  }
  for (const [key, label] of [
    ['mcs', 'MCS 熟悉度'], ['satisfaction', '整体满意度'], ['clarity', '流程清晰度'],
    ['learning', '学习帮助'], ['communication', '交流帮助'], ['use_case', '首选使用场景']
  ]) append('满意度', label, '体验后', key);
  const [topic] = FEEDBACK[participant] ?? FEEDBACK.P01;
  append('定向反馈', '反馈一', topic, 'feedback1');
  append('定向反馈', '反馈二', topic, 'feedback2');
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
  scenarioIndex = draft.scenarioIndex ?? 0;
  syllableIndex = draft.syllableIndex ?? 0;
  stage = 0;
  playbackRate = 1;
  render();
});

questions.addEventListener('input', (event) => {
  const field = event.target;
  if (!field.name || (field.type === 'radio' && !field.checked)) return;
  draft.answers[field.name] = field.value;
  persist();
  if (field.name === CONTEXTS[scenarioIndex].id + '_before') {
    const reveal = questions.querySelector('[data-action="reveal"]');
    if (reveal) reveal.disabled = false;
  }
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
    case 'reveal': {
      const id = CONTEXTS[scenarioIndex].id;
      if (!has(id + '_before')) return;
      draft.revealed[id] = true;
      persist();
      render('[name="' + id + '_after"]');
      if (matchMedia('(max-width: 720px)').matches) demo.querySelector('.context-card')?.scrollIntoView({ block: 'center' });
      $('#announcement').textContent = '已显示补充背景';
      break;
    }
    case 'context':
      scenarioIndex += Number(control.dataset.delta);
      persist();
      render('#demo-title');
      if (matchMedia('(max-width: 720px)').matches) demo.scrollIntoView({ block: 'start' });
      break;
    case 'syllable':
      syllableIndex += Number(control.dataset.delta);
      persist();
      render('#demo-title');
      if (matchMedia('(max-width: 720px)').matches) demo.scrollIntoView({ block: 'start' });
      break;
    case 'export':
      download();
      break;
  }
});

render();

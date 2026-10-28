'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const translations = {
  en: {
    skip:'Skip to content', brandSub:'MANDARIN CUED SPEECH · HKUST(GZ)', navDemo:'Try it', navTeam:'Team',
    heroTitle:'Read the words.<br><em>What is missing?</em>', heroDesc:'Text conveys the message. Mouth movements, hand cues and tone carry more.', heroLink:'Why Cued Speech?', heroNote:'Switch views to compare the same sentence.',
    sameSentence:'ONE SENTENCE / THREE VIEWS', textView:'Text captions', mouthView:'Mouth only', captionKicker:'CAPTION', silent:'Sound off', playClip:'Play clip', pauseClip:'Pause clip', comparisonNote:'Different views of one recording, not a recognition accuracy test.',
    textGain:'You know what was said.', textLimit:'The words alone do not show how it was pronounced or spoken.',
    mouthGain:'You can see the mouth movements.', mouthLimit:'Similar-looking mouth movements can represent different speech sounds.',
    cuedGain:'Mouth + hand shape + hand position.', cuedLimit:'Hand cues help distinguish speech sounds. Understanding them takes learning.',
    whyTitle:'Beyond the message: access to speech sounds.', whyDesc:'Two scenes from our poster: feeling the tone in a film, and learning Mandarin pronunciation.',
    captionTitle:'Captions / ASR', captionBenefit:'Read what someone says.', captionLimit:'Plain text does not automatically retain vocal tone and rhythm.',
    lipTitle:'Lipreading', lipBenefit:'See the mouth movements of speech.', lipLimit:'Similar mouth shapes can stand for different sounds.',
    signTitle:'Sign languages', signBenefit:'Express meaning and emotion fully, with their own grammar.', signLimit:'Not designed to map Mandarin pronunciation syllable by syllable.',
    cuedBenefit:'Mouth movements and hand cues distinguish speech sounds.', cuedLimit:'Adds visible pronunciation cues; requires learning.',
    researchBridge:'Our goal: translate both ways between Mandarin and MCS, while preserving prosody, rhythm and audiovisual timing.', comparisonScope:'Different purposes, not a ranking of languages. Captions can also describe sounds and emotions.',
    conversationTitle:'A conversation, both ways.', conversationDesc:'Text → Cued Speech → text and speech.', preset:'Preset dialogue · Meeting tomorrow', restart:'Reset', stepSend:'Send text', stepSee:'Get a reply', stepHear:'Hear it', demoNote:'Prepared prototype output and an annotated sample; no live recognition on this page.',
    speakerA:'YOUR MESSAGE', draftHint:'Send this message as a Cued Speech video.', sendAction:'View Cued Speech →', sendStatus:'Text → MCS', greetingLabel:'Prototype output · Recorded clips', greetingText:'See you tomorrow.', replyAction:'See the reply →', replyStatus:'MCS → text / speech', replyLabel:'Recorded reply · MCCSD LF-0029', replyText:'I’ll come and pick you up tomorrow.', speakAction:'Reveal & speak →', completeStatus:'Round trip complete', againAction:'Try again ↺', voiceResult:'Annotated text · Synthesized speech', silenceHint:'Silent video', replyHint:'Continue to reveal the text and hear the synthesized voice.',
    exploreTitle:'Making it more natural.', voiceTab:'Expressive speech', motionTab:'Transitions', alignmentTab:'Audiovisual timing',
    voiceTitle:'Same words. Different delivery.', voiceDesc:'“我明天过来接你。” Compare the human recording with our current synthesized voice.', voiceOriginal:'Human recording', voiceOriginalSmall:'Original audio', voiceBaseline:'Current synthesis', voiceBaselineSmall:'Neutral baseline', voiceNext:'Expressive synthesis is still in development. This comparison shows the current gap.',
    motionTitle:'Watch between syllables.', motionDesc:'Play “明天见” at normal or slower speed to inspect the transitions.', motionNext:'Current clip composition. Slow playback is for observation, not motion smoothing.', normalSpeed:'Normal · 1×', slowSpeed:'Slow · 0.6×',
    alignmentTitle:'A small delay makes a difference.', alignmentDesc:'Compare the original recording with audio delayed by 0.75 seconds.', alignmentNext:'The delay is deliberately added for comparison; it is not a model result.', originalTiming:'Original', delayedTiming:'Audio +0.75 s',
    teamTitle:'The team', voiceRole:'Prosody & speech', videoRole:'Video generation', motionRole:'Motion transitions', alignmentRole:'Alignment & safety', academic:'Academic Supervisor',
    statusTitle:'Progress & sources', statusCurrent:'Full prototype: bidirectional workflow, clip composition, sample matching and basic quality checks.', statusNext:'Expressive synthesis, motion interpolation and watermarking are in development. General real-time recognition is not yet implemented.', sourceLink:'Video and annotation: public MCCSD sample ↗', privacy:'No recording · No visitor tracking', backTop:'Back to top ↑', previewNotice:'Tap the player to start playback.', mediaError:'Media could not load. Please check your connection and try again.'
  },
  zh: {
    textGain:'读懂了内容。', textLimit:'仅凭这行字，看不到发音动作，也听不到原声语气。',
    mouthGain:'看到了口部动作。', mouthLimit:'但相似的口型，可能对应不同的语音。',
    cuedGain:'口型 + 手形 + 位置。', cuedLimit:'手部线索帮助区分语音；理解这些线索需要学习。',
    playClip:'播放片段', pauseClip:'暂停片段', speakerA:'你发出的消息', draftHint:'将这句话转换为 Cued Speech 视频。', sendAction:'查看 Cued Speech →', sendStatus:'文字 → MCS', greetingLabel:'原型结果 · 录制素材编排', greetingText:'See you tomorrow.', replyAction:'查看对方回应 →', replyStatus:'MCS → 文字 / 语音', replyLabel:'真人回应 · MCCSD LF-0029', replyText:'I’ll come and pick you up tomorrow.', speakAction:'查看文字并播报 →', completeStatus:'完成一次来回', againAction:'再体验一次 ↺', voiceResult:'样例标注文字 · 合成语音', silenceHint:'静音视频', replyHint:'继续查看文字，并听到合成语音。',
    voiceTitle:'同一句话，语气不一样。', voiceDesc:'“我明天过来接你。”听听真人录音与当前合成语音的差别。', voiceOriginal:'真人录音', voiceOriginalSmall:'视频原声', voiceBaseline:'当前合成', voiceBaselineSmall:'中性基础版本', voiceNext:'情感合成仍在开发。这里展示的是当前差距。',
    motionTitle:'留意音节之间。', motionDesc:'正常或慢速播放“明天见”，观察动作衔接。', motionNext:'当前素材拼接结果。慢放用于观察，不代表已实现动作平滑。', normalSpeed:'正常 · 1×', slowSpeed:'慢速 · 0.6×',
    alignmentTitle:'差一点时间，也很明显。', alignmentDesc:'比较原始视频与声音延后 0.75 秒的版本。', alignmentNext:'延迟为人为设置的对照，不是模型结果。', originalTiming:'原始音画', delayedTiming:'声音 +0.75 秒',
    voiceRole:'韵律与语音', videoRole:'视频生成', motionRole:'动作衔接', alignmentRole:'对齐与安全', academic:'Academic Supervisor', previewNotice:'请点击播放器开始播放。', mediaError:'媒体加载失败，请检查网络后重试。'
  }
};
$$('[data-i18n]').forEach(el => { translations.zh[el.dataset.i18n] = el.textContent; });
$$('[data-i18n-html]').forEach(el => { translations.zh[el.dataset.i18nHtml] = el.innerHTML; });
let lang = 'zh', view = 'text', stage = 0, experiment = 'voice', toastTimer;
const t = key => translations[lang][key] || translations.zh[key] || key;
function notice(key) {
  const el = $('#media-notice'); el.textContent = t(key); el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 5000);
}
function pauseAll(except) { $$('video,audio').forEach(m => { if (m !== except) m.pause(); }); }
function play(media) {
  if (!media) return;
  pauseAll(media);
  const promise = media.play();
  if (promise) promise.catch(() => notice('previewNotice'));
}
document.addEventListener('play', e => { if (e.target.matches('video,audio')) pauseAll(e.target); }, true);
document.addEventListener('error', e => { if (e.target.matches('video,audio')) notice('mediaError'); }, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });

function updateCompareButton() { $('#comparison-play').textContent = t($('#comparison-video').paused ? 'playClip' : 'pauseClip'); }
function renderComparison() {
  const video = $('#comparison-video'); video.pause();
  $$('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  $('#comparison-count').textContent = `0${['text','mouth','cued'].indexOf(view) + 1} / 03`;
  $('#caption-view').hidden = view !== 'text';
  video.hidden = view === 'text';
  $('#comparison-play').hidden = view === 'text';
  $('#silent-label').hidden = view === 'text';
  $('#comparison-stage').classList.toggle('mouth-view', view === 'mouth');
  $('#comparison-gain').textContent = t(view + 'Gain');
  $('#comparison-limit').textContent = t(view + 'Limit');
  updateCompareButton();
}
$$('[data-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; renderComparison(); }));
$('#comparison-play').addEventListener('click', () => {
  const video = $('#comparison-video');
  if (!video.paused) { video.pause(); return; }
  // Attach the media URL only after an explicit play gesture; scanning downloads no videos.
  if (!video.getAttribute('src')) video.src = 'assets/reply.mp4';
  if (video.ended) video.currentTime = 0;
  play(video);
});
['play','pause','ended'].forEach(event => $('#comparison-video').addEventListener(event, updateCompareButton));

function renderConversation(auto = false) {
  pauseAll();
  const box = $('#conversation-stage');
  const progress = stage < 2 ? 0 : stage === 2 ? 1 : 2;
  $$('[data-flow]').forEach(li => li.classList.toggle('active', Number(li.dataset.flow) <= progress));
  if (stage === 0) box.innerHTML = `<div class="message-composer"><span class="speaker-label">${t('speakerA')}</span><div class="draft-bubble"><strong>明天见。</strong><p>See you tomorrow.</p></div><p class="stage-hint">${t('draftHint')}</p></div>`;
  if (stage === 1) box.innerHTML = `<span class="stage-label">${t('greetingLabel')}</span><video class="stage-video" src="assets/greeting.mp4" poster="assets/greeting-poster.jpg" controls muted playsinline preload="none" aria-label="明天见"></video><p class="transcript">明天见。</p><p class="stage-translation">${t('greetingText')}</p><p class="stage-hint">${t('silenceHint')}</p>`;
  if (stage === 2) box.innerHTML = `<span class="stage-label">${t('replyLabel')}</span><video class="stage-video" src="assets/reply.mp4" poster="assets/reply-poster.jpg" controls muted playsinline preload="none" aria-label="Cued Speech reply"></video><p class="stage-hint">${t('replyHint')}</p>`;
  if (stage === 3) box.innerHTML = `<div class="audio-result"><span class="complete-mark" aria-hidden="true">✓</span><span class="speaker-label">${t('voiceResult')}</span><p class="transcript">我明天过来接你。</p><p class="stage-translation">${t('replyText')}</p><audio src="assets/reply-voice.m4a" controls preload="none" aria-label="我明天过来接你 · Synthesized speech"></audio></div>`;
  $('#conversation-status').textContent = t(stage < 2 ? 'sendStatus' : stage === 2 ? 'replyStatus' : 'completeStatus');
  $('#conversation-next').textContent = t(['sendAction','replyAction','speakAction','againAction'][stage]);
  if (auto && stage > 0) play($('video,audio', box));
}
$('#conversation-next').addEventListener('click', () => { stage = (stage + 1) % 4; renderConversation(true); });
$('#reset-conversation').addEventListener('click', () => { stage = 0; renderConversation(); });

function renderExperiment() {
  const box = $('#experiment-content');
  $$('video,audio', box).forEach(m => m.pause());
  $$('[data-experiment]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.experiment === experiment)));
  const copy = prefix => `<div class="experiment-copy"><h3>${t(prefix + 'Title')}</h3><p>${t(prefix + 'Desc')}</p><p class="research-note">${t(prefix + 'Next')}</p></div>`;
  if (experiment === 'voice') {
    box.innerHTML = copy('voice') + `<div class="voice-options"><div class="voice-option"><div><strong>${t('voiceOriginal')}</strong><span>${t('voiceOriginalSmall')}</span></div><audio src="assets/reply-original.m4a" controls preload="none" aria-label="${t('voiceOriginal')}"></audio></div><div class="voice-option"><div><strong>${t('voiceBaseline')}</strong><span>${t('voiceBaselineSmall')}</span></div><audio src="assets/reply-voice.m4a" controls preload="none" aria-label="${t('voiceBaseline')}"></audio></div></div>`;
  } else if (experiment === 'motion') {
    box.innerHTML = copy('motion') + `<div class="experiment-media"><video id="motion-video" src="assets/greeting.mp4" poster="assets/greeting-poster.jpg" controls muted playsinline preload="none" aria-label="明天见 · Motion transitions"></video><div class="segmented" role="group" aria-label="Playback speed"><button data-speed="1" aria-pressed="true">${t('normalSpeed')}</button><button data-speed="0.6" aria-pressed="false">${t('slowSpeed')}</button></div></div>`;
    $$('[data-speed]', box).forEach(b => b.addEventListener('click', () => {
      const v = $('#motion-video'); v.playbackRate = Number(b.dataset.speed);
      $$('[data-speed]', box).forEach(x => x.setAttribute('aria-pressed', String(x === b))); play(v);
    }));
  } else {
    box.innerHTML = copy('alignment') + `<div class="experiment-media"><video id="alignment-video" src="assets/reply.mp4" poster="assets/reply-poster.jpg" controls playsinline preload="none" aria-label="Audiovisual timing"></video><div class="segmented" role="group" aria-label="Audio timing"><button data-timing="original" aria-pressed="true">${t('originalTiming')}</button><button data-timing="delayed" aria-pressed="false">${t('delayedTiming')}</button></div></div>`;
    $$('[data-timing]', box).forEach(b => b.addEventListener('click', () => {
      const v = $('#alignment-video'); v.pause();
      v.src = b.dataset.timing === 'original' ? 'assets/reply.mp4' : 'assets/reply-delayed.mp4';
      $$('[data-timing]', box).forEach(x => x.setAttribute('aria-pressed', String(x === b))); play(v);
    }));
  }
}
$$('[data-experiment]').forEach(b => b.addEventListener('click', () => { experiment = b.dataset.experiment; renderExperiment(); }));
const members = [
  {name:'Jiangshan He', image:'jiangshan-he', role:'voiceRole', supervisor:'Zixin Zhong'},
  {name:'Yihua Du', image:'yihua-du', role:'videoRole', supervisor:'Yingcong Chen'},
  {name:'Xinya Lu', image:'xinya-lu', role:'motionRole', supervisor:'Zhiming Hu'},
  {name:'Xiaoyang Feng', image:'xiaoyang-feng', role:'alignmentRole', supervisor:'Li Liu'}
];
function renderTeam() {
  $('#team-grid').innerHTML = members.map(m => `<article class="member"><img src="assets/${m.image}.jpg" alt="${m.name}" loading="lazy" width="320" height="336"><h3>${m.name}</h3><p>${t(m.role)}</p><small>${t('academic')}<br>${m.supervisor}</small></article>`).join('');
}
function setLanguage(next) {
  lang = next; document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = lang === 'zh' ? 'Cued Speech · 中文线索语' : 'Cued Speech · Mandarin';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $('#language').textContent = lang === 'zh' ? 'EN' : '中文';
  $('#language').setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
  renderComparison(); renderConversation(); renderExperiment(); renderTeam();
}
$('#language').addEventListener('click', () => setLanguage(lang === 'zh' ? 'en' : 'zh'));
setLanguage(lang);

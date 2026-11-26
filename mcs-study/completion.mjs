export const COMPLETION_RULE = 'completion-1';
export const FEEDBACK_MIN_LENGTH = 20;
export const FEEDBACK_KEYS = ['feedback1', 'feedback2'];
export const ANSWER_GROUPS = [
  ['mcs','device','communication_modes','need_lips','need_practice','need_repair','context_frequency','current_support','biggest_gap'],
  ['intro_clarity'],
  ['exchange_ease','exchange_clarity','exchange_confirm','follow_up'],
  ['clip1_mouth','clip1_full','clip1_preference','clip2_mouth','clip2_full','clip2_preference','playback_priority'],
  ['lesson_start','lesson_pace','lesson_locate','lesson_independent','pace_normal_detail','pace_slow_detail','pace_normal_natural','pace_slow_natural','lesson_preference','pace_preference'],
  ['correction_find','correction_control','correction_status','correction_comfort','confirm_preference'],
  ['reading_standard','reading_large','reading_status','reading_preference'],
  ['context_need','context_priority','scenario_practice','scenario_meeting','scenario_service'],
  ['satisfaction','reuse','learning','communication','learning_interest','difficulty_reasons','use_case','barrier','priorities','feedback1','feedback2','quote_permission']
];
export const REQUIRED_VIDEOS = [
  {key:'intro_example',label:'入门示例：明天见',chapter:1,playedKeys:['intro_example']},
  {key:'exchange_sent',label:'对话第一步：发出文字的视频',chapter:2,stage:0,playedKeys:['exchange_sent']},
  {key:'exchange_reply',label:'对话第二步：收到回应的视频',chapter:2,stage:1,playedKeys:['exchange_reply']},
  {key:'clip1_mouth',label:'片段一：口型特写',chapter:3,clipIndex:0,view:'mouth',playedKeys:['clip1_mouth']},
  {key:'clip1_full',label:'片段一：完整手口画面',chapter:3,clipIndex:0,view:'full',playedKeys:['clip1_full']},
  {key:'clip2_mouth',label:'片段二：口型特写',chapter:3,clipIndex:1,view:'mouth',playedKeys:['clip2_mouth']},
  {key:'clip2_full',label:'片段二：完整手口画面',chapter:3,clipIndex:1,view:'full',playedKeys:['clip2_full']},
  {key:'pace_normal',label:'句子跟练：正常速度 1×',chapter:4,rate:1,playedKeys:['pace_normal_detail','pace_normal_natural']},
  {key:'pace_slow',label:'句子跟练：慢放 0.65×',chapter:4,rate:0.65,playedKeys:['pace_slow_detail','pace_slow_natural']}
];
export function feedbackLength(value) {
  return (String(value ?? '').match(/[\p{L}\p{N}]/gu) ?? []).length;
}
export function answerComplete(key,value) {
  if(FEEDBACK_KEYS.includes(key)) return feedbackLength(value)>=FEEDBACK_MIN_LENGTH;
  if(Array.isArray(value)) return value.length>0 && value.every(item=>typeof item==='string' && item.trim()!=='');
  return typeof value==='string' && value.trim()!=='';
}
export function videoPlayed(item,played={}) {return item.playedKeys.every(key=>played[key]===true);}
export function checkCompletion(pid,answers={},played={}) {
  const missingAnswers=ANSWER_GROUPS.flatMap((keys,chapter)=>keys.filter(key=>!answerComplete(key,answers[key])).map(key=>({key,chapter})));
  const missingVideos=REQUIRED_VIDEOS.filter(item=>!videoPlayed(item,played));
  const formalId=/^P(?:0[1-9]|1[0-5])$/.test(pid);
  return {formalId,missingAnswers,missingVideos,ready:formalId&&!missingAnswers.length&&!missingVideos.length};
}

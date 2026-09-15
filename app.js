const totalSeconds = 60 * 60;
const affirmations = {
  start: [
    { tag: 'Start', title: 'You are already enough.', text: 'You do not need to be perfect to be worthy of care, rest, and joy.' },
    { tag: 'Start', title: 'The beginning counts.', text: 'A gentle start is not a delay. It is the beginning of steady care.' },
    { tag: 'Start', title: 'You are allowed to soften.', text: 'You can arrive exactly as you are and still be worthy of this hour.' }
  ],
  five: [
    { tag: '05 min', title: 'You are allowed to begin gently.', text: 'Small steps count. A calm start is still a strong start.' },
    { tag: '05 min', title: 'This pace is enough.', text: 'You are not behind. You are simply settling into your own rhythm.' },
    { tag: '05 min', title: 'Let the moment be kind.', text: 'Even a quiet beginning can become a powerful foundation.' }
  ],
  fifteen: [
    { tag: '15 min', title: 'Your effort is visible.', text: 'Even quiet progress is progress. You are doing better than you think.' },
    { tag: '15 min', title: 'Momentum is building.', text: 'Let yourself notice what has already shifted. You are stronger than the last time you checked in.' },
    { tag: '15 min', title: 'You are not forcing it.', text: 'Steady effort is still effort, and it is making a real difference.' }
  ],
  thirty: [
    { tag: '30 min', title: 'Trust the process.', text: 'You are building inner steadiness, not just checking off time.' },
    { tag: '30 min', title: 'This is becoming real.', text: 'Your practice is gathering strength. Trust what has already started within you.' },
    { tag: '30 min', title: 'You are growing in quiet ways.', text: 'Confidence is often built in the moments no one else sees.' }
  ],
  fortyFive: [
    { tag: '45 min', title: 'You are stronger than the doubt.', text: 'Grace, patience, and persistence are all part of your growth.' },
    { tag: '45 min', title: 'Your resilience is showing.', text: 'The effort you keep giving yourself is more powerful than your inner critic.' },
    { tag: '45 min', title: 'Keep meeting yourself kindly.', text: 'You are not falling behind. You are becoming more grounded and more confident.' }
  ],
  sixty: [
    { tag: '60 min', title: 'You did it.', text: 'You gave yourself an hour of kindness and evidence of your worth.' },
    { tag: '60 min', title: 'You stayed with yourself.', text: 'That kind of care is a real accomplishment, and it deserves celebration.' },
    { tag: '60 min', title: 'This is worth honoring.', text: 'You created a moment of gentleness that can carry you forward.' }
  ]
};

const milestoneTopics = [
  {
    minute: 5,
    tag: '05 min',
    title: 'Steady beginning',
    text: 'This is your settling-in moment. Let your breath slow down, notice your body, and remember that a gentle start is still a meaningful start.'
  },
  {
    minute: 15,
    tag: '15 min',
    title: 'Momentum',
    text: 'This block is about visible progress. Notice what has already shifted inside you, even if it feels small. Momentum is built by showing up, not by forcing.'
  },
  {
    minute: 30,
    tag: '30 min',
    title: 'Trust yourself',
    text: 'This section is for trust. You are not behind. You are building steady confidence, one honest choice at a time, and your consistency matters more than intensity.'
  },
  {
    minute: 45,
    tag: '45 min',
    title: 'Strength',
    text: 'This is your strength window. Acknowledge the effort you have already made, and let yourself feel proud of how much you have carried without needing to prove anything.'
  },
  {
    minute: 60,
    tag: '60 min',
    title: 'Completion',
    text: 'This final block is about recognition. You gave yourself an hour of care, patience, and gentleness. That is real progress, and it deserves to be celebrated.'
  }
];

const moodAffirmations = {
  calm: [
    { title: 'You are allowed to soften.', text: 'Rest is productive when your nervous system needs gentleness.' },
    { title: 'Breathe in ease.', text: 'You do not have to earn calm. It is already yours to return to.' },
    { title: 'Your peace matters.', text: 'Even a quiet moment can repair your mind and strengthen your body.' }
  ],
  confidence: [
    { title: 'You are more capable than you think.', text: 'Your steady effort is building trust in yourself, one breath at a time.' },
    { title: 'Your progress is real.', text: 'You have already done more than you give yourself credit for.' },
    { title: 'You can keep going.', text: 'Confidence grows when you keep showing up kindly for your own life.' }
  ],
  joy: [
    { title: 'Joy is allowed here.', text: 'You do not need to wait for perfection before you let yourself feel good.' },
    { title: 'Your spark still belongs to you.', text: 'Even in the middle of effort, delight is still part of the journey.' },
    { title: 'Lightness is a strength.', text: 'A smiling heart is not a distraction. It is a form of resilience.' }
  ],
  focus: [
    { title: 'One step is enough.', text: 'You do not need a perfect plan. You need the next honest move.' },
    { title: 'Stay with what matters.', text: 'Your attention is a gift you can give back to yourself today.' },
    { title: 'Your focus can be gentle.', text: 'Clear thinking grows when you meet yourself with patience and purpose.' }
  ]
};

const timerEl = document.getElementById('timer');
const statusTextEl = document.getElementById('statusText');
const timeLabelEl = document.getElementById('timeLabel');
const progressFillEl = document.getElementById('progressFill');
const sessionPercentEl = document.getElementById('sessionPercent');
const affirmationTitleEl = document.getElementById('affirmationTitle');
const affirmationTextEl = document.getElementById('affirmationText');
const momentTagEl = document.getElementById('momentTag');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const voiceToggleBtn = document.getElementById('voiceToggle');
const ambientToggleBtn = document.getElementById('ambientToggle');
const newAffirmationBtn = document.getElementById('newAffirmationBtn');
const moodButtons = Array.from(document.querySelectorAll('.mood-button'));
const sectionButtons = Array.from(document.querySelectorAll('.section-select'));
const userNameInput = document.getElementById('userName');

let remainingSeconds = totalSeconds;
let timerId = null;
let isRunning = false;
let voiceEnabled = true;
let ambientEnabled = false;
let selectedMood = 'calm';
let selectedSection = null;
const moodIndexes = {};
let customAffirmation = null;
let ambientAudioContext = null;
let ambientNoiseSource = null;
let ambientFilter = null;
let ambientFilterLfo = null;
let ambientFilterDepth = null;
let ambientGain = null;

function getUserName() {
  const value = userNameInput?.value?.trim();
  return value && value.toLowerCase() !== 'you' ? value : 'you';
}

function personalizeAffirmation(affirmation) {
  const name = getUserName();
  const person = name === 'you' ? 'you' : name;

  if (name === 'you') {
    return affirmation;
  }

  const title = affirmation.title.startsWith('You ')
    ? affirmation.title.replace(/^You\s+/i, `${person}, you `)
    : `${person}, ${affirmation.title}`;

  const text = affirmation.text.startsWith('You ')
    ? affirmation.text.replace(/^You\s+/i, `${person}, you `)
    : `${person}, ${affirmation.text}`;

  return { ...affirmation, title, text };
}

function getMilestoneForElapsed(elapsedSeconds) {
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 5) {
    const options = affirmations.start;
    return options[(Math.floor(elapsedSeconds / 20) + selectedMood.length) % options.length];
  }

  if (elapsedMinutes < 15) return affirmations.five[(Math.floor(elapsedSeconds / 30) + selectedMood.length) % affirmations.five.length];
  if (elapsedMinutes < 30) return affirmations.fifteen[(Math.floor(elapsedSeconds / 30) + selectedMood.length) % affirmations.fifteen.length];
  if (elapsedMinutes < 45) return affirmations.thirty[(Math.floor(elapsedSeconds / 45) + selectedMood.length) % affirmations.thirty.length];
  if (elapsedMinutes < 60) return affirmations.fortyFive[(Math.floor(elapsedSeconds / 45) + selectedMood.length) % affirmations.fortyFive.length];

  return affirmations.sixty[(Math.floor(elapsedSeconds / 60) + selectedMood.length) % affirmations.sixty.length];
}

function getActiveAffirmation() {
  if (selectedSection !== null) {
    return customAffirmation;
  }

  if (isRunning) {
    return getMilestoneForElapsed(totalSeconds - remainingSeconds);
  }

  return customAffirmation || pickMoodAffirmation(selectedMood);
}

function speakAffirmation() {
  if (!window.speechSynthesis || !voiceEnabled) return;

  const affirmation = personalizeAffirmation(getActiveAffirmation());
  const message = `${affirmation.title}. ${affirmation.text}`;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.9;
  utterance.pitch = 0.86;
  utterance.volume = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter(voice => /en/i.test(voice.lang));
  const maleVoice = englishVoices.find(voice =>
    /david|daniel|george|guy|james|male|mark|microsoft guy|google uk english male/i.test(voice.name)
  );
  const preferredVoice = maleVoice || englishVoices[0] || voices[0];
  if (preferredVoice) utterance.voice = preferredVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  voiceToggleBtn.textContent = voiceEnabled ? 'Vocal on' : 'Vocal off';

  if (!voiceEnabled) {
    window.speechSynthesis?.cancel();
    return;
  }

  speakAffirmation();
}

function ensureAmbientAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  if (!ambientAudioContext) {
    ambientAudioContext = new AudioContextClass();
    const noiseBuffer = ambientAudioContext.createBuffer(
      1,
      ambientAudioContext.sampleRate * 4,
      ambientAudioContext.sampleRate
    );
    const noiseData = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = Math.random() * 2 - 1;
    }

    ambientNoiseSource = ambientAudioContext.createBufferSource();
    ambientNoiseSource.buffer = noiseBuffer;
    ambientNoiseSource.loop = true;

    ambientFilter = ambientAudioContext.createBiquadFilter();
    ambientFilter.type = 'lowpass';
    ambientFilter.frequency.value = 650;
    ambientFilter.Q.value = 0.7;

    ambientFilterLfo = ambientAudioContext.createOscillator();
    ambientFilterLfo.type = 'sine';
    ambientFilterLfo.frequency.value = 0.07;
    ambientFilterDepth = ambientAudioContext.createGain();
    ambientFilterDepth.gain.value = 350;
    ambientFilterLfo.connect(ambientFilterDepth);
    ambientFilterDepth.connect(ambientFilter.frequency);

    ambientGain = ambientAudioContext.createGain();
    ambientGain.gain.value = 0.0001;

    ambientNoiseSource.connect(ambientFilter);
    ambientFilter.connect(ambientGain);
    ambientGain.connect(ambientAudioContext.destination);
    ambientNoiseSource.start();
    ambientFilterLfo.start();
  }

  if (ambientAudioContext.state === 'suspended') {
    ambientAudioContext.resume();
  }

  return true;
}

function setAmbientLevel(level) {
  if (!ambientAudioContext || !ambientGain) return;
  ambientGain.gain.cancelScheduledValues(ambientAudioContext.currentTime);
  ambientGain.gain.linearRampToValueAtTime(level, ambientAudioContext.currentTime + 0.7);
}

function startAmbientAudio() {
  if (!ensureAmbientAudio()) return;
  ambientEnabled = true;
  ambientToggleBtn.textContent = 'Atmosphere on';
  setAmbientLevel(0.025);
}

function stopAmbientAudio() {
  ambientEnabled = false;
  ambientToggleBtn.textContent = 'Atmosphere off';
  setAmbientLevel(0.0001);
}

function toggleAmbientAudio() {
  if (ambientEnabled) {
    stopAmbientAudio();
    return;
  }

  startAmbientAudio();
}

function formatTime(total) {
  const hours = String(Math.floor(total / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const seconds = String(total % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getAffirmationForElapsed(elapsed) {
  const elapsedMinutes = Math.floor(elapsed / 60);

  if (elapsedMinutes < 5) return affirmations.start[0];
  if (elapsedMinutes < 15) return affirmations.five[0];
  if (elapsedMinutes < 30) return affirmations.fifteen[0];
  if (elapsedMinutes < 45) return affirmations.thirty[0];
  if (elapsedMinutes < 60) return affirmations.fortyFive[0];
  return affirmations.sixty[0];
}

function pickMoodAffirmation(mood = selectedMood) {
  const options = moodAffirmations[mood] || moodAffirmations.calm;
  moodIndexes[mood] = ((moodIndexes[mood] || 0) + 1) % options.length;
  const choice = options[moodIndexes[mood]];
  return {
    tag: mood.charAt(0).toUpperCase() + mood.slice(1),
    ...choice
  };
}

function updateMoodButtons() {
  moodButtons.forEach((btn) => {
    const active = btn.dataset.mood === selectedMood;
    btn.classList.toggle('active', active);
  });
}

function updateSectionButtons() {
  sectionButtons.forEach((button, index) => {
    const active = index === selectedSection;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function showAffirmation(affirmation) {
  const personal = personalizeAffirmation(affirmation);
  affirmationTitleEl.textContent = personal.title;
  affirmationTextEl.textContent = personal.text;
  momentTagEl.textContent = affirmation.tag;
}

function updateAffirmation() {
  const affirmation = getActiveAffirmation();
  showAffirmation(affirmation);
}

function setMood(mood) {
  selectedMood = mood;
  selectedSection = null;
  customAffirmation = pickMoodAffirmation(mood);
  updateMoodButtons();
  updateSectionButtons();
  updateAffirmation();

  if (voiceEnabled) {
    speakAffirmation();
  }
}

function chooseSection(index) {
  selectedSection = index;
  customAffirmation = milestoneTopics[index];
  updateSectionButtons();
  updateAffirmation();

  if (voiceEnabled) {
    speakAffirmation();
  }
}

function generateNewAffirmation() {
  selectedSection = null;
  customAffirmation = pickMoodAffirmation(selectedMood);
  updateSectionButtons();
  updateAffirmation();

  if (voiceEnabled) {
    speakAffirmation();
  }
}

function render() {
  timerEl.textContent = formatTime(remainingSeconds);
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  progressFillEl.style.width = `${Math.min(progress, 100)}%`;
  sessionPercentEl.textContent = `${Math.round(progress)}%`;
  timeLabelEl.textContent = `${formatTime(remainingSeconds).replace(/^\d{2}:/, '')} remaining`;
  updateAffirmation();
}

function completeSession() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  remainingSeconds = 0;
  statusTextEl.textContent = 'Complete';
  statusTextEl.classList.add('complete');
  startBtn.textContent = 'Session done';
  startBtn.disabled = true;
  customAffirmation = pickMoodAffirmation(selectedMood);
  render();
}

function tick() {
  if (remainingSeconds <= 0) {
    completeSession();
    return;
  }

  remainingSeconds -= 1;
  statusTextEl.textContent = 'In progress';
  statusTextEl.classList.remove('complete');
  render();

  if (remainingSeconds <= 0) {
    completeSession();
    return;
  }

  const elapsedSeconds = totalSeconds - remainingSeconds;
  const milestoneThresholds = [300, 900, 1800, 2700];

  if (elapsedSeconds === 0 || milestoneThresholds.includes(elapsedSeconds)) {
    speakAffirmation();
  }
}

function startSession() {
  if (isRunning || remainingSeconds <= 0) return;

  isRunning = true;
  statusTextEl.textContent = 'In progress';
  statusTextEl.classList.remove('complete');
  startBtn.textContent = 'Running';
  startBtn.disabled = true;
  selectedSection = null;
  customAffirmation = null;
  updateSectionButtons();

  speakAffirmation();
  timerId = setInterval(tick, 1000);
}

function resetSession() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  remainingSeconds = totalSeconds;
  statusTextEl.textContent = 'Ready';
  statusTextEl.classList.remove('complete');
  startBtn.textContent = 'Start now';
  startBtn.disabled = false;
  selectedSection = null;
  customAffirmation = pickMoodAffirmation(selectedMood);
  window.speechSynthesis?.cancel();
  updateSectionButtons();
  render();
}

startBtn.addEventListener('click', startSession);
resetBtn.addEventListener('click', resetSession);
voiceToggleBtn.addEventListener('click', toggleVoice);
ambientToggleBtn.addEventListener('click', toggleAmbientAudio);
newAffirmationBtn.addEventListener('click', generateNewAffirmation);
moodButtons.forEach((button) => {
  button.addEventListener('click', () => setMood(button.dataset.mood));
});
sectionButtons.forEach((button) => {
  button.addEventListener('click', () => chooseSection(Number(button.dataset.section)));
});
userNameInput?.addEventListener('input', () => {
  customAffirmation = customAffirmation || pickMoodAffirmation(selectedMood);
  render();
});
window.speechSynthesis?.addEventListener?.('voiceschanged', speakAffirmation);
updateMoodButtons();
updateSectionButtons();
customAffirmation = pickMoodAffirmation(selectedMood);
render();


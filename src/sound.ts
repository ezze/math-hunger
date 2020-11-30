import correctSoundUrl from './audio/correct.mp3';
import wrongSoundUrl from './audio/wrong.mp3';
import gameOverSoundUrl from './audio/game-over.mp3';

import music1Url from './audio/bttf-1.mp3';
import music2Url from './audio/bttf-2.mp3';

const soundBlobs: SoundBlobs = {
  correct: null,
  wrong: null,
  gameOver: null
};

let musicIndex = 0;
let musicAudio: HTMLAudioElement | null = null;
const musicBlobs: Array<Blob> = [];

export async function initSounds(): Promise<void> {
  if (!Audio) {
    return;
  }
  Object.assign(soundBlobs, {
    correct: await loadAudioBlob(correctSoundUrl),
    wrong: await loadAudioBlob(wrongSoundUrl),
    gameOver: await loadAudioBlob(gameOverSoundUrl)
  });
}

export async function initMusic(): Promise<void> {
  if (!Audio) {
    return;
  }
  musicBlobs.push(
    await loadAudioBlob(music1Url),
    await loadAudioBlob(music2Url)
  );
}

async function loadAudioBlob(url: string): Promise<Blob> {
  try {
    const response = await fetch(url);
    return response.blob();
  }
  catch (e) {
    return Promise.reject(`Unable to load audio "${url}"`);
  }
}

export async function playSound(sound: Sound): Promise<void> {
  const audioBlob = soundBlobs[sound];
  if (!audioBlob) {
    return;
  }
  const audio = createAudio(audioBlob);
  await playAudio(audio);
}

export async function playMusic(singleTrack = false): Promise<void> {
  if (musicAudio) {
    return;
  }
  const audioBlob = musicBlobs[musicIndex];
  if (!audioBlob) {
    return;
  }
  const audio = createAudio(audioBlob);
  musicAudio = audio;
  await playAudio(audio);
  musicAudio = null;
  if (singleTrack) {
    return;
  }
  musicIndex++;
  if (musicIndex >= musicBlobs.length) {
    musicIndex = 0;
  }
  playMusic().catch(e => console.error(e));
}

export async function stopMusic(): Promise<void> {
  if (!musicAudio) {
    return;
  }
  musicAudio.pause();
  musicAudio.currentTime = 0;
  musicAudio = null;
}

function createAudio(audioBlob: Blob): HTMLAudioElement {
  return new Audio(URL.createObjectURL(audioBlob));
}

export async function playAudio(audio: HTMLAudioElement): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      audio.addEventListener('ended', () => resolve());
      audio.addEventListener('error', () => reject());
      audio.play();
    }
    catch (e) {
      console.error(e);
      reject();
    }
  });
}

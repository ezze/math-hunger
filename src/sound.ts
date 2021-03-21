import correctSoundUrl from './audio/correct.mp3';
import wrongSoundUrl from './audio/wrong.mp3';
import gameOverSoundUrl from './audio/game-over.mp3';

import f1Url from './audio/f1.mp3';
import bttfUrl1 from './audio/bttf-1.mp3';
import bttfUrl2 from './audio/bttf-2.mp3';

const soundBlobs: SoundBlobs = {
  correct: null,
  wrong: null,
  gameOver: null
};

let musicIndex = 0;
let musicAudio: HTMLAudioElement | null = null;
const musicBlobs: Record<AnimationType, Array<Blob>> = {
  horse: [],
  formulaCar: []
};

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
  musicBlobs.horse.push(await loadAudioBlob(bttfUrl1), await loadAudioBlob(bttfUrl2));
  musicBlobs.formulaCar.push(await loadAudioBlob(f1Url));
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

export async function playMusic(animationType: AnimationType, singleTrack = false): Promise<void> {
  if (musicAudio) {
    return;
  }
  const musicItems = musicBlobs[animationType];
  const audioBlob = musicItems[musicIndex];
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
  if (musicIndex >= musicItems.length) {
    musicIndex = 0;
  }
  playMusic(animationType).catch(e => console.error(e));
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

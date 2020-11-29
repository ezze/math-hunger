import correctSoundUrl from './audio/correct.mp3';
import wrongSoundUrl from './audio/wrong.mp3';
import gameOverSoundUrl from './audio/game-over.mp3';

import music1Url from './audio/bttf-1.mp3';
import music2Url from './audio/bttf-2.mp3';

const sounds: Sounds = {
  correct: null,
  wrong: null,
  gameOver: null
};

const playingSounds: Record<Sound, boolean> = {
  correct: false,
  wrong: false,
  gameOver: false
};

const musicTracks = new Array<HTMLAudioElement>();
let musicIndex = 0;

export async function initAudio(): Promise<void> {
  if (!Audio) {
    return;
  }
  sounds.correct = await loadAudio(correctSoundUrl);
  sounds.wrong = await loadAudio(wrongSoundUrl);
  sounds.gameOver = await loadAudio(gameOverSoundUrl);
  musicTracks.push(await loadAudio(music1Url), await loadAudio(music2Url));
}

async function loadAudio(url: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const sound = new Audio();
    const onCanPlay = () => {
      removeListeners();
      resolve(sound);
    };
    const onError = () => {
      removeListeners();
      reject();
    };
    const removeListeners = () => {
      sound.removeEventListener('canplaythrough', onCanPlay);
      sound.removeEventListener('error', onError);
    };
    sound.addEventListener('canplaythrough', onCanPlay);
    sound.addEventListener('error', onError);
    sound.src = url;
  });
}

export async function playSound(sound: Sound): Promise<void> {
  if (playingSounds[sound]) {
    return;
  }
  const audio = sounds[sound];
  if (!audio) {
    return;
  }
  playingSounds[sound] = true;
  try {
    await audio.play();
  }
  catch (e) {
    console.error(e);
  }
  finally {
    playingSounds[sound] = false;
  }
}

export async function playMusic(): Promise<void> {
  const audio = musicTracks[musicIndex];
  if (!audio) {
    return;
  }

  let onEnded;
  let onError;
  await new Promise<void>((resolve, reject) => {
    onEnded = () => resolve();
    onError = () => reject();
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    try {
      audio.play();
    }
    catch (e) {
      console.error(e);
    }
  });
  if (onEnded) {
    audio.removeEventListener('ended', onEnded);
  }
  if (onError) {
    audio.removeEventListener('error', onError);
  }

  musicIndex++;
  if (musicIndex >= musicTracks.length) {
    musicIndex = 0;
  }
  playMusic().catch(e => console.error(e));
}

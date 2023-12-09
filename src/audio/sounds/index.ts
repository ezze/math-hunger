import { createAudio, loadAudioBlob, playAudio } from '../utils';

import correctSoundUrl from './correct.mp3';
import gameOverSoundUrl from './game-over.mp3';
import wrongSoundUrl from './wrong.mp3';

const soundBlobs: SoundBlobs = {
  correct: null,
  wrong: null,
  gameOver: null
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

export async function playSound(sound: Sound): Promise<void> {
  const audioBlob = soundBlobs[sound];
  if (!audioBlob) {
    return;
  }
  const audio = createAudio(audioBlob);
  await playAudio(audio);
}

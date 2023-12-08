import f1Url from './f1.mp3';
import bttfUrl1 from './bttf-1.mp3';
import bttfUrl2 from './bttf-2.mp3';
import { createAudio, loadAudioBlob, playAudio } from '../utils';
import { AnimationType } from '../../sprites/types';

let musicIndex = 0;
let musicAudio: HTMLAudioElement | null = null;
const musicBlobs: Record<AnimationType, Array<Blob>> = {
  horse: [],
  formulaCar: []
};

export async function initMusic(): Promise<void> {
  if (!Audio) {
    return;
  }
  musicBlobs.horse.push(await loadAudioBlob(bttfUrl1), await loadAudioBlob(bttfUrl2));
  musicBlobs.formulaCar.push(await loadAudioBlob(f1Url));
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
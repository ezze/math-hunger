export async function loadAudioBlob(url: string): Promise<Blob> {
  try {
    const response = await fetch(url);
    return response.blob();
  }
  catch (e) {
    return Promise.reject(`Unable to load audio "${url}"`);
  }
}

export function createAudio(audioBlob: Blob): HTMLAudioElement {
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

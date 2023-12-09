export type Sound = 'correct' | 'wrong' | 'gameOver';
export type SoundBlobs = Record<Sound | string, Blob | null>;

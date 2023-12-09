import Sprite from './Sprite';

export type AnimationType = 'horse' | 'formulaCar';
export type AnimationSprites = Array<Sprite | Array<Sprite>>;
export type Sprites = Record<AnimationType, AnimationSprites>;

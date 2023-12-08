import { Sprites } from './types';
import { createContextConsumer, createContextCreator } from '../utils/context';

export const createSpritesContext = createContextCreator<Sprites>();
export const useSpritesContext = createContextConsumer<Sprites>(createSpritesContext, 'sprites');

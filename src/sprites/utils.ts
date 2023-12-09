import { createContextConsumer, createContextCreator } from '../utils/context';

import { Sprites } from './types';

export const createSpritesContext = createContextCreator<Sprites>();
export const useSpritesContext = createContextConsumer<Sprites>(createSpritesContext, 'sprites');

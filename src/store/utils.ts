import { createContextConsumer, createContextCreator } from '../utils/context';

import { Stores } from './types';

export const createStoresContext = createContextCreator<Stores>();
export const useStoresContext = createContextConsumer<Stores>(createStoresContext, 'stores');

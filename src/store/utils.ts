import { Stores } from './types';
import { createContextConsumer, createContextCreator } from '../utils/context';

export const createStoresContext = createContextCreator<Stores>();
export const useStoresContext = createContextConsumer<Stores>(createStoresContext, 'stores');

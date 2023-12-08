import once from 'lodash.once';
import { Context, createContext, useContext } from 'react';

export type CreateContext<T> = () => Context<T>;
export type UseContext<T> = () => T;

export function createContextCreator<T>(): CreateContext<T> {
  return once((): Context<T> => {
    return createContext<T>(undefined as unknown as T);
  });
}

export function createContextConsumer<T>(createContext: CreateContext<T>, name?: string): UseContext<T> {
  return (): T => {
    const context = useContext(createContext());
    if (context === undefined) {
      throw new TypeError(`Value of context${name ? ` "${name}"` : ''} is not provided`);
    }
    return context;
  };
}

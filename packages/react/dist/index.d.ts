import * as react_jsx_runtime from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { State, Store } from '@ssc/core';

type ProviderProps = PropsWithChildren<{
    initialState: State;
    injectedStore?: Store;
}>;
declare const SceneStateProvider: ({ initialState, injectedStore, children, }: ProviderProps) => react_jsx_runtime.JSX.Element;

type EqualsFn<T> = (a: T, b: T) => boolean;
declare function useSceneState(): {
    sceneState: State;
};
declare function useSceneState<T>(selector: (state: State) => T, equals?: EqualsFn<T>): {
    sceneState: T;
};

declare function useExample(): string;

export { SceneStateProvider, useExample, useSceneState };

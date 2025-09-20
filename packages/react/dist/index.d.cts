import * as react_jsx_runtime from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { State } from '@ssc/core';

type ProviderProps = PropsWithChildren<{
    initialState: State;
}>;
declare const SceneStateProvider: ({ initialState, children, }: ProviderProps) => react_jsx_runtime.JSX.Element;

declare const useSceneState: () => {
    sceneState: {
        version: 3;
        entities: Record<string, {
            name: string;
        }>;
        components: {
            transform: Record<string, {
                position: [number, number, number];
                rotation: [number, number, number];
                scale: [number, number, number];
            }>;
            mesh?: Record<string, string> | undefined;
            material?: Record<string, string> | undefined;
        };
    };
};

declare function useExample(): string;

export { SceneStateProvider, useExample, useSceneState };

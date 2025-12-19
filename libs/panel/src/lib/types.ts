import type { PanelControlType } from './constants';

// TODO: implement better type safety for `PanelControl` later
export type PanelControl<T> = {
  type: PanelControlType;
  value: T;
};

export type PanelControls = Record<string, PanelControl<unknown>>;

export type ControlsState<T extends PanelControls> = {
  [K in keyof T]: T[K] extends PanelControl<infer V> ? V : never;
};

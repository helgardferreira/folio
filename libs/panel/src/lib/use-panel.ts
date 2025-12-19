import type { Controller } from 'lil-gui';
import { useEffect, useRef, useState } from 'react';

import { PanelControlType } from './constants';
import type { ControlsState, PanelControls } from './types';
import { usePanelGuiContext } from './use-panel-gui-context';

// TODO: implement more sophisticated state management later
//       - make state changes more granular
//       - allow attaching event / change listeners
//       - improve reactivity for performance
// TODO: implement better type safety for `PanelControl` later
// TODO: figure out folders later
// TODO: continue here...
export function usePanel<T extends PanelControls>(
  controls: T
): ControlsState<T> {
  const { gui } = usePanelGuiContext();
  const controlsRef = useRef(controls);

  const [controlsState, setControlsState] = useState(() =>
    Object.entries(controls).reduce(
      (acc, [key, control]) => ({ ...acc, [key]: control.value }),
      {} as ControlsState<T>
    )
  );

  useEffect(() => {
    // TODO: remove this after debugging
    console.log('mounting usePanel');

    const controls = controlsRef.current;
    const controllers: Controller[] = [];

    const interpreted = Object.entries(controls).reduce(
      (acc, [key, control]) => ({ ...acc, [key]: control.value }),
      {} as ControlsState<T>
    );

    for (const key in controls) {
      if (!Object.hasOwn(interpreted, key)) continue;

      let controller: Controller;

      if (controls[key].type === PanelControlType.Color) {
        controller = gui.addColor(interpreted, key);
      } else {
        controller = gui.add(interpreted, key);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      controller.onFinishChange((value: any) =>
        setControlsState((controlsState) => ({
          ...controlsState,
          [key]: value,
        }))
      );

      controllers.push(controller);
    }

    return () => {
      controllers.forEach((controller) => controller.destroy());
    };
  }, [gui]);

  return controlsState;
}

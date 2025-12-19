import type { GUI } from 'lil-gui';
import { type PropsWithChildren, createContext, useEffect } from 'react';

export type PanelGuiContextValue = {
  gui: GUI;
};

export const PanelGuiContext = createContext<PanelGuiContextValue | null>(null);

type PanelGuiProviderProps = PropsWithChildren<{
  gui: GUI;
}>;

export function PanelGuiProvider({ children, gui }: PanelGuiProviderProps) {
  useEffect(() => {
    gui.show();

    return () => {
      gui.hide();
    };
  }, [gui]);

  return (
    <PanelGuiContext.Provider value={{ gui }}>
      {children}
    </PanelGuiContext.Provider>
  );
}

import { useContext } from 'react';

import {
  PanelGuiContext,
  type PanelGuiContextValue,
} from './panel-gui-provider';

export function usePanelGuiContext(): PanelGuiContextValue {
  const context = useContext(PanelGuiContext);

  if (context === null) {
    throw new Error(
      'usePanelGuiContext must be used within a PanelGuiProvider'
    );
  }

  return context;
}

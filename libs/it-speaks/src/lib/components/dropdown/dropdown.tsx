import {
  type ComponentProps,
  createContext,
  useContext,
  useState,
} from 'react';

import { cn } from '@folio/utils';

import { mergeRefs, useClickOutside, useKeyEvent } from '../../utils';

type DropdownContextValue = {
  onToggle: (open: boolean) => void;
  open: boolean;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext(): DropdownContextValue {
  const context = useContext(DropdownContext);

  if (context === null) {
    throw new Error('useDropdownContext must be used within a Dropdown');
  }

  return context;
}

export type DropdownProps = Omit<ComponentProps<'details'>, 'onToggle'> & {
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
};

export function Dropdown({
  className,
  defaultOpen,
  onToggle,
  open: openProp,
  ref,
  ...props
}: DropdownProps) {
  const [internalOpen, setOpen] = useState(defaultOpen ?? false);
  const open = openProp ?? internalOpen;

  function handleToggle(open: boolean) {
    onToggle?.(open);
    setOpen(open);
  }

  const setRef = useClickOutside(() => handleToggle(false));
  useKeyEvent(() => handleToggle(false), {
    key: (key) => key === 'Escape' || key === 'Esc',
    repeat: false,
  });

  return (
    <DropdownContext.Provider value={{ onToggle: handleToggle, open }}>
      <details
        className={cn('dropdown', className)}
        open={open}
        ref={mergeRefs<HTMLDetailsElement>(setRef, ref)}
        {...props}
      />
    </DropdownContext.Provider>
  );
}

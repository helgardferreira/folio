import {
  type ComponentProps,
  type MouseEvent,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';

import { cn } from '@folio/utils';

import { useDropdownContext } from './dropdown';

export type DropdownTriggerProps = ComponentProps<'summary'> & {
  disabled?: boolean;
};

export function DropdownTrigger({
  className,
  disabled,
  onClick,
  ...props
}: DropdownTriggerProps) {
  const { onToggle, open } = useDropdownContext();

  const onClickRef = useRef(onClick);
  const onToggleRef = useRef(onToggle);

  useLayoutEffect(() => {
    onClickRef.current = onClick;
    onToggleRef.current = onToggle;
  }, [onClick, onToggle]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (disabled) return event.preventDefault();

      onClickRef.current?.(event);
      if (event.defaultPrevented) return;

      event.preventDefault();
      onToggleRef.current(!open);
    },
    [disabled, open]
  );

  return (
    <summary
      className={cn(
        disabled && 'btn-disabled pointer-events-none select-none',
        className
      )}
      onClick={handleClick}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    />
  );
}

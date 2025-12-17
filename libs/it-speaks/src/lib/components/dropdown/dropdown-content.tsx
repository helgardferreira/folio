import type { ComponentProps } from 'react';

import { cn } from '@folio/utils';

export type DropdownContentProps = ComponentProps<'div'>;

export function DropdownContent({ className, ...props }: DropdownContentProps) {
  return (
    <div
      className={cn(
        'dropdown-content rounded-box bg-base-100 z-1 shadow-sm',
        className
      )}
      {...props}
    />
  );
}

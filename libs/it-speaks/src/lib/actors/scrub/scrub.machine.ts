import { concat, fromEvent, map, of, takeUntil } from 'rxjs';
import {
  type ActorRefFrom,
  type SnapshotFrom,
  assign,
  fromEventObservable,
  setup,
} from 'xstate';

import type { EventObservableCreator } from '../../types';

import type {
  EndScrubEvent,
  ScrubActorContext,
  ScrubActorEvent,
  ScrubActorInput,
  ScrubDirection,
  ScrubEvent,
  StartScrubEvent,
} from './types';

// TODO: refactor this after initial implementation
//       - determine if element ref is necessary
//       - rethink machine logic
//       - perhaps use event emitters instead of forwarding events to parent
// TODO: implement this
// TODO: continue here...
const scrubMachine = setup({
  types: {
    context: {} as ScrubActorContext,
    events: {} as ScrubActorEvent,
    input: {} as ScrubActorInput,
  },
  actions: {
    // TODO: implement this
    /*
    forwardEndScrub: sendTo(
      ({ context }) => context.parentActor,
    */
    forwardEndScrub: ({ context }) => {
      const { percentage } = context;
      // console.log({ type: 'END_SCRUB', percentage });
    },
    // TODO: implement this
    /*
    forwardScrub: sendTo(
      ({ context }) => context.parentActor,
    */
    forwardScrub: ({ context }) => {
      const { percentage } = context;
      // console.log({ type: 'SCRUB', percentage });
    },
    // TODO: implement this
    /*
    forwardStartScrub: sendTo(
      ({ context }) => context.parentActor,
    */
    forwardStartScrub: ({ context }) => {
      const { percentage } = context;
      // console.log({ type: 'START_SCRUB', percentage });
    },

    // TODO: refactor this by moving positional mapping logic to scrubbing actor
    scrub: assign(({ context }, { position }: Omit<ScrubEvent, 'type'>) => {
      const {
        maxValue,
        minValue,
        percentage,
        prevPosition,
        scrubDirection,
        scrubberRef,
      } = context;

      if (!scrubberRef) throw new Error('Missing scrubber reference');

      const { width, height } = scrubberRef.getBoundingClientRect();

      let scrubDelta: number;
      let newPosition: number;

      if (scrubDirection === 'x') {
        newPosition = position;
        scrubDelta = (newPosition - prevPosition) / (width / maxValue);
      } else {
        newPosition = window.innerHeight - position;
        scrubDelta = (newPosition - prevPosition) / (height / maxValue);
      }

      const newPercentage = Math.min(
        Math.max(percentage + scrubDelta, minValue),
        maxValue
      );

      // console.log({
      //   maxValue,
      //   minValue,
      //   newPercentage,
      //   newPosition,
      //   percentage,
      //   prevPosition,
      //   scrubDelta,
      //   width,
      // });

      return {
        prevPosition: newPosition,
        percentage: newPercentage,
      };
    }),

    // TODO: refactor this by moving positional mapping logic to scrubbing actor
    startScrub: assign(
      (
        { context },
        { position, scrubberRef }: Omit<StartScrubEvent, 'type'>
      ) => {
        const { scrubDirection, minValue, maxValue } = context;

        if (!scrubberRef) throw new Error('Missing scrubber reference');

        // const { left, bottom, width, height } =
        //   scrubberRef.getBoundingClientRect();

        // TODO: implement handling for when `parentElement` is null (e.g. element's "parent" is the Document)
        if (scrubberRef.parentElement === null) throw new Error();

        const childRect = scrubberRef.getBoundingClientRect();
        const parentRect = scrubberRef.parentElement.getBoundingClientRect();

        // TODO: calculate positional data relative to parent element
        // ---------------------------------------------------------------------

        if (scrubDirection === 'x') {
          console.log({ childRect, parentRect, position });

          // TODO: remove this after debugging
          /*
          const newPercentage = Math.min(
            Math.max(
              (position - childRect.left) / (childRect.width / maxValue),
              minValue
            ),
            maxValue
          );
          */

          console.log(
            position - parentRect.left
            // childRect.width / maxValue,
            // (position - parentRect.left) / (childRect.width / maxValue)
          );

          const newPercentage = Math.min(
            Math.max(
              (position - childRect.left) / (childRect.width / maxValue),
              minValue
            ),
            maxValue
          );

          console.log({ newPercentage });

          return {
            prevPosition: position,
            percentage: newPercentage,
            scrubberRef,
          };
          // TODO: reimplement scrubbing in y axis after reimplementing scrubbing in x axis
        } else {
          const newPercentage = Math.min(
            Math.max(
              (childRect.bottom - position) / (childRect.height / maxValue),
              minValue
            ),
            maxValue
          );

          return {
            prevPosition: window.innerHeight - position,
            percentage: newPercentage,
            scrubberRef,
          };
        }
        // ---------------------------------------------------------------------
      }
    ),
  },
  actors: {
    // TODO: refactor this with more sophisticated mapping from event data to usable positional data
    // TODO: move implementation to separate file
    scrubbing: fromEventObservable((({ input: { scrubDirection } }) =>
      concat(
        fromEvent<MouseEvent>(window, 'mousemove').pipe(
          map(
            ({ clientX, clientY }) =>
              ({
                type: 'SCRUB',
                position: scrubDirection === 'x' ? clientX : clientY,
              }) as ScrubEvent
          ),
          takeUntil(fromEvent<MouseEvent>(window, 'mouseup'))
        ),
        of(undefined).pipe(
          map(
            () =>
              ({
                type: 'END_SCRUB',
              }) as EndScrubEvent
          )
        )
      )) as EventObservableCreator<
      EndScrubEvent | ScrubEvent,
      { scrubDirection: ScrubDirection }
    >),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCuAjAdASwgBswBiAZQBUBBAJQoH0yBhGgVQCEBtABgF1FQABwD2sPABc8wgHYCQAD0QBGAMzccANgCsADh0AWAOzcNAJlP7uATgA0IAJ7KrpnM8NLTz09dNalAX387VExcEOwsPGkochYOHn4kEBExSRk5RQQVQ31Nbn1VbkMLKw0NFS07RwQdJRwVcyslbWcGgtNA4PRsHHCsSOiSAFEAOQARRjiuPjkUiSlZJMzVQxxzVQ0DKx0VfS1dKsQrVe1TFQ0rfR1THW5d-UCgkGlhCDg5PtnRefSlxABaDSHBCAzogPr4IhgL6pBYZRD6UzA9Y4fJabIaHKYnYeMEQvoDKAwn6LUCZFRKValCqmDR7EwFfbI7g6NYeUzFSmFXY6R7+IA */
  id: 'scrub',

  context: ({ input }) => ({
    maxValue: input.maxValue,
    minValue: input.minValue,
    // TODO: implement this
    // parentActor: input.parentActor,
    percentage: 0,
    prevPosition: 0,
    scrubDirection: input.scrubDirection,
    scrubberRef: undefined,
  }),

  initial: 'idle',

  states: {
    idle: {
      on: {
        START_SCRUB: {
          target: 'scrubbing',
          actions: [
            {
              params: ({ event }) => ({
                position: event.position,
                scrubberRef: event.scrubberRef,
              }),
              type: 'startScrub',
            },
            'forwardStartScrub',
          ],
        },
      },
    },

    scrubbing: {
      invoke: {
        id: 'scrubbing',
        input: ({ context }) => ({ scrubDirection: context.scrubDirection }),
        src: 'scrubbing',
      },

      on: {
        SCRUB: {
          actions: [
            {
              params: ({ event }) => ({ position: event.position }),
              type: 'scrub',
            },
            'forwardScrub',
          ],
        },

        END_SCRUB: {
          target: 'idle',
          actions: 'forwardEndScrub',
        },
      },
    },
  },
});

type ScrubActorRef = ActorRefFrom<typeof scrubMachine>;
type ScrubActorSnapshot = SnapshotFrom<typeof scrubMachine>;

export { scrubMachine };

export type { ScrubActorRef, ScrubActorSnapshot };

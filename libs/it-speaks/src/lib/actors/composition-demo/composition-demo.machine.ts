// TODO: remove this after experimenting with optimal actor composition strategy
import { setup } from 'xstate';

import { type ScrubActorRef, scrubMachine } from '../scrub/scrub.machine';

type CompositionDemoActorContext = {
  speedScrubActor: ScrubActorRef | undefined;
  volumeScrubActor: ScrubActorRef | undefined;
  wordScrubActor: ScrubActorRef | undefined;
};

// TODO: continue here after enhancing `scrubMachine` with better track & thumb interactions
const compositionDemoMachine = setup({
  types: {
    context: {} as CompositionDemoActorContext,
  },
  actors: {
    scrub: scrubMachine,
  },
}).createMachine({
  id: 'compositionDemo',

  // const speedScrubActor = spawn(createScrubMachine('SPEED', 'y', 0, 2));
  // const volumeScrubActor = spawn(createScrubMachine('VOLUME', 'x', 0, 1));
  // const wordScrubActor = spawn(createScrubMachine('WORD', 'x', 0, 1));

  context: ({ spawn }) => ({
    speedScrubActor: spawn('scrub', {
      input: {
        direction: 'bottom-top',
        max: 2,
        min: 0,
      },
    }),
    volumeScrubActor: undefined,
    wordScrubActor: undefined,
  }),
});

export { compositionDemoMachine };

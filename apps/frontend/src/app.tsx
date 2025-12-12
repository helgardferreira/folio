import { ItSpeaks } from '@folio/it-speaks';

export function App() {
  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="w-full rounded-md border border-neutral-950 p-8">
        <h1 className="text-3xl">Hello world</h1>
      </div>

      <ItSpeaks direction="left-right" />

      <ItSpeaks direction="right-left" />

      <ItSpeaks direction="bottom-top" />

      <ItSpeaks direction="top-bottom" />

      <button className="btn">Click Me</button>
    </div>
  );
}

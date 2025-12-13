import type { ScrubTrackOffset, ScrubTrackRect } from '../types';

export function getScrubTrackRect<TElement extends Element>(
  scrubTrack: TElement
): ScrubTrackRect {
  const domRect = scrubTrack.getBoundingClientRect();

  const styles = getComputedStyle(scrubTrack);

  const offset: ScrubTrackOffset = {
    bottom: parseFloat(styles.borderBottomWidth),
    left: parseFloat(styles.borderLeftWidth),
    right: parseFloat(styles.borderRightWidth),
    top: parseFloat(styles.borderTopWidth),
  };

  const bottom = domRect.bottom - offset.bottom;
  const left = domRect.left + offset.left;
  const right = domRect.right - offset.right;
  const top = domRect.top + offset.top;

  const height = bottom - top;
  const width = right - left;

  return {
    bottom,
    height,
    left,
    offset,
    right,
    top,
    width,
  };
}

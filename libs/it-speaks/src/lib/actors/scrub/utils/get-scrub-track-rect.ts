export type ScrubTrackRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

export function getScrubTrackRect<
  TChild extends Element,
  TParent extends Element,
>(childElement: TChild, parentElement: TParent): ScrubTrackRect {
  const childRect = childElement.getBoundingClientRect();
  const parentRect = parentElement.getBoundingClientRect();

  const {
    borderLeftWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
  } = getComputedStyle(parentElement);

  const bottom =
    parentRect.bottom - parseFloat(borderBottomWidth) - childRect.height / 2;
  const left =
    parentRect.left + parseFloat(borderLeftWidth) + childRect.width / 2;
  const right =
    parentRect.right - parseFloat(borderRightWidth) - childRect.width / 2;
  const top =
    parentRect.top + parseFloat(borderTopWidth) + childRect.height / 2;

  const height = bottom - top;
  const width = right - left;

  return { bottom, height, left, right, top, width };
}

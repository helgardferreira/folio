export type ScrubTrackEdges = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

export function computeScrubTrackEdges<
  TChild extends Element,
  TParent extends Element,
>(childElement: TChild, parentElement: TParent): ScrubTrackEdges {
  const childRect = childElement.getBoundingClientRect();
  const parentRect = parentElement.getBoundingClientRect();

  const {
    borderLeftWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
  } = getComputedStyle(parentElement);

  const trackEdgeLeft =
    parentRect.left + parseFloat(borderLeftWidth) + childRect.width / 2;
  const trackEdgeTop =
    parentRect.top + parseFloat(borderTopWidth) + childRect.height / 2;
  const trackEdgeRight =
    parentRect.right - parseFloat(borderRightWidth) - childRect.width / 2;
  const trackEdgeBottom =
    parentRect.bottom - parseFloat(borderBottomWidth) - childRect.height / 2;

  return {
    bottom: trackEdgeBottom,
    left: trackEdgeLeft,
    right: trackEdgeRight,
    top: trackEdgeTop,
  };
}

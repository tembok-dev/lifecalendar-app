export interface AnchoredPopoverPositionInput {
  anchorRect: DOMRect;
  popoverRect: DOMRect;
  viewportWidth: number;
  viewportHeight: number;
  margin?: number;
  offset?: number;
  placement?: "auto" | "left" | "right";
}

export interface AnchoredPopoverPosition {
  left: number;
  top: number;
  side: "left" | "right";
}

export function computeAnchoredPopoverPosition(input: AnchoredPopoverPositionInput): AnchoredPopoverPosition {
  const margin = input.margin ?? 12;
  const offset = input.offset ?? 14;
  const anchorCenterY = input.anchorRect.top + input.anchorRect.height / 2;

  const fitsLeft = input.anchorRect.left - offset - input.popoverRect.width - margin >= 0;
  const fitsRight = input.anchorRect.right + offset + input.popoverRect.width + margin <= input.viewportWidth;

  let side: "left" | "right";
  if (input.placement === "right") {
    side = fitsRight || !fitsLeft ? "right" : "left";
  } else {
    side = fitsLeft || !fitsRight ? "left" : "right";
  }

  const rawLeft =
    side === "left"
      ? input.anchorRect.left - offset - input.popoverRect.width
      : input.anchorRect.right + offset;
  const left = Math.max(margin, Math.min(rawLeft, input.viewportWidth - input.popoverRect.width - margin));

  const rawTop = anchorCenterY - input.popoverRect.height / 2;
  const top = Math.max(margin, Math.min(rawTop, input.viewportHeight - input.popoverRect.height - margin));

  return { left, top, side };
}

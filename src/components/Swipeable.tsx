import { ReactElement, ReactNode, TouchEventHandler, useRef } from "react";

const swipeRotationThresholdRadians = Math.PI / 30;
const radiansRotationPerPixelMovement: number = Math.PI / 4600;
const xTranslationScalingFactor: number = 1 / 3;
const yTranslationScalingFactor: number = 1 / 4;

const maxShadowOpacity: number = 0.6;
export default function Swipeable({
  onLike,
  onDislike,
  children,
}: {
  onLike: () => void;
  onDislike: () => void;
  children: ReactNode;
}): ReactElement {
  const touchStartRef = useRef<TouchStart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRotationRef = useRef<number>(0);

  const onTouchStart: TouchEventHandler<HTMLElement> = (event) => {
    if (touchStartRef.current !== null) {
      return;
    }
    touchStartRef.current = {
      startX: event.targetTouches[0].clientX,
      startY: event.targetTouches[0].clientY,
    };
  };

  const updateStyle = (diffs: { diffX: number; diffY: number } | null) => {
    if (!containerRef.current) {
      return;
    }
    if (diffs === null) {
      containerRef.current.style.transform = "none";
      containerRef.current.style.transition = "box-shadow transform 0.1s";
      containerRef.current.style.boxShadow = "none";
    } else {
      const { diffX, diffY } = diffs;
      const rotation = -diffX * radiansRotationPerPixelMovement;
      currentRotationRef.current = rotation;
      const translationX = -diffX * xTranslationScalingFactor;
      const translationY = -diffY * yTranslationScalingFactor;
      containerRef.current.style.transform = `rotateZ(${rotation}rad) translate(${translationX}px, ${translationY}px)`;
      containerRef.current.style.transition = "none";
      const shadowOpacity = Math.floor(
        (Math.min(swipeRotationThresholdRadians, Math.abs(rotation)) /
          swipeRotationThresholdRadians) *
          maxShadowOpacity *
          256,
      ).toString(16);
      const shadowColor = (rotation > 0 ? "#33bb33" : "#bb3333") + shadowOpacity;
      containerRef.current.style.boxShadow = `0 0 0.5rem 0.5rem ${shadowColor}`;
    }
  };

  const onTouchMove: TouchEventHandler<HTMLElement> = (event) => {
    if (touchStartRef.current === null) {
      updateStyle(null);
    } else {
      const diffX = touchStartRef.current.startX - event.targetTouches[0].clientX;
      const diffY = Math.max(0, touchStartRef.current.startY - event.targetTouches[0].clientY);
      updateStyle({ diffX, diffY });
    }
  };

  const onTouchEnd: TouchEventHandler<HTMLElement> = () => {
    touchStartRef.current = null;
    updateStyle(null);
    if (currentRotationRef.current > swipeRotationThresholdRadians) {
      onLike();
    } else if (currentRotationRef.current < -swipeRotationThresholdRadians) {
      onDislike();
    }
    currentRotationRef.current = 0;
  };

  return (
    <div
      ref={containerRef}
      className="container"
      style={{
        transformOrigin: "bottom center",
        touchAction: "none",
        transition: "transform 0.1s",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}

interface TouchStart {
  startX: number;
  startY: number;
}

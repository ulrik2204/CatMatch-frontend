import {
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";

const swipeRotationThresholdRadians = Math.PI / 25;
const radiansRotationPerPixelMovement = Math.PI / 4600;
const xTranslationScalingFactor = 1 / 3;
const yTranslationScalingFactor = 1 / 4;
const maxShadowOpacity = 0.6;
const swipeResetTransitionTimeSeconds = 0.4;

export default function Swipeable({
  onLike,
  onDislike,
  children,
}: {
  onLike: () => void;
  onDislike: () => void;
  children: ReactNode;
}): ReactElement {
  const swipeStartRef = useRef<SwipeStart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRotationRef = useRef<number>(0);

  const updateStyle = useCallback((diffs: { diffX: number; diffY: number } | null) => {
    if (!containerRef.current) {
      return;
    }
    if (diffs === null) {
      containerRef.current.style.transform = "none";
      containerRef.current.style.transition = `box-shadow ${swipeResetTransitionTimeSeconds}s, transform ${swipeResetTransitionTimeSeconds}s`;
      containerRef.current.style.boxShadow = "none";
    } else {
      const { diffX, diffY } = diffs;
      const rotation = -diffX * radiansRotationPerPixelMovement;
      currentRotationRef.current = rotation;
      const translationX = -diffX * xTranslationScalingFactor;
      const translationY = -diffY * yTranslationScalingFactor;
      containerRef.current.style.transform = `rotateZ(${-rotation}rad) translate(${translationX}px, ${translationY}px)`;
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
  }, []);

  const onTouchBegin: TouchEventHandler<HTMLElement> = useCallback((event) => {
    if (swipeStartRef.current !== null) {
      return;
    }
    swipeStartRef.current = {
      startX: event.targetTouches[0].clientX,
      startY: event.targetTouches[0].clientY,
    };
  }, []);

  const onTouchMove: TouchEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (swipeStartRef.current === null) {
        updateStyle(null);
      } else {
        const diffX = swipeStartRef.current.startX - event.targetTouches[0].clientX;
        const diffY = Math.max(0, swipeStartRef.current.startY - event.targetTouches[0].clientY);
        updateStyle({ diffX, diffY });
      }
    },
    [updateStyle],
  );

  const onMouseDown: MouseEventHandler<HTMLElement> = useCallback((event) => {
    if (swipeStartRef.current !== null) {
      return;
    }
    swipeStartRef.current = {
      startX: event.clientX,
      startY: event.clientY,
    };
  }, []);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (swipeStartRef.current === null) {
        updateStyle(null);
      } else {
        const diffX = swipeStartRef.current.startX - event.clientX;
        const diffY = Math.max(0, swipeStartRef.current.startY - event.clientY);
        updateStyle({ diffX, diffY });
      }
    },
    [updateStyle],
  );

  const onRelease = useCallback(() => {
    swipeStartRef.current = null;
    updateStyle(null);
    if (currentRotationRef.current > swipeRotationThresholdRadians) {
      onLike();
    } else if (currentRotationRef.current < -swipeRotationThresholdRadians) {
      onDislike();
    }
    currentRotationRef.current = 0;
  }, [onDislike, onLike, updateStyle]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onRelease);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onRelease);
    };
  }, [onMouseMove, onRelease]);

  return (
    <div
      ref={containerRef}
      className="origin-top touch-none select-none"
      onTouchStart={onTouchBegin}
      onTouchMove={onTouchMove}
      onTouchEnd={onRelease}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}

interface SwipeStart {
  startX: number;
  startY: number;
}

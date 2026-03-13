import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, PanInfo, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── TiltCard ─── */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export const TiltCard = ({ children, className, maxTilt = 12, glare = true }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * maxTilt);
    rotateY.set(px * maxTilt);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
  }, [maxTilt, rotateX, rotateY, glareX, glareY]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, hsla(0,0%,100%,0.15) 0%, transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        perspective: 800,
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
};

/* ─── SwipeContainer ─── */
interface SwipeContainerProps {
  children: React.ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  resistance?: number;
}

export const SwipeContainer = ({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 80,
  resistance = 0.6,
}: SwipeContainerProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (Math.abs(info.offset.x) > threshold) {
        if (info.offset.x > 0) onSwipeRight?.();
        else onSwipeLeft?.();
      }
      if (Math.abs(info.offset.y) > threshold) {
        if (info.offset.y > 0) onSwipeDown?.();
        else onSwipeUp?.();
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]
  );

  return (
    <motion.div
      className={cn("touch-pan-y", className)}
      style={{ x, y, opacity, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={resistance}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
};

/* ─── DragToReorder ─── */
interface DragToReorderProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
}

export function DragToReorder<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  className,
}: DragToReorderProps<T>) {
  const [dragging, setDragging] = useState<number | null>(null);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <motion.div
          key={keyExtractor(item)}
          layout
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragStart={() => setDragging(index)}
          onDragEnd={(_, info) => {
            const moved = Math.round(info.offset.y / 60);
            if (moved !== 0) {
              const newItems = [...items];
              const target = Math.max(0, Math.min(items.length - 1, index + moved));
              const [removed] = newItems.splice(index, 1);
              newItems.splice(target, 0, removed);
              onReorder(newItems);
            }
            setDragging(null);
          }}
          className={cn(
            "cursor-grab active:cursor-grabbing",
            dragging === index && "z-10 shadow-elevated"
          )}
          whileDrag={{ scale: 1.02, boxShadow: "var(--shadow-elevated)" }}
        >
          {renderItem(item, index, dragging === index)}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── PullToRefresh ─── */
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export const PullToRefresh = ({ children, onRefresh, className }: PullToRefreshProps) => {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pullY = useMotionValue(0);
  const pullProgress = useTransform(pullY, [0, 100], [0, 1]);
  const spinnerRotate = useTransform(pullY, [0, 100], [0, 360]);

  const handleDragEnd = async (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setPulling(false);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
        style={{ y: useTransform(pullY, [0, 100], [-40, 20]) }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          style={{ rotate: refreshing ? undefined : spinnerRotate }}
          animate={refreshing ? { rotate: 360 } : {}}
          transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
        />
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        style={{ y: pullY }}
        onDragStart={() => setPulling(true)}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ─── PinchZoom ─── */
interface PinchZoomProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
}

export const PinchZoom = ({ children, className, minScale = 1, maxScale = 3 }: PinchZoomProps) => {
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      className={cn("overflow-hidden touch-none", className)}
      style={{ scale: springScale, x, y }}
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      onDoubleClick={() => {
        const current = scale.get();
        scale.set(current > 1 ? minScale : maxScale);
        x.set(0);
        y.set(0);
      }}
      whileTap={{ cursor: "grabbing" }}
    >
      {children}
    </motion.div>
  );
};

/* ─── DeviceTilt (accelerometer-based) ─── */
interface DeviceTiltProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const DeviceTilt = ({ children, className, intensity = 10 }: DeviceTiltProps) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const beta = (e.beta || 0) - 45; // front-back tilt
      const gamma = e.gamma || 0; // left-right tilt
      rotateX.set((beta / 90) * intensity);
      rotateY.set((gamma / 90) * intensity);
    };

    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [intensity, rotateX, rotateY]);

  return (
    <motion.div
      className={className}
      style={{
        perspective: 800,
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
};

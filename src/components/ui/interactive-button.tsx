import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import { Check, Loader2 } from "lucide-react";

/* ─── LiquidButton ─── */
interface LiquidButtonProps extends ButtonProps {
  liquidColor?: string;
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ children, className, liquidColor, ...props }, ref) => {
    const [hovered, setHovered] = useState(false);

    return (
      <Button
        ref={ref}
        className={cn("relative overflow-hidden group", className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-primary-foreground/15"
          initial={{ y: "100%" }}
          animate={{ y: hovered ? "0%" : "100%" }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
        <span className="relative z-10">{children}</span>
      </Button>
    );
  }
);
LiquidButton.displayName = "LiquidButton";

/* ─── RippleButton ─── */
interface RippleItem {
  x: number;
  y: number;
  id: number;
}

export const RippleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleItem[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = (btnRef.current || (ref as React.RefObject<HTMLButtonElement>)?.current)?.getBoundingClientRect();
        if (rect) {
          const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() };
          setRipples((prev) => [...prev, ripple]);
          setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600);
        }
        onClick?.(e);
      },
      [onClick, ref]
    );

    return (
      <Button
        ref={btnRef}
        className={cn("relative overflow-hidden", className)}
        onClick={handleClick}
        {...props}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full bg-primary-foreground/25 animate-[ripple-spread_0.6s_ease-out_forwards]"
            style={{
              left: r.x - 5,
              top: r.y - 5,
              width: 10,
              height: 10,
            }}
          />
        ))}
        <span className="relative z-10">{children}</span>
      </Button>
    );
  }
);
RippleButton.displayName = "RippleButton";

/* ─── ShimmerButton ─── */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <div className="relative group">
      <div className="absolute -inset-[2px] rounded-lg animate-shimmer-border opacity-60 group-hover:opacity-100 transition-opacity blur-[1px]" />
      <Button
        ref={ref}
        className={cn("relative bg-card hover:bg-card/80 text-foreground", className)}
        {...props}
      >
        {children}
      </Button>
    </div>
  )
);
ShimmerButton.displayName = "ShimmerButton";

/* ─── LoadingButton (morphs through states) ─── */
type LoadingState = "idle" | "loading" | "success" | "error";

interface LoadingButtonProps extends ButtonProps {
  loadingState?: LoadingState;
  onComplete?: () => void;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, loadingState = "idle", onComplete, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden min-w-[120px] transition-all duration-300",
          loadingState === "success" && "bg-primary",
          loadingState === "error" && "bg-destructive animate-shake",
          className
        )}
        disabled={loadingState === "loading"}
        {...props}
      >
        <AnimatePresence mode="wait">
          {loadingState === "idle" && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.span>
          )}
          {loadingState === "loading" && (
            <motion.span
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </motion.span>
          )}
          {loadingState === "success" && (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Check className="w-5 h-5" />
            </motion.span>
          )}
          {loadingState === "error" && (
            <motion.span
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-destructive-foreground"
            >
              Error!
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

/* ─── MorphSpinner ─── */
export const MorphSpinner = ({ className, size = 40 }: { className?: string; size?: number }) => (
  <div
    className={cn("border-2 border-primary border-t-transparent animate-morph-spinner", className)}
    style={{ width: size, height: size }}
  />
);

/* ─── SuccessAnimation ─── */
export const SuccessAnimation = ({ className, show }: { className?: string; show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className={cn("flex items-center justify-center", className)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48">
          <motion.circle
            cx="24" cy="24" r="22"
            fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.path
            d="M14 24 L21 31 L34 18"
            fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          />
        </svg>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── SkeletonShimmer ─── */
export const SkeletonShimmer = ({ className }: { className?: string }) => (
  <div className={cn("rounded-md bg-muted animate-shimmer", className)} />
);

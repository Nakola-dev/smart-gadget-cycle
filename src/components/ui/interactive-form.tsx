import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── GlowInput ─── */
interface GlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  charLimit?: number;
}

export const GlowInput = React.forwardRef<HTMLInputElement, GlowInputProps>(
  ({ className, label, error, charLimit, value, onChange, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);
    const charCount = typeof value === "string" ? value.length : 0;

    useEffect(() => {
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    return (
      <div className="relative">
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-[1px] rounded-md"
          animate={{
            boxShadow: focused
              ? "0 0 15px hsl(var(--primary) / 0.3), 0 0 30px hsl(var(--primary) / 0.1)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating label */}
        {label && (
          <motion.label
            className="absolute left-3 text-muted-foreground pointer-events-none origin-left z-10"
            animate={{
              y: focused || hasValue ? -22 : 10,
              scale: focused || hasValue ? 0.8 : 1,
              color: focused ? "hsl(var(--primary))" : undefined,
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {label}
          </motion.label>
        )}

        <input
          ref={ref}
          value={value}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            onChange?.(e);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-300",
            "placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            focused ? "border-primary" : "border-input",
            error && "border-destructive animate-shake",
            className
          )}
          {...props}
        />

        {/* Character counter */}
        {charLimit && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            animate={{
              color: charCount > charLimit * 0.9
                ? "hsl(var(--destructive))"
                : "hsl(var(--muted-foreground))",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={charCount}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {charCount}
              </motion.span>
            </AnimatePresence>
            /{charLimit}
          </motion.div>
        )}

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-xs text-destructive mt-1"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
GlowInput.displayName = "GlowInput";

/* ─── AutoExpandTextarea ─── */
interface AutoExpandTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  charLimit?: number;
  error?: string;
}

export const AutoExpandTextarea = React.forwardRef<HTMLTextAreaElement, AutoExpandTextareaProps>(
  ({ className, label, charLimit, error, value, onChange, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;
    const charCount = typeof value === "string" ? value.length : 0;

    const autoResize = () => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    };

    useEffect(() => {
      autoResize();
    }, [value]);

    return (
      <div className="relative">
        <motion.div
          className="absolute -inset-[1px] rounded-md"
          animate={{
            boxShadow: focused
              ? "0 0 15px hsl(var(--primary) / 0.3)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        {label && (
          <motion.label
            className="absolute left-3 top-0 text-muted-foreground pointer-events-none origin-left z-10"
            animate={{
              y: focused || (value && String(value).length > 0) ? -20 : 8,
              scale: focused || (value && String(value).length > 0) ? 0.8 : 1,
              color: focused ? "hsl(var(--primary))" : undefined,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange?.(e);
            autoResize();
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm resize-none overflow-hidden transition-all duration-300",
            focused ? "border-primary" : "border-input",
            error && "border-destructive animate-shake",
            className
          )}
          {...props}
        />

        <div className="flex justify-between mt-1">
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-xs text-destructive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          {charLimit && (
            <span className={cn("text-xs ml-auto", charCount > charLimit * 0.9 ? "text-destructive" : "text-muted-foreground")}>
              {charCount}/{charLimit}
            </span>
          )}
        </div>
      </div>
    );
  }
);
AutoExpandTextarea.displayName = "AutoExpandTextarea";

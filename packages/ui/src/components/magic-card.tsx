"use client";

import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "../lib/utils";

type MagicCardProps = {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
};

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}: MagicCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
    }
  }, []);

  useEffect(() => {
    const div = divRef.current;

    if (div) {
      div.addEventListener("mousemove", handleMouseMove);
      return () => div.removeEventListener("mousemove", handleMouseMove);
    }

    return;
  }, [handleMouseMove]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
        "before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100",
        "before:bg-[radial-gradient(var(--gradientSize,200px)_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--gradientColor,#262626),transparent_80%)]",
        className
      )}
      ref={divRef}
      style={
        {
          "--gradientSize": `${gradientSize}px`,
          "--gradientColor": gradientColor,
          "--gradientOpacity": gradientOpacity,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${gradientSize}px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${gradientFrom}, ${gradientTo}, transparent 80%)`,
          padding: "1px",
        }}
      >
        <div className="h-full w-full rounded-xl bg-card/90 backdrop-blur-sm" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

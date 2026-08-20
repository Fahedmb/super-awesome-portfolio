"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  defaultValue?: number;
  orientation?: "vertical" | "horizontal";
}

export function Timeline({
  defaultValue = 5,
  orientation = "vertical",
  className,
  children,
  ...props
}: TimelineProps) {
  return (
    <ol
      data-slot="timeline"
      data-orientation={orientation}
      className={cn("group/timeline relative flex flex-col w-full max-w-2xl mx-auto py-2", className)}
      {...props}
    >
      {/* Centered vertical connector rail */}
      <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-gradient-to-b from-yellow-400 via-amber-500/70 to-neutral-700 pointer-events-none" />
      {children}
    </ol>
  );
}

export interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  step?: number;
  side?: "left" | "right";
}

export function TimelineItem({
  step,
  side = "right",
  className,
  children,
  ...props
}: TimelineItemProps) {
  return (
    <li
      data-slot="timeline-item"
      data-step={step}
      className={cn(
        "relative flex items-center w-full pb-6 last:pb-0 group/item",
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
}

export function TimelineHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="timeline-header"
      className={cn("relative flex flex-col w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function TimelineDate({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="timeline-date"
      className={cn(
        "text-[10px] sm:text-xs font-mono font-bold text-yellow-400 block mb-0.5",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function TimelineTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      data-slot="timeline-title"
      className={cn(
        "text-xs sm:text-sm font-bold text-white font-display tracking-tight leading-snug",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function TimelineIndicator({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="timeline-indicator"
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-neutral-950 border-2 border-yellow-400 shadow-[0_0_12px_rgba(255,214,0,0.6)] flex items-center justify-center transition-transform group-hover/item:scale-125 z-20",
        className
      )}
      {...props}
    >
      {children || <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
    </div>
  );
}

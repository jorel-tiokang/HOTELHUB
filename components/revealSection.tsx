import React from 'react'
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function RevealSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${isVisible ? "reveal-visible" : "reveal-hidden"} ${className}`}
      style={{ animationDelay: isVisible ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}


"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function AnimateIn({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: AnimateInProps) {
  
  const elementRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Définition des axes en fonction de la direction choisie
    const getCoordinates = (distance: number) => {
      switch (direction) {
        case "down": return { y: -distance, x: 0 };
        case "left": return { x: distance, y: 0 };
        case "right": return { x: -distance, y: 0 };
        case "up":
        default: return { y: distance, x: 0 };
      }
    };

    // --- DESKTOP (Mouvements normaux) ---
    mm.add("(min-width: 640px)", () => {
      const coords = getCoordinates(40); // Décale de 40px sur desktop
      gsap.from(elementRef.current, {
        opacity: 0,
        ...coords,
        duration: 1,
        ease: "power3.out",
        delay: delay,
      });
    });

    // --- MOBILE (Mouvements réduits pour la performance) ---
    mm.add("(max-width: 639px)", () => {
      // Sur mobile, on force un mouvement vertical doux (up) si c'était left/right, pour éviter que le texte sorte de l'écran tactile
      const isHorizontal = direction === "left" || direction === "right";
      const coords = getCoordinates(isHorizontal ? 15 : 20); 
      
      gsap.from(elementRef.current, {
        opacity: 0,
        ...coords,
        duration: 0.8,
        ease: "power2.out",
        delay: delay * 0.8, // On accélère légèrement le délai sur mobile
      });
    });

    return () => mm.revert();
  }, { scope: elementRef });

  return (
    // L'overflow-hidden crée l'effet de découpe (le texte sort de nulle part)
    <div ref={elementRef} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
'use client';

import React from "react";

interface ImpactCounterProps {
  end: number;
  label: string;
  plus?: boolean;
}

export default function ImpactCounter({ end, label, plus }: ImpactCounterProps) {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    const duration = 2000; // 2 seconds total
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(end * easeOutQuart);
      
      setCount(currentCount);
      
      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="bg-white rounded-xl border-2 border-[#b2cbde] p-6 text-center shadow-sm">
      <div className="text-3xl md:text-4xl font-extrabold text-[#1e3c64]">
        {count}
        {plus ? "+" : ""}
      </div>
      <div className="mt-1 text-sm md:text-base text-[#304674]/80">
        {label}
      </div>
    </div>
  );
}

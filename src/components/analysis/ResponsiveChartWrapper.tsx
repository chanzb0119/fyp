// components/analysis/ResponsiveChartWrapper.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface ResponsiveChartWrapperProps {
  children: (width: number) => React.ReactNode;
}

export const ResponsiveChartWrapper: React.FC<ResponsiveChartWrapperProps> = ({ children }) => {
  const [width, setWidth] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef) return;

    const handleResize = () => {
      setWidth(containerRef.clientWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  return (
    <div ref={setContainerRef} className="w-full h-full">
      {width > 0 && children(width)}
    </div>
  );
};
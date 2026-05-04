"use client";

import { useState, useEffect } from "react";

export const useAccessibility = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // normal | large | xlarge
  
  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', highContrast ? 'high' : 'normal');
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [highContrast, fontSize]);

  return { highContrast, setHighContrast, fontSize, setFontSize };
}

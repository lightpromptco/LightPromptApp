import { useEffect, useState } from 'react';

export function useCircadian() {
  const [temperature, setTemperature] = useState(0);
  const [circadianColor, setCircadianColor] = useState('#667eea');

  useEffect(() => {
    const updateCircadianColors = () => {
      const hour = new Date().getHours();
      let newTemperature = 0;
      let color = '#667eea'; // Default soul-blue
      
      if (hour >= 6 && hour < 12) {
        // Morning: cool tones
        newTemperature = -0.3;
        color = '#667eea'; // soul-blue
      } else if (hour >= 12 && hour < 18) {
        // Afternoon: neutral
        newTemperature = 0;
        color = '#06d6a0'; // soul-mint
      } else if (hour >= 18 && hour < 22) {
        // Evening: warm tones
        newTemperature = 0.3;
        color = '#ff9a9e'; // soul-pink
      } else {
        // Night: very warm tones
        newTemperature = 0.5;
        color = '#764ba2'; // soul-purple
      }
      
      setTemperature(newTemperature);
      setCircadianColor(color);
      
      // Update CSS variables
      document.documentElement.style.setProperty('--bg-temperature', newTemperature.toString());
      document.documentElement.style.setProperty('--circadian-color', color);
    };

    // Initial update
    updateCircadianColors();
    
    // Update every minute
    const interval = setInterval(updateCircadianColors, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { temperature, circadianColor };
}

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  sentiment?: 'positive' | 'negative' | 'neutral';
  intensity?: number;
}

export function ParticleSystem({ sentiment = 'neutral', intensity = 1 }: ParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles = particlesRef.current;

    const createParticle = (): Particle => {
      const colors = {
        positive: '#06d6a0', // soul-mint
        negative: '#ff9a9e', // soul-pink  
        neutral: '#667eea', // soul-blue
      };

      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    };

    const updateParticles = () => {
      // Remove dead particles
      particles.splice(0, particles.length, ...particles.filter(p => p.life < p.maxLife));

      // Add new particles based on intensity
      if (Math.random() < 0.02 * intensity && particles.length < 20) {
        particles.push(createParticle());
      }

      // Update existing particles
      particles.forEach(particle => {
        particle.y -= particle.speed;
        particle.life++;
        
        // Fade out as particle ages
        particle.opacity = Math.max(0, (1 - particle.life / particle.maxLife) * 0.5);
      });

      // Clear and redraw
      const elements = container.querySelectorAll('.particle-element');
      elements.forEach(el => el.remove());

      particles.forEach(particle => {
        const element = document.createElement('div');
        element.className = 'particle-element absolute rounded-full pointer-events-none';
        element.style.cssText = `
          left: ${particle.x}px;
          top: ${particle.y}px;
          width: ${particle.size}px;
          height: ${particle.size}px;
          background-color: var(--circadian-color);
          opacity: ${particle.opacity};
          z-index: 1;
        `;
        container.appendChild(element);
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sentiment, intensity]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
}

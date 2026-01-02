import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { UnifiedMedia } from '../types/tmdb';

interface HorizontalCarouselProps {
  title: string;
  subtitle?: string;
  items: UnifiedMedia[];
  loading?: boolean;
}

export const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  title,
  subtitle,
  items,
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowArrows(scrollLeft > 10 || scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const scrollAmount = containerRef.current.clientWidth * 0.8;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <section className="mb-12 px-4 md:px-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-primary/20 rounded-full animate-pulse" />
          <div className="h-8 w-48 bg-surface rounded-md animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[180px] md:min-w-[220px] aspect-[2/3] bg-surface rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section 
      className="mb-12 relative group/section"
      onMouseEnter={() => setShowArrows(true)} 
      onMouseLeave={() => setShowArrows(false)} 
    >
      <div className="px-4 md:px-12 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(158,127,255,0.5)]" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {title}
            </h2>
            {subtitle && <p className="text-textSecondary text-xs md:text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Contenedor principal del carrusel y flechas */}
      <div className="relative px-4 md:px-12 overflow-hidden"> {/* overflow-hidden aquí para contener las flechas */}
        <AnimatePresence>
          {showArrows && (
            <>
              {/* Flecha Izquierda - Estilo original */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white rounded-full transition-all duration-300 shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Scroll left"
              >
                <ChevronLeft size={32} strokeWidth={3} />
              </motion.button>

              {/* Flecha Derecha - Estilo original */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white rounded-full transition-all duration-300 shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Scroll right"
              >
                <ChevronRight size={32} strokeWidth={3} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Contenedor del Carrusel */}
        <div
          ref={containerRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-2" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] snap-start"
            >
              <MediaCard media={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

interface AnimatedBoxProps extends BoxProps {
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'float' | 'pulse';
  delay?: number;
  duration?: number;
  triggerOnScroll?: boolean;
  children: React.ReactNode;
}

const AnimatedBox: React.FC<AnimatedBoxProps> = ({
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  triggerOnScroll = false,
  children,
  sx,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerOnScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [triggerOnScroll]);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}s`,
    };

    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(20px)',
          };
        case 'slideInLeft':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(-30px)',
          };
        case 'slideInRight':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(30px)',
          };
        case 'scaleIn':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'scale(0.9)',
          };
        default:
          return baseStyles;
      }
    }

    const visibleStyles = {
      ...baseStyles,
      opacity: 1,
      transform: 'translateY(0) translateX(0) scale(1)',
    };

    if (animation === 'float') {
      return {
        ...visibleStyles,
        animation: 'float 6s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-6px)',
          },
        },
      };
    }

    if (animation === 'pulse') {
      return {
        ...visibleStyles,
        animation: 'pulse 2s ease-in-out infinite',
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      };
    }

    return visibleStyles;
  };

  return (
    <Box
      ref={ref}
      sx={{
        ...getAnimationStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AnimatedBox;


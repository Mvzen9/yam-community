import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        classNames="page-transition"
        timeout={400}
        unmountOnExit
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {children}
        </Box>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;


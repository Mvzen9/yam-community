import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';


const Home = () => {
  const [loading, setLoading] = useState(false);
  const [feedType, setFeedType] = useState('for-you');

  // Simulate loading posts

  const handleFeedChange = (_event: React.SyntheticEvent, newValue: string) => {
    setFeedType(newValue);
  };

  return (
    <>
    </>
  );
};

export default Home;
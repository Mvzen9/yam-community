import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        borderRadius: 2, 
        textAlign: 'center',
        maxWidth: 600,
        mx: 'auto',
        mt: 4
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      
      <Typography variant="h4" component="h1" gutterBottom>
        Page Not Found
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        waiting for backend to be ready...
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          component={Link} 
          to="/"
          startIcon={<HomeIcon />}
        >
          Back to Home
        </Button>
      </Box>
    </Paper>
  );
};

export default NotFound;
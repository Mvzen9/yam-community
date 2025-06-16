import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  ClickAwayListener,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputBase,
  alpha,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { userAPI, UserSearchResult } from '../../services/user';

// Debounce function to limit API calls
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UserSearchProps {
  onSearch?: (query: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query to avoid making API calls on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Only search if there's a query
    if (debouncedSearchQuery.trim()) {
      searchUsers(debouncedSearchQuery);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [debouncedSearchQuery]);

  const searchUsers = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await userAPI.searchUsers(query);
      if (response.data) {
        setSearchResults(response.data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If the input is cleared, hide the dropdown
    if (!value.trim()) {
      setShowDropdown(false);
    }
  };

  const handleUserClick = async (userId: string) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
      <Box ref={searchRef} sx={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
        <form onSubmit={handleFormSubmit}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 1)',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px rgba(155, 79, 43, 0.15)',
              },
              '&:focus-within': {
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: '0 0 0 3px rgba(155, 79, 43, 0.1)',
                transform: 'translateY(-2px)',
              },
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search for users..."
              value={searchQuery}
              onChange={handleInputChange}
              sx={{
                color: theme.palette.text.primary,
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1.5, 1, 1.5, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  transition: theme.transitions.create('width'),
                  width: '100%',
                  fontSize: '14px',
                  fontWeight: 500,
                  '&::placeholder': {
                    color: theme.palette.text.secondary,
                    opacity: 0.7,
                  },
                },
              }}
            />
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Box>
        </form>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto',
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(242, 226, 208, 0.3)',
              boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
            }}
          >
            <List sx={{ py: 0 }}>
              {searchResults.map((user) => (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => handleUserClick(user.id)}
                  sx={{
                    borderRadius: 1,
                    m: 0.5,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(155, 79, 43, 0.1)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={user.profilePictureUrl} 
                      alt={user.userName}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid rgba(155, 79, 43, 0.2)',
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {user.userName}
                      </Typography>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* No Results Message */}
        {showDropdown && searchQuery.trim() && !loading && searchResults.length === 0 && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              zIndex: 1000,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(242, 226, 208, 0.3)',
              boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
              p: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              No users found
            </Typography>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default UserSearch;
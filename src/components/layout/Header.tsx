import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import AnimatedBox from "../animation/AnimatedBox";
import UserSearch from "../UI/UserSearch";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  Box,
  useTheme,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import ImageIcon from "@mui/icons-material/Image";
import ForumIcon from "@mui/icons-material/Forum";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import ChatIcon from "@mui/icons-material/Chat";
import { useAuth } from "../../store/AuthContext";
import { useNotifications } from "../../store/NotificationContext";
import { useChat } from "../../store/ChatContext";


// Enhanced search component with animations
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  "&:hover": {
    background: 'rgba(255, 255, 255, 1)',
    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 20px rgba(155, 79, 43, 0.15)',
  },
  "&:focus-within": {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: '0 0 0 3px rgba(155, 79, 43, 0.1)',
    transform: 'translateY(-2px)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  maxWidth: "600px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
    minWidth: "400px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  transition: 'color 0.3s ease',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "14px",
    fontWeight: 500,
    "&::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    notifications,
    unreadCount: notificationCount,
    markAsRead,
  } = useNotifications();
  const { unreadCount: messageCount } = useChat();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [chatAnchorEl, setChatAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [safeSearch, setSafeSearch] = useState(true);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleChatClick = (event: React.MouseEvent<HTMLElement>) => {
    setChatAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
    setNotificationAnchorEl(null);
    setChatAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/communities");
        break;
      case 2:
        navigate("/comments");
        break;
      case 3:
        navigate("/media");
        break;
      case 4:
        navigate("/people");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        color: "text.primary",
        borderBottom: '1px solid rgba(242, 226, 208, 0.3)',
        boxShadow: '0 4px 20px rgba(155, 79, 43, 0.1)',
        width: "100%",
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 24px",
          minHeight: "64px",
        }}
      >
        <AnimatedBox animation="slideInLeft" delay={0.1}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              sx={{ 
                mr: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1) rotate(90deg)',
                  backgroundColor: 'rgba(155, 79, 43, 0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Logo />
        </AnimatedBox>

        <AnimatedBox animation="scaleIn" delay={0.2} sx={{ flexGrow: 1, display: "flex", justifyContent: "center", maxWidth: "600px" }}>
          <UserSearch onSearch={handleSearch} />
        </AnimatedBox>

        <AnimatedBox animation="slideInRight" delay={0.3}>
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/chat')}
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    },
                  }}
                >
                  <Badge badgeContent={messageCount} color="error">
                    <ChatIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    },
                  }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(155, 79, 43, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                  onClick={handleProfileMenuOpen}
                >
                  <Avatar
                    src={user?.avatar}
                    alt={user?.username}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      border: '2px solid rgba(155, 79, 43, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        border: '2px solid #9B4F2B',
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ 
                      ml: 1, 
                      display: { xs: "none", lg: "block" },
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {user?.username}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/login"
                  sx={{
                    borderRadius: "20px",
                    px: 3,
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "14px",
                    height: "36px",
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/register"
                  sx={{
                    ml: 2,
                    borderRadius: "20px",
                    px: 3,
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "14px",
                    height: "36px",
                    background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #723A20 0%, #9B4F2B 100%)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </AnimatedBox>
      </Toolbar>

      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(242, 226, 208, 0.3) 0%, rgba(247, 237, 227, 0.3) 100%)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          px: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="navigation tabs"
          indicatorColor="primary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: "48px",
            "& .MuiTab-root": {
              minHeight: "48px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              px: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                color: theme.palette.primary.main,
                transform: 'translateY(-1px)',
                backgroundColor: 'rgba(155, 79, 43, 0.05)',
              },
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
            },
          }}
        >
          <Tab label="Posts" />
          <Tab label="Communities" />
          <Tab label="Comments" />
          <Tab label="Media" />
          <Tab label="People" />
        </Tabs>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          background: 'linear-gradient(135deg, rgba(242, 226, 208, 0.1) 0%, rgba(247, 237, 227, 0.1) 100%)',
          fontSize: "14px",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={safeSearch}
              onChange={(e) => setSafeSearch(e.target.checked)}
              color="primary"
              sx={{
                '& .MuiSwitch-thumb': {
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '& .MuiSwitch-track': {
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Safe Search {safeSearch ? "On" : "Off"}
            </Typography>
          }
          sx={{ mr: 1 }}
        />
      </Box>

      {/* Enhanced User menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(242, 226, 208, 0.3)',
            boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
            mt: 1,
          },
        }}
      >
        <Box>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/profile/me");
            }}
            sx={{
              borderRadius: 1,
              margin: '4px 8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(155, 79, 43, 0.1)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/create-post");
            }}
            sx={{
              borderRadius: 1,
              margin: '4px 8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(155, 79, 43, 0.1)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <ForumIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create Post</ListItemText>
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem 
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              margin: '4px 8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                transform: 'translateX(4px)',
                color: 'error.main',
              },
            }}
          >
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Box>
      </Menu>

      {/* Enhanced Notifications popover */}
      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={() => setNotificationAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(242, 226, 208, 0.3)',
            boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
            mt: 1,
          },
        }}
      >
        <List sx={{ width: 320, maxHeight: 400, overflow: "auto" }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              disablePadding
              sx={{
                backgroundColor: notification.read
                  ? "transparent"
                  : alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <ListItemButton
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.link) {
                    navigate(notification.link);
                  }
                  setNotificationAnchorEl(null);
                }}
                sx={{
                  borderRadius: 1,
                  margin: '2px 4px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText 
                primary="No notifications" 
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Popover>

      {/* Enhanced Chat popover */}
      <Popover
        open={Boolean(chatAnchorEl)}
        anchorEl={chatAnchorEl}
        onClose={() => setChatAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(242, 226, 208, 0.3)',
            boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
            mt: 1,
          },
        }}
      >
        <List sx={{ width: 320, maxHeight: 400, overflow: "auto" }}>
          <ListItem>
            <ListItemText 
              primary="Messages coming soon!" 
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            />
          </ListItem>
        </List>
      </Popover>

      {/* Enhanced Mobile menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMenuClose}
        keepMounted
        PaperProps={{
          sx: {
            width: "250px",
            maxWidth: "80vw",
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(242, 226, 208, 0.3)',
            boxShadow: '0 8px 30px rgba(155, 79, 43, 0.15)',
            mt: 1,
          },
        }}
      >
        <Box>
          {isAuthenticated ? (
            <>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile/me");
                }}
                sx={{
                  borderRadius: 1,
                  margin: '4px 8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/");
                }}
                sx={{
                  borderRadius: 1,
                  margin: '4px 8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon>
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Home</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/communities");
                }}
                sx={{
                  borderRadius: 1,
                  margin: '4px 8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Communities</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/create-post");
                }}
                sx={{
                  borderRadius: 1,
                  margin: '4px 8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon>
                  <ForumIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Create Post</ListItemText>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  margin: '4px 8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    transform: 'translateX(4px)',
                    color: 'error.main',
                  },
                }}
              >
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/login");
                }}
                sx={{
                  borderRadius: 1,
                  margin: '4px 8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemText>Login</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/register");
                }}
                sx={{
                  borderRadius: 1,
                  margin: '4px 8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(155, 79, 43, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemText>Sign Up</ListItemText>
              </MenuItem>
            </>
          )}
        </Box>
      </Menu>
    </AppBar>
  );
};

export default Header;


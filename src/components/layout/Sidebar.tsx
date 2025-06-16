import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCommunity } from "../../store/CommunityContext";
import { useAuth } from "../../store/AuthContext";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";



const sidebarWidth = 300;

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [communitiesOpen, setCommunitiesOpen] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const { userCommunities, fetchUserCommunities, loading } = useCommunity();
  

  if (isMobile) {
    return null;
  }

  const handleCommunitiesToggle = () => {
    setCommunitiesOpen(!communitiesOpen);
  };

  return (
    <Box
      component="aside"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "calc(100vh - 48px)", // Adjust based on header height
        overflowY: "auto",
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        pt: 2,
      }}
    >
      <Box sx={{ overflow: "auto", height: "100%", pt: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/search">
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Explore" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            MY COMMUNITIES
          </Typography>

          <ListItemButton onClick={handleCommunitiesToggle}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Communities" />
            {communitiesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={communitiesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {loading ? (
                <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Loading..." />
                </ListItem>
              ) : userCommunities.length > 0 ? (
                userCommunities.map((community) => (
                  <ListItemButton
                    key={community.communityId}
                    component={Link}
                    to={`/community/${community.communityId}`}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={community.name} />
                  </ListItemButton>
                ))
              ) : (
                <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="No communities joined" />
                </ListItem>
              )}
            </List>
          </Collapse>
        </Box>

        <Box sx={{ px: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            fullWidth
            component={Link}
            to={isAuthenticated ? "/create-community" : "/login"}
            sx={{ mb: 2 }}
          >
            Create Community
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            component={Link}
            to="/"
            onClick={(e) => {
              e.preventDefault();
              if (isAuthenticated) {
                // Open join dialog in the community page
                navigate('/community/join');
              } else {
                navigate('/login');
              }
            }}
            sx={{ mb: 2 }}
          >
            Join Community
          </Button>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
            component={Link}
            to={isAuthenticated ? "/create-post" : "/login"}
          >
            Create Post
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;

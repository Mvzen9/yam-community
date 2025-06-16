import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import UserProfile from "../components/profile/UserProfile";
import { useAuth } from "../store/AuthContext";
import { authAPI } from "../services/auth";
import { postAPI } from "../services/post";
import { userAPI } from "../services/user";
import useGetProfile from "../hooks/useGetProfile";
import { ProfielResponseObject } from "../hooks/useGetProfile"
import useGetRelationStatus from "../hooks/useGetRelationStatus";
// Define empty user structure for initial state
const emptyUserProfile = {
  id: "",
  username: "",
  displayName: "",
  avatar: "",
  bio: "",
  joinDate: "",
  followers: 0,
  following: 0,
  posts: [],
  communities: [],
};

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<typeof emptyUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { user: authUser, isAuthenticated } = useAuth();


  const profileData = useGetProfile(userId!);
  console.log(userId);

  useEffect(() => {
    // Fetch user data based on userId
    const fetchUserData = async () => {
      try {
        // Check if this is the current user's profile
        const isViewingOwnProfile = userId === "me" || (authUser && userId === authUser.id);

        // If viewing own profile, use authUser.id; otherwise use the userId from params
        // Make sure we have a valid ID before making the API call
        let targetUserId = isViewingOwnProfile && authUser ? authUser.id : userId;

        // Handle the case where userId is "me" but user is not authenticated
        if (userId === "me" && !authUser) {
          console.error("Cannot view own profile when not authenticated");
          setUser(null);
          setLoading(false);
          return;
        }

        if (targetUserId && targetUserId !== "me") {
          console.log("Fetching profile for user ID:", targetUserId);

          let profileData;
          let isExternalUser = false;

          // Check if this is an external user from search (different API endpoint)
          if (isViewingOwnProfile || targetUserId.includes('-')) {
            // For current user or users with UUID format (from our system)
            const response = await authAPI.getUserProfile(targetUserId);
            profileData = response.data;
          } else {
            // For external users from the search API
            try {
              const response = await userAPI.getUserProfile(targetUserId);
              profileData = response.data;
              isExternalUser = true;
            } catch (error) {
              console.error("Error fetching external user profile:", error);
              // Fallback to auth API if user API fails
              const response = await authAPI.getUserProfile(targetUserId);
              profileData = response.data;
            }
          }

          console.log("Profile data received:", profileData);

          // Fetch user posts (only for internal users)
          let userPosts = [];
          if (!isExternalUser) {
            try {
              const postsResponse = await postAPI.getUserPosts(targetUserId);
              if (postsResponse.data && postsResponse.data.code === 200) {
                userPosts = postsResponse.data.data || [];
                console.log("User posts fetched:", userPosts);
              }
            } catch (postsError) {
              console.error("Error fetching user posts:", postsError);
            }
          }

          // Create user object from API response
          const userData = {
            id: isExternalUser ? targetUserId : profileData.userId,
            username: isExternalUser ? profileData.userName : profileData.username,
            displayName: isExternalUser ? profileData.displayName : profileData.displayName,
            avatar: isExternalUser ? profileData.profilePictureUrl : (profileData.profilePictureUrl || "/src/assets/profile-mazen.jpg"),
            bio: isExternalUser ? (profileData.bio || "No bio available") : (profileData.bio || "No bio available"),
            joinDate: isExternalUser ? new Date().toISOString() : profileData.joinedAt, // External users don't have join date
            followers: isExternalUser ? 0 : (profileData.friendsCount || 0),
            following: isExternalUser ? 0 : (profileData.friendsCount || 0),
            birthdate: isExternalUser ? undefined : profileData.birthDate,
            gender: isExternalUser ? undefined : profileData.gender,
            // Populate posts from the API response
            posts: userPosts,
            communities: [],
          };

          setUser(userData);
          setIsCurrentUser(isViewingOwnProfile);
        } else {
          // If no userId is available, set empty user profile
          setUser(null);
          setIsCurrentUser(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, authUser, isAuthenticated]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          User not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <UserProfile user={profileData.data!} isCurrentUser={isCurrentUser} posts={user.posts} communities={user.communities} />
    </Container>
  );
};

export default ProfilePage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCommunity } from "../store/CommunityContext";
import { usePost } from "../store/PostContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const { userCommunities, fetchUserCommunities } = useCommunity();
  const { createPost, loading: postLoading, error: postError, clearError } = usePost();
  const [formData, setFormData] = useState({
    content: "",
    community: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Add snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Fetch user communities when component mounts
  useEffect(() => {
    fetchUserCommunities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData({ ...formData, [name]: value });
    setError(null);
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Create preview URLs for the images
      const newPreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file)
      );

      setImages([...images, ...filesArray]);
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  // Add function to show snackbar
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Add function to handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.content || !formData.community) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      // Use the first image if there are any
      const image = images.length > 0 ? images[0] : undefined;
      
      // Call the API to create the post
      await createPost(formData.community, {
        content: formData.content,
        image
      });
      
      // Show success notification
      showSnackbar("Post created successfully!", "success");
      
      // Redirect to home page after successful post creation
      setTimeout(() => {
        navigate("/");
      }, 1500); // Short delay to allow user to see the success message
    } catch (err: any) {
      // Check for specific error messages
      if (err.response?.data?.message === "The post content contains toxic language.") {
        setError("Your post contains inappropriate or toxic content and cannot be published");
        showSnackbar("Your post contains inappropriate or toxic content", "error");
      } else if (err.response?.data?.message === "The image contains harmful content.") {
        setError("Your image contains harmful content and cannot be published");
        showSnackbar("Your image contains harmful content", "error");
      } else {
        // Generic error handling
        setError(err.message || "Failed to create post");
        showSnackbar("Failed to create post", "error");
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create a New Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>


        <FormControl fullWidth margin="normal" required>
          <InputLabel id="community-label">Community</InputLabel>
          <Select
            labelId="community-label"
            id="community"
            name="community"
            value={formData.community}
            label="Community"
            onChange={handleChange}
          >
            {userCommunities.map((community) => (
              <MenuItem key={community.communityId} value={community.communityId}>
                {community.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          id="content"
          label="Post Content"
          name="content"
          multiline
          rows={6}
          value={formData.content}
          onChange={handleChange}
        />



        <Box sx={{ mt: 3 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            multiple
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
            >
              Add Images
            </Button>
          </label>
        </Box>

        {previewUrls.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {previewUrls.map((url, index) => (
              <Box key={index} sx={{ position: "relative" }}>
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "background.paper",
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={postLoading}
        >
          {postLoading ? "Creating..." : "Create Post"}
        </Button>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreatePost;

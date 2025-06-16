import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "../store/CommunityContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateCommunity = () => {
  const navigate = useNavigate();
  const { createCommunity, error: apiError, loading, clearError } = useCommunity();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData({ ...formData, [name]: value });
    setError(null);
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    clearError();

    // Basic validation
    if (!formData.name || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    // Check name length
    if (formData.name.length < 3 || formData.name.length > 21) {
      setError("Community name must be between 3 and 21 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      
      
      const newCommunity = await createCommunity({
        name: formData.name,
        description: formData.description,
        banner: image || undefined, 
      });
      
    
      navigate(`/community/${newCommunity.communityId}`);
    } catch (err: any) {
     
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Failed to create community");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create a New Community
      </Typography>

      {(error || apiError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || apiError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Community Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          helperText={`${formData.name.length}/21 characters`}
        />



        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Community Description"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />



        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Community Banner Image
          </Typography>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="community-image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="community-image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
            >
              Upload Banner
            </Button>
          </label>
        </Box>

        {previewUrl && (
          <Box sx={{ mt: 2, position: "relative", width: "100%" }}>
            <img
              src={previewUrl}
              alt="Community banner preview"
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
              }}
              onClick={handleRemoveImage}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? "Creating..." : "Create Community"}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateCommunity;

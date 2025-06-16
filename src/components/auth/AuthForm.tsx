import { useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useAuth } from '../../store/AuthContext';
import AnimatedBox from '../animation/AnimatedBox';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const { login, register, sendVerificationCode, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthDate: '',
    bio: '',
  });
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLogin = mode === 'login';
  const title = isLogin ? 'Log In' : 'Create an Account';
  const submitButtonText = isLogin ? 'Log In' : 'Sign Up';
  const toggleModeText = isLogin
    ? "Don't have an account? Sign up"
    : 'Already have an account? Log in';
  const toggleModeLink = isLogin ? '/register' : '/login';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({ ...formData, [name]: value });
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // For login, we can use either email or username
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        // Validation for registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (!formData.username || !formData.email || !formData.password || !formData.gender || !formData.birthDate) {
          setError('Please fill in all required fields');
          return;
        }

        // Password validation - must match API requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
          return;
        }

        // Create user data object to pass to verification page
        const userData = {
          username: formData.username,
          displayName: formData.displayName || formData.username,
          email: formData.email,
          avatar: profilePicture ? URL.createObjectURL(profilePicture) : '',
          bio: formData.bio || '',
          joinDate: new Date().toISOString(),
          followers: 0,
          following: 0,
          notifications: 0,
          birthdate: formData.birthDate,
          gender: formData.gender,
        };

        // Register the user
        const { userId } = await register({
          username: formData.username,
          displayName: formData.displayName || formData.username,
          email: formData.email,
          profilePicture: profilePicture,
          password: formData.password,
          gender: formData.gender,
          birthDate: formData.birthDate,
          bio: formData.bio || '',
        });
        
        // Add the userId to the userData
        userData.id = userId;
        
        // After successful registration, send verification code
        try {
          const { token } = await sendVerificationCode(formData.email);
          
          // Navigate to verification page with email, token, and user data
          navigate('/verify', { 
            state: { 
              email: formData.email,
              tempToken: token,
              userData: userData
            } 
          });
        } catch (verificationErr) {
          console.error('Error sending verification code:', verificationErr);
          // Still navigate to verification page, but user might need to request a new code
          navigate('/verify', { 
            state: { 
              email: formData.email,
              userData: userData
            } 
          });
        }
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
    }
  };

  return (
    <Box>
      <AnimatedBox animation="fadeIn" delay={0.1}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 3,
          }}
        >
          {title}
        </Typography>
      </AnimatedBox>

      {(error || authError) && (
        <AnimatedBox animation="slideInLeft" delay={0.2}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '1.2rem',
              },
            }}
          >
            {error || authError}
          </Alert>
        </AnimatedBox>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <>
            <AnimatedBox animation="scaleIn" delay={0.3}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Box
                    onClick={handleProfilePictureClick}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: profilePicture ? 'transparent' : 'primary.main',
                        border: '3px solid',
                        borderColor: 'primary.light',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0 8px 25px rgba(155, 79, 43, 0.3)',
                        },
                      }}
                      src={profilePicture ? URL.createObjectURL(profilePicture) : undefined}
                    >
                      <AddAPhotoIcon sx={{ fontSize: '2rem' }} />
                    </Avatar>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        mt: 1, 
                        display: 'block', 
                        textAlign: 'center',
                        fontWeight: 500,
                        color: 'text.secondary',
                      }}
                    >
                      Profile Picture
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <AnimatedBox animation="slideInLeft" delay={0.4}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    />
                  </AnimatedBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <AnimatedBox animation="slideInRight" delay={0.4}>
                    <TextField
                      fullWidth
                      id="displayName"
                      label="Display Name"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      helperText="Leave blank to use username"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    />
                  </AnimatedBox>
                </Grid>

                <Grid item xs={12}>
                  <AnimatedBox animation="fadeIn" delay={0.5}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    />
                  </AnimatedBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <AnimatedBox animation="slideInLeft" delay={0.6}>
                    <FormControl fullWidth required>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        labelId="gender-label"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        label="Gender"
                        onChange={handleChange}
                        sx={{
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </AnimatedBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <AnimatedBox animation="slideInRight" delay={0.6}>
                    <TextField
                      required
                      fullWidth
                      id="birthDate"
                      label="Birth Date"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    />
                  </AnimatedBox>
                </Grid>

                <Grid item xs={12}>
                  <AnimatedBox animation="fadeIn" delay={0.7}>
                    <TextField
                      fullWidth
                      id="bio"
                      label="Bio"
                      name="bio"
                      multiline
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    />
                  </AnimatedBox>
                </Grid>

                <Grid item xs={12}>
                  <AnimatedBox animation="slideInLeft" delay={0.8}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    />
                  </AnimatedBox>
                </Grid>

                <Grid item xs={12}>
                  <AnimatedBox animation="slideInRight" delay={0.8}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                          },
                        },
                      }}
                    />
                  </AnimatedBox>
                </Grid>
              </Grid>
            </AnimatedBox>
          </>
        )}

        {isLogin && (
          <>
            <AnimatedBox animation="slideInLeft" delay={0.3}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username or Email"
                name="email"
                placeholder="Enter your username or email"
                autoComplete="username email"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                    },
                  },
                }}
              />
            </AnimatedBox>

            <AnimatedBox animation="slideInRight" delay={0.4}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-2px)',
                    },
                  },
                }}
              />
            </AnimatedBox>
          </>
        )}

        {isLogin && (
          <AnimatedBox animation="fadeIn" delay={0.5}>
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.dark',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </AnimatedBox>
        )}

        <AnimatedBox animation="scaleIn" delay={0.6}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 4, 
              mb: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                background: 'linear-gradient(135deg, #723A20 0%, #9B4F2B 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(155, 79, 43, 0.4)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                background: 'rgba(155, 79, 43, 0.3)',
                transform: 'none',
              },
            }}
          >
            {loading ? (
              <CircularProgress 
                size={24} 
                sx={{ 
                  color: 'white',
                  animation: 'spin 1s linear infinite',
                }} 
              />
            ) : (
              submitButtonText
            )}
          </Button>
        </AnimatedBox>

        <AnimatedBox animation="fadeIn" delay={0.7}>
          <Divider sx={{ my: 3 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontWeight: 500,
                px: 2,
              }}
            >
              OR
            </Typography>
          </Divider>
        </AnimatedBox>

        <AnimatedBox animation="fadeIn" delay={0.8}>
          <Box sx={{ textAlign: 'center' }}>
            <Link 
              component={RouterLink} 
              to={toggleModeLink} 
              variant="body1"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.dark',
                },
              }}
            >
              {toggleModeText}
            </Link>
          </Box>
        </AnimatedBox>
      </Box>
    </Box>
  );
};

export default AuthForm;


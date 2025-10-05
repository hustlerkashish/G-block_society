import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  LinearProgress
} from '@mui/material';
import { 
  Home as HomeIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

function LoadingPage({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  useEffect(() => {
    if (showText) {
      const timer = setTimeout(() => {
        setShowIcons(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showText]);

  useEffect(() => {
    if (showIcons) {
      const timer = setTimeout(() => {
        setShowProgress(true);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [showIcons]);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [showProgress, onComplete]);

  const features = [
    { icon: <SecurityIcon />, text: 'Security' },
    { icon: <PeopleIcon />, text: 'Community' },
    { icon: <EventIcon />, text: 'Events' },
    { icon: <NotificationsIcon />, text: 'Updates' }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          animation: 'float 8s ease-in-out infinite reverse',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-15px) rotate(-180deg)' }
          }
        }}
      />

      <Fade in={showWelcome} timeout={800}>
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Zoom in={showText} timeout={600}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 900,
                mb: 1,
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
              }}
            >
              Welcome to
            </Typography>
          </Zoom>
          
          <Slide direction="up" in={showText} timeout={800}>
            <Typography
              variant="h1"
              component="h2"
              sx={{
                fontWeight: 900,
                mb: 3,
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }
              }}
            >
              G-Block Society
            </Typography>
          </Slide>

          <Zoom in={showIcons} timeout={500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <HomeIcon
                sx={{
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                  mb: 3,
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': {
                      transform: 'translateY(0)'
                    },
                    '40%': {
                      transform: 'translateY(-10px)'
                    },
                    '60%': {
                      transform: 'translateY(-5px)'
                    }
                  }
                }}
              />
              
              {/* Feature Icons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {features.map((feature, index) => (
                  <Fade in={showIcons} timeout={500 + index * 200} key={feature.text}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          background: 'rgba(255,255,255,0.2)'
                        }
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: '1.5rem', mb: 0.5 }
                      })}
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        {feature.text}
                      </Typography>
                    </Box>
                  </Fade>
                ))}
              </Box>

              {/* Progress Bar */}
              <Fade in={showProgress} timeout={400}>
                <Box sx={{ width: 300, maxWidth: '90vw' }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #ffd700, #ffed4e)',
                        boxShadow: '0 0 10px rgba(255,215,0,0.5)'
                      }
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      opacity: 0.9,
                      fontSize: '0.9rem'
                    }}
                  >
                    Loading your dashboard... {progress}%
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </Zoom>
        </Box>
      </Fade>
    </Box>
  );
}

export default LoadingPage;

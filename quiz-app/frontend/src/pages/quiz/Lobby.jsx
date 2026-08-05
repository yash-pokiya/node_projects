import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startQuiz, resetQuiz } from '../../store/slices/quizSlice';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  HelpOutline as QuestionsIcon,
  Timer as TimerIcon,
  CheckCircleOutline as TypesIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

export default function Lobby() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.quiz);
  const [localLoading, setLocalLoading] = useState(false);

  const handleStartQuiz = async () => {
    setLocalLoading(true);
    dispatch(resetQuiz());
    
    try {
      await dispatch(startQuiz()).unwrap();
      navigate('/quiz/attempt');
    } catch (err) {
      setLocalLoading(false);
    }
  };

  const username = user?.name || 'User';

  const instructions = [
    'The quiz contains exactly 10 randomized active questions.',
    'There is no time limit, so read and verify your options carefully.',
    'Both single-choice (radio buttons) and multiple-choice (checkboxes) questions are present.',
    'For multiple-choice questions, you must check all correct answers to receive points.',
    'You can navigate freely back and forth between questions before submitting.',
    'Results, detailed scores, and review answers will be presented instantly upon submission.',
  ];

  return (
    <Box className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      {/* Greeting Header */}
      <Box>
        <Typography variant="h4" className="font-extrabold" sx={{ color: 'text.primary' }}>
          Welcome back, {username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" className="mt-1">
          Are you ready to test your knowledge today? Choose a quiz below to begin.
        </Typography>
      </Box>

      <Divider />

      <Grid container spacing={4}>
        {/* Left Side: Quiz Info & Button */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card elevation={2}>
              <CardContent className="p-6">
                <Typography variant="h6" className="font-extrabold mb-4">
                  Quiz Specification
                </Typography>
                
                <List className="p-0">
                  <ListItem className="px-0 py-2 border-b border-solid border-gray-100 dark:border-gray-800">
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <QuestionsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="10 Random Questions" secondary="Active questions database selection" />
                  </ListItem>
                  
                  <ListItem className="px-0 py-2 border-b border-solid border-gray-100 dark:border-gray-800">
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TimerIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="No Time Limit" secondary="Go at your own pace" />
                  </ListItem>

                  <ListItem className="px-0 py-2">
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TypesIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Single &amp; Multiple Choice" secondary="Multiple selection check grids" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={localLoading || loading ? <CircularProgress size={20} color="inherit" /> : <StartIcon />}
              onClick={handleStartQuiz}
              disabled={localLoading || loading}
              sx={{ py: 1.8, fontSize: 16, fontWeight: 700 }}
            >
              {localLoading || loading ? 'Loading Quiz...' : 'Start Quiz Now'}
            </Button>
          </Stack>
        </Grid>

        {/* Right Side: Instructions */}
        <Grid item xs={12} md={7}>
          <Paper elevation={1} className="p-6 h-full">
            <Typography variant="h6" className="font-extrabold mb-4" color="text.primary">
              Instructions
            </Typography>
            
            <List>
              {instructions.map((inst, idx) => (
                <ListItem key={idx} alignItems="flex-start" className="px-0 py-1.5">
                  <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {inst}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

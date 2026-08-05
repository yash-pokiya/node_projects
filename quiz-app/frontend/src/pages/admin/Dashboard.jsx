import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, fetchQuestions, deleteQuestion } from '../../store/slices/questionSlice';
import StatsCard from '../../components/admin/StatsCard';
import QuestionTable from '../../components/admin/QuestionTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import {
  HelpOutline as TotalIcon,
  Category as CategoryIcon,
  Add as AddIcon,
  Speed as DifficultyIcon,
  FormatListBulleted as ListIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, questions, loading } = useSelector((state) => state.questions);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchQuestions({ page: 1, limit: 5 }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteQuestion(id)).unwrap();
      dispatch(fetchStats());
      dispatch(fetchQuestions({ page: 1, limit: 5 }));
    } catch (err) {
      // Handled globally
    }
  };

  if (loading && !stats) {
    return <LoadingSpinner message="Fetching dashboard metrics..." />;
  }

  const total = stats?.total || 0;
  const active = stats?.active || 0;
  const easy = stats?.byDifficulty?.easy || 0;
  const medium = stats?.byDifficulty?.medium || 0;
  const hard = stats?.byDifficulty?.hard || 0;
  const categoriesCount = stats?.byCategory?.length || 0;

  return (
    <Box className="flex flex-col gap-6">
      {/* Title Header */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Box>
          <Typography variant="h4" className="font-extrabold" sx={{ color: 'text.primary' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of questions, categories, and statistics.
          </Typography>
        </Box>
        <Link to="/admin/questions/create" className="no-underline">
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Question
          </Button>
        </Link>
      </Box>

      <Divider />

      {/* Stats Cards Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Questions"
            value={total}
            icon={<TotalIcon fontSize="medium" />}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Categories"
            value={categoriesCount}
            icon={<CategoryIcon fontSize="medium" />}
            color="#EC4899"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Questions"
            value={active}
            icon={<DifficultyIcon fontSize="medium" />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Difficulty Breakdown"
            value={`${easy}E / ${medium}M / ${hard}H`}
            icon={<DifficultyIcon fontSize="medium" />}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Recent Questions Table Section */}
      <Paper elevation={1} className="p-6">
        <Box className="flex justify-between items-center mb-4">
          <Box className="flex items-center gap-2">
            <ListIcon color="primary" />
            <Typography variant="h6" className="font-bold">
              Recent Questions
            </Typography>
          </Box>
          <Link to="/admin/questions" className="no-underline">
            <Button variant="outlined" size="small">
              View All
            </Button>
          </Link>
        </Box>
        
        <QuestionTable
          questions={questions.slice(0, 5)}
          loading={loading}
          onDeleteClick={handleDelete}
          page={1}
          limit={5}
        />
      </Paper>
    </Box>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuestions,
  deleteQuestion,
  setFilters,
  clearFilters,
  setPage,
} from '../../store/slices/questionSlice';
import QuestionTable from '../../components/admin/QuestionTable';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Grid,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function QuestionsList() {
  const dispatch = useDispatch();
  const { questions, loading, total, page, totalPages, filters } = useSelector(
    (state) => state.questions
  );

  const [searchInput, setSearchInput] = useState(filters.search);
  const [categoryInput, setCategoryInput] = useState(filters.category);

  useEffect(() => {
    dispatch(
      fetchQuestions({
        page,
        limit: 10,
        search: filters.search,
        difficulty: filters.difficulty,
        category: filters.category,
      })
    );
  }, [dispatch, page, filters]);

  const handleApplyFilters = () => {
    dispatch(
      setFilters({
        search: searchInput,
        category: categoryInput,
      })
    );
  };

  const handleDifficultyChange = (e) => {
    dispatch(
      setFilters({
        difficulty: e.target.value === 'all' ? '' : e.target.value,
      })
    );
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setCategoryInput('');
    dispatch(clearFilters());
  };

  const handlePageChange = (event, value) => {
    dispatch(setPage(value));
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteQuestion(id)).unwrap();
      dispatch(
        fetchQuestions({
          page,
          limit: 10,
          search: filters.search,
          difficulty: filters.difficulty,
          category: filters.category,
        })
      );
    } catch (err) {
      // Handled globally
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      {/* Header section */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Box>
          <Typography variant="h4" className="font-extrabold" sx={{ color: 'text.primary' }}>
            Question Bank
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage the quiz questions database ({total} total questions)
          </Typography>
        </Box>
        <Link to="/admin/questions/create" className="no-underline">
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Question
          </Button>
        </Link>
      </Box>

      <Divider />

      {/* Filters Section */}
      <Paper elevation={1} className="p-4 md:p-6">
        <Box className="flex items-center gap-2 mb-4">
          <FilterIcon color="primary" />
          <Typography variant="subtitle1" className="font-semibold">
            Search &amp; Filter Questions
          </Typography>
        </Box>
        
        <Grid container spacing={3} className="items-end">
          {/* Search Title */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search by title"
              variant="outlined"
              fullWidth
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </Grid>
          
          {/* Filter Difficulty */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="filter-difficulty-label"
                label="Difficulty"
                value={filters.difficulty || 'all'}
                onChange={handleDifficultyChange}
              >
                <MenuItem value="all">All Difficulties</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Filter Category */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              size="small"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </Grid>

          {/* Filter Buttons */}
          <Grid item xs={12} sm={2} className="flex gap-2">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearFilters}
              sx={{ minWidth: 40, p: 1 }}
            >
              <ClearIcon />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Section */}
      <Paper elevation={1} className="p-6">
        <QuestionTable
          questions={questions}
          loading={loading}
          onDeleteClick={handleDelete}
          page={page}
          limit={10}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Box className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

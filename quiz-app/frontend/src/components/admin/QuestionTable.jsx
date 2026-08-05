'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../ui/ConfirmDialog';

export default function QuestionTable({
  questions = [],
  loading = false,
  onDeleteClick,
  page = 1,
  limit = 10,
  showPagination = false,
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteOpen = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteClose = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteClick && deleteId) {
      onDeleteClick(deleteId);
    }
    handleDeleteClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="6%">#</TableCell>
              <TableCell width="40%">Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Options</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <Box className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-solid border-gray-100 dark:border-gray-700">
        <Typography variant="body1" color="text.secondary">
          No questions to display.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 650 }} aria-label="questions table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600 }} width="40%">Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Options</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question, index) => {
              const serialNumber = (page - 1) * limit + index + 1;
              return (
                <TableRow
                  key={question._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell component="th" scope="row" className="font-medium">
                    {serialNumber}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {question.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={question.questionType === 'single' ? 'Single' : 'Multiple'}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={question.difficulty}
                      size="small"
                      color={getDifficultyColor(question.difficulty)}
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell className="capitalize">{question.category}</TableCell>
                  <TableCell align="center" className="font-semibold">
                    {question.options ? question.options.length : 0}
                  </TableCell>
                  <TableCell align="right">
                    <Box className="flex justify-end gap-1">
                      <Link to={`/admin/questions/${question._id}/view`}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      
                      <Link to={`/admin/questions/${question._id}/edit`}>
                        <Tooltip title="Edit Question">
                          <IconButton size="small" color="secondary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Link>

                      <Tooltip title="Delete Question">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteOpen(question._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Question?"
        message="Are you sure you want to permanently delete this question from the database? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteClose}
      />
    </>
  );
}

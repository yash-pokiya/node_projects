import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createQuestion } from '../../store/slices/questionSlice';
import QuestionForm from '../../components/admin/QuestionForm';
import { Box, Typography, Divider, Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';

export default function CreateQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(createQuestion(data)).unwrap();
      
      window.dispatchEvent(
        new CustomEvent('app-snackbar', {
          detail: {
            message: 'Question created successfully!',
            severity: 'success',
          },
        })
      );
      
      navigate('/admin/questions');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      {/* Navigation Breadcrumbs */}
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/admin" className="text-gray-500 hover:text-indigo-600 no-underline text-sm font-medium">
            Admin
          </Link>
          <Link to="/admin/questions" className="text-gray-500 hover:text-indigo-600 no-underline text-sm font-medium">
            Questions
          </Link>
          <Typography color="text.primary" className="text-sm font-semibold">
            Create
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" className="font-extrabold mt-2" sx={{ color: 'text.primary' }}>
          Create New Question
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define a new single-choice or multiple-choice question for the practice quizzes.
        </Typography>
      </Box>

      <Divider />

      <QuestionForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </Box>
  );
}

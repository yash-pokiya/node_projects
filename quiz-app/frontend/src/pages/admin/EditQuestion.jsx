import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuestionById, updateQuestion, clearCurrentQuestion } from '../../store/slices/questionSlice';
import QuestionForm from '../../components/admin/QuestionForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Box, Typography, Divider, Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';

export default function EditQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentQuestion, loading, error } = useSelector((state) => state.questions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById(id));
    }
    return () => {
      dispatch(clearCurrentQuestion());
    };
  }, [dispatch, id]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(updateQuestion({ id, data })).unwrap();
      
      window.dispatchEvent(
        new CustomEvent('app-snackbar', {
          detail: {
            message: 'Question updated successfully!',
            severity: 'success',
          },
        })
      );
      
      navigate('/admin/questions');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  if (loading && !currentQuestion) {
    return <LoadingSpinner message="Fetching question details..." />;
  }

  if (error && !currentQuestion) {
    return (
      <Box className="p-6 text-center">
        <Typography color="error" variant="h6" className="mb-4">
          Error: {error}
        </Typography>
        <Link to="/admin/questions" className="text-indigo-600 font-medium">
          Go back to Question Bank
        </Link>
      </Box>
    );
  }

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
            Edit
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" className="font-extrabold mt-2" sx={{ color: 'text.primary' }}>
          Edit Question
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Modify the properties and details of the question.
        </Typography>
      </Box>

      <Divider />

      {currentQuestion && (
        <QuestionForm
          initialData={currentQuestion}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Box>
  );
}

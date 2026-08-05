import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quizService from '../../services/quizService';

// Async Thunks
export const startQuiz = createAsyncThunk(
  'quiz/start',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizService.start();
      return response.data; // { success, questions, quizId, totalQuestions }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : error.message
      );
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { quiz } = getState();
      const { quizId, questions, answers } = quiz;

      // Map answers to the format expected by the API, defaulting missing questions to empty arrays
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedOptions: answers[q._id] || [],
      }));

      const response = await quizService.submit({
        quizId,
        answers: formattedAnswers,
      });

      return response.data; // { success, result: { ... } }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : error.message
      );
    }
  }
);

const initialState = {
  questions: [],
  answers: {}, // { questionId: [selectedOptions] }
  currentIndex: 0,
  quizId: null,
  result: null,
  status: 'idle', // 'idle' | 'active' | 'submitted'
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      const { questionId, selectedOptions } = action.payload;
      state.answers[questionId] = selectedOptions;
    },
    nextQuestion: (state) => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    setCurrentIndex: (state, action) => {
      if (action.payload >= 0 && action.payload < state.questions.length) {
        state.currentIndex = action.payload;
      }
    },
    resetQuiz: (state) => {
      state.questions = [];
      state.answers = {};
      state.currentIndex = 0;
      state.quizId = null;
      state.result = null;
      state.status = 'idle';
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Quiz
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'idle';
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.quizId = action.payload.quizId;
        state.answers = {};
        state.currentIndex = 0;
        state.result = null;
        state.status = 'active';
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'idle';
      })

      // Submit Quiz
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload.result;
        state.status = 'submitted';
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAnswer, nextQuestion, prevQuestion, resetQuiz, setCurrentIndex } = quizSlice.actions;

export default quizSlice.reducer;

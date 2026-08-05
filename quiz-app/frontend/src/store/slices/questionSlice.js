import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import questionService from '../../services/questionService';

// Async Thunks
export const fetchQuestions = createAsyncThunk(
  'questions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await questionService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : error.message
      );
    }
  }
);

export const fetchQuestionById = createAsyncThunk(
  'questions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await questionService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : error.message
      );
    }
  }
);

export const createQuestion = createAsyncThunk(
  'questions/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await questionService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : error.message
      );
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await questionService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : error.message
      );
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await questionService.delete(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : error.message
      );
    }
  }
);

export const fetchStats = createAsyncThunk(
  'questions/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await questionService.getStats();
      return response.data;
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
  currentQuestion: null,
  stats: null,
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    search: '',
    difficulty: '',
    category: '',
  },
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // Reset to page 1 on filter change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Question By Id
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload.question;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Question
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearCurrentQuestion } = questionSlice.actions;

export default questionSlice.reducer;

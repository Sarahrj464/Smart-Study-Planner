import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const toggleComplete = createAsyncThunk(
  'tasks/toggleComplete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const task = getState().tasks.items.find(t => t._id === id);
      const response = await apiClient.put(`/tasks/${id}`, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filter: 'all',
    sortBy: 'dueDate'
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        const task = action.payload.data || action.payload;
        state.items.push(task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload;
        const index = state.items.findIndex(t => t._id === updated._id);
        if (index !== -1) state.items[index] = updated;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      })

      .addCase(toggleComplete.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload;
        const index = state.items.findIndex(t => t._id === updated._id);
        if (index !== -1) state.items[index] = updated;
      });
  }
});

export const { setFilter, setSortBy } = taskSlice.actions;

export const selectAllTasks = (state) => state.tasks.items;

export const selectFilteredTasks = (state) => {
  const { items, filter, sortBy } = state.tasks;

  let filtered = items;
  if (filter === 'active') {
    filtered = items.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filtered = items.filter(t => t.completed);
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, High: 0, medium: 1, Medium: 1, low: 2, Low: 2 };
      return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
    } else if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return sorted;
};

export default taskSlice.reducer;
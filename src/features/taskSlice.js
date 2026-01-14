import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskAPI from '../api/endpoints/tasks';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      return await taskAPI.getAll(projectId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWorkspaceTasks = createAsyncThunk(
  'tasks/fetchWorkspace',
  async ({ workspaceId }, { rejectWithValue }) => {
    try {
      return await taskAPI.getAllByWorkspace(workspaceId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ workspaceId, projectId, data }, { rejectWithValue }) => {
    try {
      return await taskAPI.create(workspaceId, projectId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      return await taskAPI.update(taskId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async ({ taskId }, { rejectWithValue }) => {
    try {
      await taskAPI.delete(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Real-time event handlers
    taskCreatedRT: (state, action) => {
      const exists = state.items.find((t) => t.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    taskUpdatedRT: (state, action) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    taskDeletedRT: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload.taskId);
    },
    clearTasks: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch workspace tasks
      .addCase(fetchWorkspaceTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWorkspaceTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { taskCreatedRT, taskUpdatedRT, taskDeletedRT, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;

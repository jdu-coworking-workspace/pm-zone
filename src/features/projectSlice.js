import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectAPI from '../api/endpoints/projects';

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (workspaceId, { rejectWithValue }) => {
    try {
      return await projectAPI.getAll(workspaceId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async ({ workspaceId, data }, { rejectWithValue }) => {
    try {
      return await projectAPI.create(workspaceId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ workspaceId, projectId, data }, { rejectWithValue }) => {
    try {
      return await projectAPI.update(workspaceId, projectId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async ({ workspaceId, projectId }, { rejectWithValue }) => {
    try {
      await projectAPI.delete(workspaceId, projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Real-time event handlers
    projectCreatedRT: (state, action) => {
      const exists = state.items.find((p) => p.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    projectUpdatedRT: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    projectDeletedRT: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload.projectId);
    },
    clearProjects: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { projectCreatedRT, projectUpdatedRT, projectDeletedRT, clearProjects } =
  projectSlice.actions;
export default projectSlice.reducer;

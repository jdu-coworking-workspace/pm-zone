import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workspaceAPI from "../api/endpoints/workspaces";
import socketClient from "../socket/socketClient";

export const fetchWorkspaces = createAsyncThunk(
  'workspaces/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await workspaceAPI.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWorkspaceById = createAsyncThunk(
  'workspaces/fetchById',
  async (workspaceId, { rejectWithValue }) => {
    try {
      return await workspaceAPI.getById(workspaceId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWorkspace = createAsyncThunk(
  'workspaces/create',
  async (data, { rejectWithValue }) => {
    try {
      return await workspaceAPI.create(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWorkspaceAction = createAsyncThunk(
  'workspaces/update',
  async ({ workspaceId, data }, { rejectWithValue }) => {
    try {
      return await workspaceAPI.update(workspaceId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWorkspaceAction = createAsyncThunk(
  'workspaces/delete',
  async (workspaceId, { rejectWithValue }) => {
    try {
      await workspaceAPI.delete(workspaceId);
      return workspaceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
            const workspaceId = action.payload;
            localStorage.setItem("currentWorkspaceId", workspaceId);
            state.currentWorkspace = state.workspaces.find((w) => w.id === workspaceId);
            
            // Join socket room
            if (workspaceId) {
              socketClient.joinWorkspace(workspaceId);
            }
        },
        // Real-time event handlers
        workspaceCreatedRT: (state, action) => {
            const exists = state.workspaces.find((w) => w.id === action.payload.id);
            if (!exists) {
                state.workspaces.push(action.payload);
            }
        },
        workspaceUpdatedRT: (state, action) => {
            const index = state.workspaces.findIndex((w) => w.id === action.payload.id);
            if (index !== -1) {
                state.workspaces[index] = { ...state.workspaces[index], ...action.payload };
                if (state.currentWorkspace?.id === action.payload.id) {
                    state.currentWorkspace = { ...state.currentWorkspace, ...action.payload };
                }
            }
        },
        workspaceDeletedRT: (state, action) => {
            state.workspaces = state.workspaces.filter((w) => w.id !== action.payload.workspaceId);
            if (state.currentWorkspace?.id === action.payload.workspaceId) {
                state.currentWorkspace = state.workspaces[0] || null;
            }
        },
        clearWorkspaces: (state) => {
            state.workspaces = [];
            state.currentWorkspace = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all workspaces
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
                
                // Set current workspace from localStorage or first workspace
                const savedId = localStorage.getItem("currentWorkspaceId");
                if (savedId) {
                    state.currentWorkspace = action.payload.find((w) => w.id === savedId) || action.payload[0];
                } else {
                    state.currentWorkspace = action.payload[0];
                }
                
                // Join socket room for current workspace
                if (state.currentWorkspace) {
                    socketClient.joinWorkspace(state.currentWorkspace.id);
                }
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch workspace by ID
            .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
                const index = state.workspaces.findIndex((w) => w.id === action.payload.id);
                if (index !== -1) {
                    state.workspaces[index] = action.payload;
                } else {
                    state.workspaces.push(action.payload);
                }
                state.currentWorkspace = action.payload;
            })
            // Create workspace
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.workspaces.push(action.payload);
                state.currentWorkspace = action.payload;
                socketClient.joinWorkspace(action.payload.id);
            })
            // Update workspace
            .addCase(updateWorkspaceAction.fulfilled, (state, action) => {
                const index = state.workspaces.findIndex((w) => w.id === action.payload.id);
                if (index !== -1) {
                    state.workspaces[index] = action.payload;
                    if (state.currentWorkspace?.id === action.payload.id) {
                        state.currentWorkspace = action.payload;
                    }
                }
            })
            // Delete workspace
            .addCase(deleteWorkspaceAction.fulfilled, (state, action) => {
                state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
                if (state.currentWorkspace?.id === action.payload) {
                    socketClient.leaveWorkspace(action.payload);
                    state.currentWorkspace = state.workspaces[0] || null;
                    if (state.currentWorkspace) {
                        socketClient.joinWorkspace(state.currentWorkspace.id);
                    }
                }
            });
    }
});

export const { 
    setCurrentWorkspace, 
    workspaceCreatedRT, 
    workspaceUpdatedRT, 
    workspaceDeletedRT, 
    clearWorkspaces 
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
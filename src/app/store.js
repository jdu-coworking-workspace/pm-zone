import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '../features/workspaceSlice'
import themeReducer from '../features/themeSlice'
import authReducer from '../features/authSlice'
import projectReducer from '../features/projectSlice'
import taskReducer from '../features/taskSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        workspaces: workspaceReducer,
        projects: projectReducer,
        tasks: taskReducer,
        theme: themeReducer,
    },
})
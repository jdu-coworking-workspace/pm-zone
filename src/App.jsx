import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Settings from "./pages/Settings";
import { useSocketEvents } from "./hooks/useSocketEvents";
import { fetchWorkspaces } from "./features/workspaceSlice";
import socketClient from "./socket/socketClient";

const App = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, token } = useSelector((state) => state.auth);
    
    // Initialize socket connection and event listeners
    useSocketEvents();

    // Connect socket when authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            socketClient.connect(token);
            dispatch(fetchWorkspaces());
        }
    }, [isAuthenticated, token, dispatch]);

    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="team" element={<Team />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projectsDetail" element={<ProjectDetails />} />
                    <Route path="taskDetails" element={<TaskDetails />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketClient from '../socket/socketClient';
import { workspaceCreatedRT, workspaceUpdatedRT, workspaceDeletedRT } from '../features/workspaceSlice';
import { projectCreatedRT, projectUpdatedRT, projectDeletedRT } from '../features/projectSlice';
import { taskCreatedRT, taskUpdatedRT, taskDeletedRT } from '../features/taskSlice';

export const useSocketEvents = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspaces);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Workspace events
    const handleWorkspaceCreated = (data) => dispatch(workspaceCreatedRT(data));
    const handleWorkspaceUpdated = (data) => dispatch(workspaceUpdatedRT(data));
    const handleWorkspaceDeleted = (data) => dispatch(workspaceDeletedRT(data));

    // Project events
    const handleProjectCreated = (data) => dispatch(projectCreatedRT(data));
    const handleProjectUpdated = (data) => dispatch(projectUpdatedRT(data));
    const handleProjectDeleted = (data) => dispatch(projectDeletedRT(data));

    // Task events
    const handleTaskCreated = (data) => {
      console.log('🔔 Socket: task:created', data);
      dispatch(taskCreatedRT(data));
    };
    const handleTaskUpdated = (data) => {
      console.log('🔔 Socket: task:updated', data);
      dispatch(taskUpdatedRT(data));
    };
    const handleTaskDeleted = (data) => {
      console.log('🔔 Socket: task:deleted', data);
      dispatch(taskDeletedRT(data));
    };

    // User presence events
    const handleUserJoined = (data) => {
      console.log('User joined workspace:', data);
    };
    const handleUserLeft = (data) => {
      console.log('User left workspace:', data);
    };

    // Register event listeners
    socketClient.on('workspace:created', handleWorkspaceCreated);
    socketClient.on('workspace:updated', handleWorkspaceUpdated);
    socketClient.on('workspace:deleted', handleWorkspaceDeleted);
    socketClient.on('project:created', handleProjectCreated);
    socketClient.on('project:updated', handleProjectUpdated);
    socketClient.on('project:deleted', handleProjectDeleted);
    socketClient.on('task:created', handleTaskCreated);
    socketClient.on('task:updated', handleTaskUpdated);
    socketClient.on('task:deleted', handleTaskDeleted);
    socketClient.on('user:joined', handleUserJoined);
    socketClient.on('user:left', handleUserLeft);

    // Cleanup
    return () => {
      socketClient.off('workspace:created', handleWorkspaceCreated);
      socketClient.off('workspace:updated', handleWorkspaceUpdated);
      socketClient.off('workspace:deleted', handleWorkspaceDeleted);
      socketClient.off('project:created', handleProjectCreated);
      socketClient.off('project:updated', handleProjectUpdated);
      socketClient.off('project:deleted', handleProjectDeleted);
      socketClient.off('task:created', handleTaskCreated);
      socketClient.off('task:updated', handleTaskUpdated);
      socketClient.off('task:deleted', handleTaskDeleted);
      socketClient.off('user:joined', handleUserJoined);
      socketClient.off('user:left', handleUserLeft);
    };
  }, [dispatch, isAuthenticated, currentWorkspace]);
};

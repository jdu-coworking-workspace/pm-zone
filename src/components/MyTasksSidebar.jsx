import { useEffect, useState } from 'react';
import { CheckSquareIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function MyTasksSidebar() {

    const { user } = useSelector((state) => state.auth);
    const tasks = useSelector((state) => state.tasks?.items || []);
    const [showMyTasks, setShowMyTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const toggleMyTasks = () => setShowMyTasks(prev => !prev);

    const getTaskStatusColor = (status) => {
        switch (status) {
            case 'DONE':
                return 'bg-green-500';
            case 'IN_PROGRESS':
                return 'bg-yellow-500';
            case 'TODO':
                return 'bg-gray-500 dark:bg-zinc-500';
            default:
                return 'bg-gray-400 dark:bg-zinc-400';
        }
    };

    const fetchUserTasks = () => {
        const userId = user?.id;
        if (!userId || !tasks || tasks.length === 0) {
            setMyTasks([]);
            return;
        }
        
        const userTasks = tasks.filter((task) => task?.assigneeId === userId);
        setMyTasks(userTasks);
    }

    useEffect(() => {
        fetchUserTasks()
    }, [tasks, user])

    return (
        <div className="mt-6 px-3">
            <div onClick={toggleMyTasks} className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800" >
                <div className="flex items-center gap-2">
                    <CheckSquareIcon className="size-4 text-gray-700 dark:text-zinc-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">My Tasks</span>
                    <span className="bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 text-xs px-2 py-0.5 rounded-full">{myTasks.length}</span>
                </div>
                {showMyTasks ? <ChevronDownIcon className="size-4 text-gray-500 dark:text-zinc-400" /> : <ChevronRightIcon className="size-4 text-gray-500 dark:text-zinc-400" />}
            </div>
            {showMyTasks && (
                <div className="mt-2 space-y-1">
                    {myTasks.length === 0 ? (
                        <p className="text-xs text-gray-500 dark:text-zinc-400 px-3 py-2">No tasks assigned</p>
                    ) : (
                        myTasks.map((task) => (
                            <Link key={task.id} to={`/taskDetails?taskId=${task.id}&projectId=${task.projectId}`} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer group" >
                                <div className={`size-2 rounded-full ${getTaskStatusColor(task.status)}`} />
                                <span className="text-sm text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-white truncate flex-1">{task.title}</span>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default MyTasksSidebar

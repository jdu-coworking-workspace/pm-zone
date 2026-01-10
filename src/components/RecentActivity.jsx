import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

const RecentActivity = () => {

    const tasks = useSelector((state) => state.tasks?.items || []);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (tasks && tasks.length > 0) {
            // Get recent tasks (sorted by creation date)
            const recentTasks = [...tasks]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(task => ({
                    id: task.id,
                    action: `Task "${task.title}" was created`,
                    time: task.createdAt,
                    user: { name: "Team Member" }
                }));
            setActivities(recentTasks);
        }
    }, [tasks]);

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
            </h2>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-zinc-400">No recent activity</p>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Bell className="size-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {activity.action}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">
                                    {format(new Date(activity.time), "MMM d, h:mm a")}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;

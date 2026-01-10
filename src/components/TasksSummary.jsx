import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

const TasksSummary = () => {

    const tasks = useSelector((state) => state.tasks?.items || []);

    const todoTasks = tasks.filter((task) => task.status === "TODO").length;
    const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const doneTasks = tasks.filter((task) => task.status === "DONE").length;

    const summaryItems = [
        {
            icon: Clock,
            title: "To Do",
            count: todoTasks,
            color: "text-gray-600 dark:text-zinc-400",
            bgColor: "bg-gray-100 dark:bg-zinc-800",
        },
        {
            icon: AlertCircle,
            title: "In Progress",
            count: inProgressTasks,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-100 dark:bg-amber-500/20",
        },
        {
            icon: CheckCircle,
            title: "Done",
            count: doneTasks,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-500/20",
        },
    ];

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tasks Summary
            </h2>

            <div className="space-y-3">
                {summaryItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                                <item.icon className={`size-5 ${item.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                {item.title}
                            </span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksSummary;

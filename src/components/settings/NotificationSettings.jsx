import { useState, useEffect } from "react";
import { Save, Bell, Mail } from "lucide-react";
import toast from "react-hot-toast";
import userAPI from "../../api/endpoints/users";

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        browserNotifications: false,
        taskAssigned: true,
        taskCompleted: true,
        projectUpdates: true,
        teamInvites: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const preferences = await userAPI.getPreferences();
            setSettings({
                emailNotifications: preferences.emailNotifications,
                browserNotifications: preferences.browserNotifications,
                taskAssigned: preferences.taskAssigned,
                taskCompleted: preferences.taskCompleted,
                projectUpdates: preferences.projectUpdates,
                teamInvites: preferences.teamInvites,
            });
        } catch (error) {
            console.error('Failed to load preferences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await userAPI.updatePreferences(settings);
            toast.success("Notification preferences saved successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save preferences");
        } finally {
            setIsSubmitting(false);
        }
    };

    const Toggle = ({ checked, onChange }) => (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                checked ? "bg-blue-600" : "bg-gray-300 dark:bg-zinc-700"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    );

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="size-5 text-gray-500 dark:text-zinc-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">Receive email updates</p>
                        </div>
                    </div>
                    <Toggle
                        checked={settings.emailNotifications}
                        onChange={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                    />
                </div>

                {/* Browser Notifications */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="size-5 text-gray-500 dark:text-zinc-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Browser Notifications</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400">Get push notifications</p>
                        </div>
                    </div>
                    <Toggle
                        checked={settings.browserNotifications}
                        onChange={() => setSettings({...settings, browserNotifications: !settings.browserNotifications})}
                    />
                </div>

                <hr className="border-gray-200 dark:border-zinc-700" />

                {/* Notification Types */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notify me about</h3>
                    
                    {[
                        { key: "taskAssigned", label: "Tasks assigned to me" },
                        { key: "taskCompleted", label: "Task completions" },
                        { key: "projectUpdates", label: "Project updates" },
                        { key: "teamInvites", label: "Team invitations" },
                    ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                            <p className="text-sm text-gray-700 dark:text-zinc-300">{label}</p>
                            <Toggle
                                checked={settings[key]}
                                onChange={() => setSettings({...settings, [key]: !settings[key]})}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                        <Save className="size-4" />
                        {isSubmitting ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NotificationSettings;

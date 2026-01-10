import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import toast from "react-hot-toast";
import userAPI from "../../api/endpoints/users";

const AppearanceSettings = () => {
    const [theme, setTheme] = useState("system");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const preferences = await userAPI.getPreferences();
            setTheme(preferences.theme || "system");
        } catch (error) {
            console.error('Failed to load theme preference:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleThemeChange = async (newTheme) => {
        setTheme(newTheme);
        
        try {
            await userAPI.updatePreferences({ theme: newTheme });
            toast.success(`Theme changed to ${newTheme}`);
        } catch (error) {
            toast.error("Failed to save theme preference");
            console.error(error);
        }
    };

    const themes = [
        { id: "light", label: "Light", icon: Sun, description: "Light mode" },
        { id: "dark", label: "Dark", icon: Moon, description: "Dark mode" },
        { id: "system", label: "System", icon: Monitor, description: "Follows system preference" },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
                    Theme Preference
                </label>
                
                <div className="grid grid-cols-3 gap-4">
                    {themes.map(({ id, label, icon: Icon, description }) => (
                        <button
                            key={id}
                            onClick={() => handleThemeChange(id)}
                            disabled={isLoading}
                            className={`p-4 rounded-lg border-2 transition ${
                                theme === id
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                            }`}
                        >
                            <Icon className={`size-6 mx-auto mb-2 ${theme === id ? "text-blue-600" : "text-gray-500 dark:text-zinc-400"}`} />
                            <p className={`text-sm font-medium ${theme === id ? "text-blue-600" : "text-gray-900 dark:text-white"}`}>
                                {label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{description}</p>
                        </button>
                    ))}
                </div>

                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-4">
                    ℹ️ Theme changes will apply across all your devices
                </p>
            </div>
        </div>
    );
};

export default AppearanceSettings;

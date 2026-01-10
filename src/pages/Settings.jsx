import { useState } from "react";
import { User, Lock, Bell, Shield, Palette, Briefcase } from "lucide-react";
import ProfileSettings from "../components/settings/ProfileSettings";
import PasswordSettings from "../components/settings/PasswordSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import WorkspaceSettings from "../components/settings/WorkspaceSettings";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User, component: ProfileSettings },
        { id: "password", label: "Password", icon: Lock, component: PasswordSettings },
        { id: "workspace", label: "Workspace", icon: Briefcase, component: WorkspaceSettings },
        { id: "notifications", label: "Notifications", icon: Bell, component: NotificationSettings },
        { id: "security", label: "Security", icon: Shield, component: SecuritySettings },
        { id: "appearance", label: "Appearance", icon: Palette, component: AppearanceSettings },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
                    Manage your account, workspace, and preferences
                </p>
            </div>

            {/* Tabs and Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                                    activeTab === tab.id
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                        : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                }`}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </div>
        </div>
    );
};

export default Settings;

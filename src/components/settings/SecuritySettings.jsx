import { Shield, Key, Activity } from "lucide-react";
import toast from "react-hot-toast";

const SecuritySettings = () => {
    return (
        <div className="space-y-6">
            {/* Two-Factor Auth */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <Shield className="size-6 text-blue-600" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                            Add an extra layer of security to your account
                        </p>
                        <button
                            onClick={() => toast.info("2FA feature coming soon")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </div>

            {/* API Keys */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <Key className="size-6 text-purple-600" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            API Keys
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                            Manage API keys for integrations
                        </p>
                        <button
                            onClick={() => toast.info("API keys feature coming soon")}
                            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm"
                        >
                            Manage Keys
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <Activity className="size-6 text-green-600" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Active Sessions
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                            Manage your active sessions across devices
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Current Session</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400">Your current browser</p>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;

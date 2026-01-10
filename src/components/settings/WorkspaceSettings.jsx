import { useState } from "react";
import { Save, Trash2, Upload } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const WorkspaceSettings = () => {
    const { currentWorkspace } = useSelector((state) => state.workspaces);
    
    const [formData, setFormData] = useState({
        name: currentWorkspace?.name || "",
        image_url: currentWorkspace?.image_url || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: Implement workspace update API
            toast.info("Workspace update API not implemented yet");
        } catch (error) {
            toast.error("Failed to update workspace");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
            toast.info("Workspace deletion not implemented yet");
        }
    };

    return (
        <div className="space-y-6">
            {/* Workspace Info */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Workspace Settings</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Logo */}
                    <div className="flex items-center gap-6">
                        <img
                            src={formData.image_url}
                            alt="Workspace"
                            className="size-16 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-zinc-700"
                        />
                        <div>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition text-sm">
                                <Upload className="size-4" />
                                Change Logo
                            </label>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
                                Recommended: 256x256px
                            </p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                            Workspace Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                        >
                            <Save className="size-4" />
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-zinc-900 border border-red-300 dark:border-red-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                    Once you delete a workspace, there is no going back. Please be certain.
                </p>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    <Trash2 className="size-4" />
                    Delete Workspace
                </button>
            </div>
        </div>
    );
};

export default WorkspaceSettings;

import { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import userAPI from "../../api/endpoints/users";

const PasswordSettings = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        try {
            await userAPI.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            
            toast.success("Password updated successfully");
            
            // Clear form
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to change password");
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const PasswordInput = ({ label, field, value, onChange }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPasswords[field] ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                >
                    {showPasswords[field] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Change Password</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
                Update your password to keep your account secure
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <PasswordInput
                    label="Current Password"
                    field="current"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <PasswordInput
                    label="New Password"
                    field="new"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <PasswordInput
                    label="Confirm New Password"
                    field="confirm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                    >
                        <Save className="size-4" />
                        {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordSettings;

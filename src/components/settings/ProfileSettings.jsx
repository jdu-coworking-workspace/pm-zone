import { useState } from "react";
import { Save, Upload, User as UserIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import userAPI from "../../api/endpoints/users";
import { updateUser } from "../../features/authSlice";

const ProfileSettings = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updatedUser = await userAPI.updateProfile({
                name: formData.name,
                email: formData.email,
            });
            
            dispatch(updateUser(updatedUser));
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            toast.info("Image upload feature coming soon!");
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        {formData.image ? (
                            <img
                                src={formData.image}
                                alt="Profile"
                                className="size-20 rounded-full object-cover ring-2 ring-gray-200 dark:ring-zinc-700"
                            />
                        ) : (
                            <div className="size-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-zinc-700">
                                <UserIcon className="size-10 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="avatar-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition text-sm"
                        >
                            <Upload className="size-4" />
                            Upload Photo
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
                            JPG, PNG or GIF. Max size 5MB.
                        </p>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                        required
                    />
                </div>

                {/* User ID (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        User ID
                    </label>
                    <input
                        type="text"
                        value={user?.id || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        This is your unique identifier and cannot be changed.
                    </p>
                </div>

                {/* Save Button */}
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
    );
};

export default ProfileSettings;

import { useState, useRef, type ReactElement } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    FaUser,
    FaLock,
    FaCamera,
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationCircle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

type Tab = "profile" | "password" | "avatar";

const AdminProfile = () => {
    const { user, changePassword, uploadAvatar } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    // Avatar state
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwSubmitting, setPwSubmitting] = useState(false);

    // Shared feedback
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const showMsg = (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    // ── Avatar handlers ──────────────────────────────────────────────────────
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        setUploading(true);
        try {
            await uploadAvatar(avatarFile);
            showMsg("success", "Avatar updated successfully!");
            setAvatarFile(null);
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        } catch {
            showMsg("error", "Failed to upload avatar. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    // ── Password handler ─────────────────────────────────────────────────────
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showMsg("error", "New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            showMsg("error", "Password must be at least 6 characters.");
            return;
        }
        setPwSubmitting(true);
        try {
            await changePassword(oldPassword, newPassword);
            showMsg("success", "Password updated successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            showMsg("error", err?.response?.data?.message || "Failed to change password.");
        } finally {
            setPwSubmitting(false);
        }
    };

    const tabs: { id: Tab; label: string; icon: ReactElement }[] = [
        { id: "profile", label: "Profile Info", icon: <FaUser /> },
        { id: "avatar", label: "Change Avatar", icon: <FaCamera /> },
        { id: "password", label: "Change Password", icon: <FaLock /> },
    ];

    const displayAvatar = avatarPreview ?? user?.avatar;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                        My Profile
                    </h2>
                    <p className="text-gray-400 font-medium italic">
                        Manage your admin account credentials and appearance.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-100">
                    <FaShieldAlt className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                        Administrator Account
                    </span>
                </div>
            </div>

            {/* Global feedback */}
            {message && (
                <div
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-widest border ${
                        message.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-red-50 text-red-700 border-red-100"
                    }`}
                >
                    {message.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* ── Left: Identity card ── */}
                <div className="bg-black text-white p-8 flex flex-col items-center text-center gap-5">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-blue-600 flex items-center justify-center text-3xl font-black border-4 border-white/10 overflow-hidden">
                        {displayAvatar ? (
                            <img
                                src={displayAvatar}
                                alt="Admin avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                        )}
                    </div>

                    <div>
                        <p className="text-xl font-black tracking-tight">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">
                            {user?.email}
                        </p>
                    </div>

                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">
                        Administrator
                    </span>

                    {/* Tab nav */}
                    <nav className="w-full mt-4 space-y-1">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => { setActiveTab(t.id); setMessage(null); }}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all text-left ${
                                    activeTab === t.id
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <span className="text-base opacity-80">{t.icon}</span>
                                {t.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* ── Right: Content panel ── */}
                <div className="lg:col-span-3 bg-white border border-gray-100 shadow-sm">
                    {/* ── Profile Info ── */}
                    {activeTab === "profile" && (
                        <div className="p-10 space-y-8">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-1">
                                    Account <span className="text-blue-600">Information</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Your current profile details
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: "First Name", value: user?.firstName },
                                    { label: "Last Name", value: user?.lastName },
                                    { label: "Email Address", value: user?.email, full: true },
                                    { label: "Account Role", value: user?.role?.toUpperCase(), full: true },
                                    { label: "User ID", value: user?._id, full: true },
                                ].map((field) => (
                                    <div
                                        key={field.label}
                                        className={`space-y-2 ${field.full ? "md:col-span-2" : ""}`}
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                            {field.label}
                                        </p>
                                        <div className="px-5 py-4 bg-gray-50 border border-gray-100 font-bold text-gray-900 tracking-tight">
                                            {field.value || "—"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Change Avatar ── */}
                    {activeTab === "avatar" && (
                        <div className="p-10 space-y-8">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-1">
                                    Profile <span className="text-blue-600">Avatar</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Upload a new profile picture
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-10">
                                {/* Preview */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-36 h-36 bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center text-4xl font-black text-gray-400">
                                        {displayAvatar ? (
                                            <img
                                                src={displayAvatar}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaCamera />
                                        )}
                                    </div>
                                    {avatarPreview && (
                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1">
                                            Preview
                                        </span>
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="space-y-5 flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-3 px-6 py-3.5 bg-gray-100 border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-200 transition-all"
                                    >
                                        <FaCamera />
                                        Choose Image
                                    </button>

                                    {avatarFile && (
                                        <div className="p-4 bg-gray-50 border border-gray-100 space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Selected file
                                            </p>
                                            <p className="font-bold text-gray-900 text-sm tracking-tight truncate">
                                                {avatarFile.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {(avatarFile.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleAvatarUpload}
                                        disabled={!avatarFile || uploading}
                                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <FaCamera />
                                        {uploading ? "Uploading..." : "Save Avatar"}
                                    </button>

                                    <p className="text-[10px] text-gray-400 font-medium">
                                        Recommended: Square image, at least 200×200px. JPG or PNG.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Change Password ── */}
                    {activeTab === "password" && (
                        <div className="p-10 space-y-8">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-1">
                                    Change <span className="text-blue-600">Password</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Update your admin account password
                                </p>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                                {/* Current password */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showOld ? "text" : "password"}
                                            required
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full px-5 py-4 pr-12 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all"
                                            placeholder="Enter current password..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOld(!showOld)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                                        >
                                            {showOld ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* New password */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            required
                                            minLength={6}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-5 py-4 pr-12 bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold tracking-tight transition-all"
                                            placeholder="Enter new password..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                                        >
                                            {showNew ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>

                                    {/* Password strength bar */}
                                    {newPassword.length > 0 && (
                                        <div className="space-y-1 mt-2">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`flex-1 h-1 transition-all ${
                                                            newPassword.length >= level * 3
                                                                ? level <= 1
                                                                    ? "bg-red-500"
                                                                    : level === 2
                                                                    ? "bg-orange-400"
                                                                    : level === 3
                                                                    ? "bg-yellow-400"
                                                                    : "bg-emerald-500"
                                                                : "bg-gray-200"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                {newPassword.length < 4
                                                    ? "Too short"
                                                    : newPassword.length < 7
                                                    ? "Weak"
                                                    : newPassword.length < 10
                                                    ? "Fair"
                                                    : "Strong"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm password */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full px-5 py-4 pr-12 bg-gray-50 border focus:bg-white focus:outline-none focus:ring-4 font-bold tracking-tight transition-all ${
                                                confirmPassword && confirmPassword !== newPassword
                                                    ? "border-red-300 focus:ring-red-100"
                                                    : "border-gray-100 focus:ring-blue-100"
                                            }`}
                                            placeholder="Confirm new password..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                                        >
                                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {confirmPassword && confirmPassword !== newPassword && (
                                        <p className="text-[9px] font-black uppercase tracking-widest text-red-500 ml-1">
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={pwSubmitting}
                                    className="flex items-center gap-3 bg-black text-white px-8 py-4 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all disabled:opacity-50"
                                >
                                    <FaLock />
                                    {pwSubmitting ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

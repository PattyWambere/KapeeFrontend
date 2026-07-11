import { useState, useEffect } from "react";
import { FaSave, FaCog } from "react-icons/fa";
import settingsService from "../../api/settings.service";
import { useCurrency } from "../../context/CurrencyContext";

const ManageSettings = () => {
    const [threshold, setThreshold] = useState<number>(120);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const { symbol } = useCurrency();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsService.getSettings();
            if (data && data.freeShippingThreshold !== undefined) {
                setThreshold(data.freeShippingThreshold);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            setMessage({ text: "Failed to load settings.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            await settingsService.updateSettings({ freeShippingThreshold: threshold });
            setMessage({ text: "Settings saved successfully!", type: "success" });
        } catch (error) {
            console.error("Failed to save settings:", error);
            setMessage({ text: "Failed to save settings. Please try again.", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                Loading Settings...
            </div>
        );
    }

    return (
        <div className="space-y-12 max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Global Settings</h2>
                    <p className="text-gray-400 font-medium italic">Configure store-wide settings and thresholds.</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                        <FaCog size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Shipping & Cart</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manage threshold values</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-8 md:p-12">
                    {message && (
                        <div className={`mb-8 p-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Free Shipping Threshold ({symbol})
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={threshold}
                                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                className="w-full max-w-md px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 font-black text-lg tracking-tight transition-all"
                                placeholder="e.g. 150"
                            />
                            <p className="text-xs text-gray-500 ml-1">
                                Customers will get free shipping if their cart subtotal is equal to or exceeds this amount.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-3 bg-blue-600 text-white px-4 md:px-8 py-3 md:py-4 rounded-none text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-normal break-words"
                        >
                            <FaSave size={14} />
                            {saving ? "Saving..." : "Save Settings"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageSettings;

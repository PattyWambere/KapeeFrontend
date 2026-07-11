import { useState, useEffect } from "react";
import { FaCreditCard, FaTrash, FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import paymentService, { type PaymentMethod } from "../../api/payment.service";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripeKey = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Inner form for adding a new card
const AddCardForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Get SetupIntent client secret from backend
            const { clientSecret } = await paymentService.createSetupIntent();

            // 2. Confirm card setup with Stripe
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error("Card element not found");

            const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            if (setupIntent?.status === "succeeded") {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || "Failed to add card");
        } finally {
            setIsProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "14px",
                color: "#1f2937",
                fontFamily: "ui-monospace, 'Cascadia Code', 'Courier New', monospace",
                fontWeight: "700",
                letterSpacing: "0.08em",
                "::placeholder": { color: "#d1d5db" },
            },
            invalid: { color: "#ef4444" },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-6 bg-gray-50 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Add New Card</h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <FaTimes />
                </button>
            </div>

            <div className="bg-white border-2 border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3.5 transition-all duration-300 mb-4">
                <CardElement options={cardElementOptions} />
            </div>

            {error && <div className="text-red-500 text-sm mb-4 font-medium">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition w-full disabled:opacity-50"
            >
                {isProcessing ? "Adding..." : "Save Card"}
            </button>
        </form>
    );
};

const PaymentMethodsTab = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchMethods = async () => {
        try {
            setLoading(true);
            const data = await paymentService.getPaymentMethods();
            setMethods(data.paymentMethods);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to load payment methods");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to remove this card?")) return;
        try {
            await paymentService.deletePaymentMethod(id);
            await fetchMethods();
        } catch (err) {
            alert("Failed to remove card");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await paymentService.setDefaultPaymentMethod(id);
            await fetchMethods();
        } catch (err) {
            alert("Failed to set default card");
        }
    };

    if (error && error.includes("Stripe is not configured")) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
                <div className="p-4 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm">
                    Stripe is not configured. Saved cards are not available in simulated mode. Add Stripe API keys to .env to enable this feature.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Payment Methods</h2>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 text-sm font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                    >
                        <FaPlus size={10} /> Add Card
                    </button>
                )}
            </div>

            {showAddForm && stripePromise && (
                <Elements stripe={stripePromise}>
                    <AddCardForm
                        onCancel={() => setShowAddForm(false)}
                        onSuccess={() => {
                            setShowAddForm(false);
                            fetchMethods();
                        }}
                    />
                </Elements>
            )}

            {loading ? (
                <div className="py-8 text-center text-gray-500">Loading cards...</div>
            ) : methods.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                    <FaCreditCard className="mx-auto text-3xl text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No saved payment methods</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {methods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs capitalize shadow-sm">
                                    {method.brand === 'unknown' ? 'Card' : method.brand}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800 tracking-wider">
                                        •••• {method.last4}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                                        Expires {String(method.expMonth).padStart(2, '0')}/{method.expYear}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {method.isDefault ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                        <FaCheck size={10} /> Default
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleSetDefault(method.id)}
                                        className="text-xs font-bold text-gray-500 hover:text-blue-600 transition"
                                    >
                                        Make Default
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => handleDelete(method.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Remove Card"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentMethodsTab;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import {
    FaMinus, FaPlus, FaCreditCard, FaMoneyBill, FaLock, FaWifi, FaInfoCircle,
} from "react-icons/fa";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import orderService from "../api/order.service";
import paymentService, { type PaymentMethod } from "../api/payment.service";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

/* ─────────────────────────────────────────────────────────
   Stripe initialisation (null if key not configured)
───────────────────────────────────────────────────────── */
const stripeKey = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

/* ─────────────────────────────────────────────────────────
   Card brand helpers (used for the 3-D visual card)
───────────────────────────────────────────────────────── */
type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

function detectCardBrand(number: string): CardBrand {
    const c = number.replace(/\s/g, "");
    if (/^4/.test(c)) return "visa";
    if (/^5[1-5]/.test(c) || /^2[2-7]/.test(c)) return "mastercard";
    if (/^3[47]/.test(c)) return "amex";
    if (/^6(?:011|5)/.test(c)) return "discover";
    return "unknown";
}

function formatCardNumber(value: string, brand: CardBrand): string {
    const clean = value.replace(/\D/g, "");
    if (brand === "amex") {
        return [clean.slice(0, 4), clean.slice(4, 10), clean.slice(10, 15)]
            .filter(Boolean).join(" ");
    }
    return clean.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
    const clean = value.replace(/\D/g, "");
    return clean.length <= 2 ? clean : clean.slice(0, 2) + "/" + clean.slice(2, 4);
}

function getCardGradient(brand: CardBrand): string {
    switch (brand) {
        case "visa":       return "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)";
        case "mastercard": return "linear-gradient(135deg,#1a0000 0%,#2d0a00 50%,#1a0000 100%)";
        case "amex":       return "linear-gradient(135deg,#006747 0%,#007e5e 50%,#005a3c 100%)";
        case "discover":   return "linear-gradient(135deg,#f97316 0%,#ea580c 50%,#c2410c 100%)";
        default:           return "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)";
    }
}

/* ─────────────────────────────────────────────────────────
   Brand logo badge on virtual card
───────────────────────────────────────────────────────── */
const BrandLogo = ({ brand }: { brand: CardBrand }) => {
    if (brand === "visa")
        return <span style={{ fontFamily:"serif", fontSize:20, fontStyle:"italic", fontWeight:900, color:"#fff", textShadow:"0 1px 3px rgba(0,0,0,.3)", letterSpacing:"-0.05em" }}>VISA</span>;
    if (brand === "mastercard")
        return <div style={{ display:"flex" }}><div style={{ width:24, height:24, borderRadius:"50%", background:"#ef4444", opacity:.9, marginRight:-8 }} /><div style={{ width:24, height:24, borderRadius:"50%", background:"#f97316", opacity:.9 }} /></div>;
    if (brand === "amex")
        return <span style={{ color:"#fff", fontWeight:900, fontSize:11, letterSpacing:"0.2em" }}>AMEX</span>;
    if (brand === "discover")
        return <span style={{ color:"#fed7aa", fontWeight:900, fontSize:11, letterSpacing:"0.2em" }}>DISCOVER</span>;
    return <FaCreditCard style={{ color:"rgba(255,255,255,.4)", fontSize:20 }} />;
};

/* ─────────────────────────────────────────────────────────
   Stripe element shared style
───────────────────────────────────────────────────────── */
const stripeStyle = {
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

/* ─────────────────────────────────────────────────────────
   3-D Virtual Card Component
───────────────────────────────────────────────────────── */
interface VirtualCardProps {
    isFlipped: boolean;
    brand: CardBrand;
    displayNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    isStripeMode: boolean;
}

const VirtualCard = ({ isFlipped, brand, displayNumber, cardHolder, expiry, cvv, isStripeMode }: VirtualCardProps) => (
    <div style={{ width: "100%", maxWidth: 320, height: 192, perspective: 1000, margin: "0 auto" }}>
        <div style={{
            width: "100%", height: "100%", position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.7s cubic-bezier(.4,0,.2,1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}>
            {/* FRONT */}
            <div style={{
                position: "absolute", inset: 0, backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                background: getCardGradient(brand), borderRadius: 16, padding: 24,
                boxShadow: "0 25px 50px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.08)",
                overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
                <div style={{ position:"absolute", top:-30, right:-30, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,.05)" }} />
                <div style={{ position:"absolute", bottom:-50, left:-20, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.04)" }} />

                {/* Chip + brand */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative" }}>
                    <div style={{ width:44, height:32, background:"linear-gradient(135deg,#d4af37 0%,#f5d060 40%,#d4af37 100%)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,.3)" }}>
                        <div style={{ width:28, height:20, border:"1px solid rgba(0,0,0,.2)", borderRadius:3, background:"linear-gradient(135deg,#c8a83c 0%,#f0c040 100%)", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:2, padding:3 }}>
                            {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ background:"rgba(0,0,0,.15)", borderRadius:1 }} />)}
                        </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <FaWifi style={{ color:"rgba(255,255,255,.4)", fontSize:18, transform:"rotate(90deg)" }} />
                        <BrandLogo brand={brand} />
                    </div>
                </div>

                {/* Card number */}
                <div style={{ fontFamily:"'Courier New', monospace", fontSize:20, letterSpacing:4, color:"rgba(255,255,255,.95)", textShadow:"0 1px 3px rgba(0,0,0,.3)", position:"relative" }}>
                    {isStripeMode
                        ? <span style={{ color:"rgba(255,255,255,.4)", letterSpacing:6 }}>•••• •••• •••• ••••</span>
                        : displayNumber.padEnd(19, "#").split("").map((ch, i) => (
                            <span key={i} style={{ color: ch === "#" || ch === " " ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.95)" }}>{ch}</span>
                        ))
                    }
                </div>

                {/* Name + Expiry */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative" }}>
                    <div>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>Card Holder</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.9)", textTransform:"uppercase", letterSpacing:1, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {cardHolder || "FULL NAME"}
                        </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>Expires</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.9)", letterSpacing:1 }}>
                            {isStripeMode ? "MM/YY" : (expiry || "MM/YY")}
                        </div>
                    </div>
                </div>
            </div>

            {/* BACK */}
            <div style={{
                position:"absolute", inset:0, backfaceVisibility:"hidden",
                WebkitBackfaceVisibility:"hidden", transform:"rotateY(180deg)",
                background: getCardGradient(brand), borderRadius:16,
                boxShadow:"0 25px 50px rgba(0,0,0,.3), 0 0 0 1px rgba(255,255,255,.08)",
                overflow:"hidden", display:"flex", flexDirection:"column",
            }}>
                <div style={{ background:"rgba(0,0,0,.7)", height:44, marginTop:28 }} />
                <div style={{ padding:"16px 24px", display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
                    <div style={{ flex:1, background:"repeating-linear-gradient(-45deg,#f0ede8,#f0ede8 5px,#e8e4df 5px,#e8e4df 10px)", height:36, borderRadius:4, padding:"0 10px", display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                        <span style={{ fontFamily:"'Courier New', monospace", fontSize:16, fontStyle:"italic", color:"#333", letterSpacing:3 }}>
                            {isStripeMode ? "•••" : (cvv || "•••")}
                        </span>
                    </div>
                    <div style={{ background:"rgba(255,255,255,.1)", borderRadius:4, padding:"4px 10px", fontSize:10, color:"rgba(255,255,255,.7)", fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>CVV</div>
                </div>
                <div style={{ padding:"0 24px", display:"flex", justifyContent:"flex-end" }}>
                    <BrandLogo brand={brand} />
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────
   INNER CHECKOUT FORM (uses Stripe hooks)
───────────────────────────────────────────────────────── */
const CheckoutInner = () => {
    const { cartItems, subtotal, clearCart, updateQuantity } = useCart();
    const { convertPrice } = useCurrency();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const isStripeMode = !!stripeKey && !!stripe;

    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMode, setPaymentMode] = useState<"cod" | "card">("cod");
    const [isFlipped, setIsFlipped] = useState(false);
    const [stripeError, setStripeError] = useState<string | null>(null);

    /* — Saved Cards State — */
    const [savedCards, setSavedCards] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("new");

    useEffect(() => {
        if (isStripeMode) {
            paymentService.getPaymentMethods().then((res) => {
                setSavedCards(res.paymentMethods);
                if (res.defaultPaymentMethodId && res.paymentMethods.some(m => m.id === res.defaultPaymentMethodId)) {
                    setSelectedPaymentMethodId(res.defaultPaymentMethodId);
                } else if (res.paymentMethods.length > 0) {
                    setSelectedPaymentMethodId(res.paymentMethods[0].id);
                }
            }).catch(console.error);
        }
    }, [isStripeMode]);

    /* — Simulated card state (only used when no Stripe key) — */
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

    /* — Billing form — */
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", companyName: "",
        country: "Rwanda", streetAddress: "", apartment: "",
        city: "", state: "", zipCode: "", phone: "", email: "", orderNotes: "",
    });

    const cardBrand = isStripeMode ? "unknown" : detectCardBrand(cardNumber);
    const formattedNumber = formatCardNumber(cardNumber, cardBrand);
    const displayNumber = formattedNumber || "#### #### #### ####";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /* — Simulated card handlers — */
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const brand = detectCardBrand(e.target.value);
        const formatted = formatCardNumber(e.target.value, brand);
        if (formatted.length <= (brand === "amex" ? 17 : 19)) setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = formatExpiry(e.target.value);
        if (f.length <= 5) setExpiry(f);
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const max = cardBrand === "amex" ? 4 : 3;
        setCvv(e.target.value.replace(/\D/g, "").slice(0, max));
    };

    const validateSimulatedCard = () => {
        const errors: Record<string, string> = {};
        const raw = cardNumber.replace(/\s/g, "");
        const minLen = cardBrand === "amex" ? 15 : 16;
        if (raw.length < minLen) errors.cardNumber = `Must be ${minLen} digits`;
        if (!cardHolder.trim()) errors.cardHolder = "Cardholder name is required";
        if (expiry.length < 5) errors.expiry = "Invalid expiry (MM/YY)";
        else {
            const [mm, yy] = expiry.split("/").map(Number);
            if (mm < 1 || mm > 12 || new Date(2000 + yy, mm - 1) < new Date()) errors.expiry = "Card expired";
        }
        const cvvLen = cardBrand === "amex" ? 4 : 3;
        if (cvv.length < cvvLen) errors.cvv = `CVV must be ${cvvLen} digits`;
        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /* ── Main submit handler ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStripeError(null);
        setIsProcessing(true);

        try {
            if (paymentMode === "card") {
                if (isStripeMode) {
                    /* ── Real Stripe payment flow ── */
                    
                    if (selectedPaymentMethodId !== "new") {
                        // Use saved card
                        const { clientSecret, status } = await orderService.createPaymentIntent({
                            paymentMethodId: selectedPaymentMethodId
                        });

                        let piId = "";
                        
                        if (status === "succeeded") {
                            // Payment confirmed immediately
                        } else {
                            // Confirm payment with Stripe (if it needs action, e.g. 3DS)
                            const { paymentIntent, error: piError } = await stripe!.confirmCardPayment(clientSecret);
                            if (piError || !paymentIntent || paymentIntent.status !== "succeeded") {
                                setStripeError(piError?.message ?? "Payment was not completed.");
                                return;
                            }
                            piId = paymentIntent.id;
                        }

                        const selectedMethod = savedCards.find(c => c.id === selectedPaymentMethodId);
                        const paymentDetails = {
                            cardType: selectedMethod?.brand ?? "card",
                            last4: selectedMethod?.last4 ?? "****",
                            transactionId: piId,
                        };
                        const order = await orderService.createOrder("card", paymentDetails);
                        await clearCart();
                        navigate("/order-complete", { state: { order } });

                    } else {
                        // Use new card
                        const cardNumberElement = elements!.getElement(CardNumberElement);
                        if (!cardNumberElement) throw new Error("Card element not loaded.");

                        // 1. Get PaymentIntent client secret from backend
                        const { clientSecret } = await orderService.createPaymentIntent();

                        // 2. Create PaymentMethod to get brand + last4
                        const { paymentMethod, error: pmError } = await stripe!.createPaymentMethod({
                            type: "card",
                            card: cardNumberElement,
                            billing_details: { name: cardHolder || undefined },
                        });
                        if (pmError || !paymentMethod) {
                            setStripeError(pmError?.message ?? "Failed to process card.");
                            return;
                        }

                        // 3. Confirm payment with Stripe
                        const { paymentIntent, error: piError } = await stripe!.confirmCardPayment(clientSecret, {
                            payment_method: paymentMethod.id,
                        });
                        if (piError || !paymentIntent || paymentIntent.status !== "succeeded") {
                            setStripeError(piError?.message ?? "Payment was not completed.");
                            return;
                        }

                        // 4. Create order on backend with payment details
                        const paymentDetails = {
                            cardType: paymentMethod.card?.brand ?? "card",
                            last4: paymentMethod.card?.last4 ?? "****",
                            transactionId: paymentIntent.id,
                        };
                        const order = await orderService.createOrder("card", paymentDetails);
                        await clearCart();
                        navigate("/order-complete", { state: { order } });
                    }

                } else {
                    /* ── Simulated card flow (no Stripe key) ── */
                    if (!validateSimulatedCard()) return;
                    const raw = cardNumber.replace(/\s/g, "");
                    const paymentDetails = {
                        cardType: cardBrand,
                        last4: raw.slice(-4),
                        transactionId: `SIM-${Date.now()}`,
                    };
                    const order = await orderService.createOrder("card", paymentDetails);
                    await clearCart();
                    navigate("/order-complete", { state: { order } });
                }
            } else {
                /* ── Cash on Delivery ── */
                const order = await orderService.createOrder("cod");
                await clearCart();
                navigate("/order-complete", { state: { order } });
            }
        } catch (error: any) {
            console.error("Order failed:", error);
            const msg = error.response?.data?.message || error.message || "Failed to place order.";
            alert(msg);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-white min-h-screen">
                <CheckoutSteps currentStep={2} />
                <div className="text-center py-20 px-4">
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Your cart is empty.</h2>
                    <p className="text-gray-500 mb-8 font-medium">Add items before checking out.</p>
                    <Link to="/shop" className="bg-orange-500 text-white px-12 py-4 rounded-xl font-black hover:bg-black transition-all duration-300 uppercase tracking-widest text-xs">
                        Return To Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            <CheckoutSteps currentStep={2} />

            <div className="max-w-7xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* ── Billing Details (left) ── */}
                    <div className="lg:col-span-7">
                        <h2 className="text-[26px] font-bold mb-8 text-gray-800">Billing details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">First name <span className="text-red-500">*</span></label>
                                <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange}
                                    className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last name <span className="text-red-500">*</span></label>
                                <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange}
                                    className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Company name (optional)</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Country / Region <span className="text-red-500">*</span></label>
                            <select name="country" value={formData.country} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors">
                                <option>Rwanda</option>
                                <option>United States (US)</option>
                                <option>United Kingdom (UK)</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Street address <span className="text-red-500">*</span></label>
                            <input type="text" name="streetAddress" required placeholder="House number and street name" value={formData.streetAddress} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors mb-4" />
                            <input type="text" name="apartment" placeholder="Apartment, suite, unit (optional)" value={formData.apartment} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Town / City <span className="text-red-500">*</span></label>
                            <input type="text" name="city" required value={formData.city} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Postcode / ZIP <span className="text-red-500">*</span></label>
                            <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                        </div>

                        <div className="mb-10">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email address <span className="text-red-500">*</span></label>
                            <input type="email" name="email" required value={formData.email} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-2.5 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors" />
                        </div>

                        <div className="mb-8 flex items-center gap-2">
                            <input type="checkbox" id="shipDifferent" className="w-4 h-4 accent-blue-600" />
                            <label htmlFor="shipDifferent" className="text-sm font-bold text-gray-700">Ship to a different address?</label>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Order notes (optional)</label>
                            <textarea name="orderNotes" rows={5} placeholder="Notes about your order…" value={formData.orderNotes} onChange={handleInputChange}
                                className="w-full border border-gray-200 px-4 py-4 outline-none text-sm text-gray-600 focus:border-blue-600 transition-colors resize-none" />
                        </div>
                    </div>

                    {/* ── Order Summary + Payment (right) ── */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 border-[2px] border-gray-100 flex flex-col h-fit sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8">Your order</h2>

                            {/* Product list */}
                            <div className="flex justify-between border-b-2 border-gray-100 pb-3 mb-6">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">PRODUCT</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SUBTOTAL</span>
                            </div>
                            <div className="space-y-6 mb-8">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                        <div className="flex gap-4">
                                            <img src={item.image || item.images?.[0] || "/images/placeholder.png"} alt={item.name || item.title} className="w-14 h-16 object-cover" />
                                            <div className="space-y-2">
                                                <span className="text-xs font-medium text-gray-600 leading-tight block max-w-[180px]">
                                                    {item.name || item.title} <span className="text-gray-400">× {item.quantity}</span>
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                                                        className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                                                        <FaMinus size={8} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-medium bg-gray-50 py-1">{item.quantity}</span>
                                                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                                                        <FaPlus size={8} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-bold text-blue-600 text-sm whitespace-nowrap">{convertPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-4 py-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">Subtotal</span>
                                    <span className="text-blue-600 font-bold">{convertPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">Shipping</span>
                                    <span className="text-gray-800">Free shipping</span>
                                </div>
                                <div className="pt-4 flex justify-between border-t border-gray-100">
                                    <span className="text-sm font-bold text-gray-700">Total</span>
                                    <span className="text-blue-600 font-bold text-lg">{convertPrice(total)}</span>
                                </div>
                            </div>

                            {/* ── Payment method selector ── */}
                            <div className="mt-8 mb-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 mb-4">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(["cod", "card"] as const).map(mode => (
                                        <button key={mode} type="button" onClick={() => { setPaymentMode(mode); setStripeError(null); }}
                                            className={`flex items-center justify-center gap-2 py-3 px-4 border-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${paymentMode === mode
                                                ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md shadow-blue-100"
                                                : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                                            {mode === "cod" ? <FaMoneyBill size={14} /> : <FaCreditCard size={14} />}
                                            {mode === "cod" ? "Cash on Delivery" : "Credit / Debit Card"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── COD notice ── */}
                            {paymentMode === "cod" && (
                                <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                                    <FaInfoCircle className="text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                        Pay with cash upon delivery. Please have the exact amount ready for the courier.
                                    </p>
                                </div>
                            )}

                            {/* ── Card payment section ── */}
                            {paymentMode === "card" && (
                                <div className="mb-6">
                                
                                    {/* Saved Cards Selection */}
                                    {savedCards.length > 0 && (
                                        <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                            <div className="bg-white px-4 py-3 border-b border-gray-200">
                                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Saved Cards</h4>
                                            </div>
                                            <div className="divide-y divide-gray-200">
                                                {savedCards.map(card => (
                                                    <label key={card.id} className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${selectedPaymentMethodId === card.id ? "bg-blue-50/50" : "hover:bg-gray-100"}`}>
                                                        <input 
                                                            type="radio" 
                                                            name="paymentMethodId" 
                                                            value={card.id} 
                                                            checked={selectedPaymentMethodId === card.id}
                                                            onChange={() => setSelectedPaymentMethodId(card.id)}
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[10px] capitalize shadow-sm">
                                                            {card.brand === 'unknown' ? 'Card' : card.brand}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-gray-800 tracking-wider text-sm">•••• {card.last4}</div>
                                                            <div className="text-[10px] text-gray-500 font-medium">Expires {String(card.expMonth).padStart(2, '0')}/{card.expYear}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                                <label className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${selectedPaymentMethodId === "new" ? "bg-blue-50/50" : "hover:bg-gray-100"}`}>
                                                    <input 
                                                        type="radio" 
                                                        name="paymentMethodId" 
                                                        value="new" 
                                                        checked={selectedPaymentMethodId === "new"}
                                                        onChange={() => setSelectedPaymentMethodId("new")}
                                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <div className="text-sm font-bold text-gray-700">Use a new card</div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* New Card Form */}
                                    {selectedPaymentMethodId === "new" && (
                                        <div className="space-y-6">
                                            {/* 3-D Virtual Card preview */}
                                            <div className="mb-6">
                                        <VirtualCard
                                            isFlipped={isFlipped}
                                            brand={cardBrand}
                                            displayNumber={displayNumber}
                                            cardHolder={cardHolder}
                                            expiry={expiry}
                                            cvv={cvv}
                                            isStripeMode={isStripeMode}
                                        />
                                    </div>

                                    {/* Stripe mode badge */}
                                    {isStripeMode && (
                                        <div className="flex items-center justify-center gap-2 mb-5">
                                            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5">
                                                <FaLock className="text-indigo-500" size={10} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                                    Secured by Stripe
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card inputs */}
                                    <div className="space-y-4">
                                        {/* Cardholder name (always a regular input) */}
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">Cardholder Name</label>
                                            <input
                                                id="card-holder"
                                                type="text"
                                                placeholder="JOHN SMITH"
                                                value={cardHolder}
                                                onChange={e => setCardHolder(e.target.value.toUpperCase())}
                                                onFocus={() => setIsFlipped(false)}
                                                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none transition-all duration-300 uppercase"
                                            />
                                        </div>

                                        {isStripeMode ? (
                                            /* ─── Stripe hosted elements ─── */
                                            <>
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">Card Number</label>
                                                    <div className="border-2 border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3.5 transition-all duration-300">
                                                        <CardNumberElement
                                                            options={stripeStyle}
                                                            onFocus={() => setIsFlipped(false)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">Expiry Date</label>
                                                        <div className="border-2 border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3.5 transition-all duration-300">
                                                            <CardExpiryElement
                                                                options={stripeStyle}
                                                                onFocus={() => setIsFlipped(false)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">CVV / CVC</label>
                                                        <div className="border-2 border-gray-200 focus-within:border-blue-500 rounded-xl px-4 py-3.5 transition-all duration-300">
                                                            <CardCvcElement
                                                                options={stripeStyle}
                                                                onFocus={() => setIsFlipped(true)}
                                                                onBlur={() => setIsFlipped(false)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* ─── Simulated card inputs (no Stripe key) ─── */
                                            <>
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">Card Number</label>
                                                    <div className="relative">
                                                        <input
                                                            id="card-number"
                                                            type="text"
                                                            inputMode="numeric"
                                                            placeholder="1234 5678 9012 3456"
                                                            value={cardNumber}
                                                            onChange={handleCardNumberChange}
                                                            onFocus={() => setIsFlipped(false)}
                                                            className={`w-full border-2 ${cardErrors.cardNumber ? "border-red-400" : "border-gray-200 focus:border-blue-500"} rounded-xl px-4 py-3 text-sm font-mono font-bold text-gray-800 outline-none transition-all duration-300 tracking-widest`}
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <FaCreditCard className={`text-lg ${cardBrand !== "unknown" ? "text-blue-500" : "text-gray-300"}`} />
                                                        </div>
                                                    </div>
                                                    {cardErrors.cardNumber && <p className="text-red-500 text-xs mt-1 font-medium">{cardErrors.cardNumber}</p>}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">Expiry Date</label>
                                                        <input
                                                            id="card-expiry"
                                                            type="text"
                                                            placeholder="MM/YY"
                                                            value={expiry}
                                                            onChange={handleExpiryChange}
                                                            onFocus={() => setIsFlipped(false)}
                                                            inputMode="numeric"
                                                            className={`w-full border-2 ${cardErrors.expiry ? "border-red-400" : "border-gray-200 focus:border-blue-500"} rounded-xl px-4 py-3 text-sm font-mono font-bold text-gray-800 outline-none transition-all duration-300 tracking-widest`}
                                                        />
                                                        {cardErrors.expiry && <p className="text-red-500 text-xs mt-1 font-medium">{cardErrors.expiry}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">CVV / CVC</label>
                                                        <input
                                                            id="card-cvv"
                                                            type="text"
                                                            placeholder={cardBrand === "amex" ? "••••" : "•••"}
                                                            value={cvv}
                                                            onChange={handleCvvChange}
                                                            onFocus={() => setIsFlipped(true)}
                                                            onBlur={() => setIsFlipped(false)}
                                                            inputMode="numeric"
                                                            className={`w-full border-2 ${cardErrors.cvv ? "border-red-400" : "border-gray-200 focus:border-blue-500"} rounded-xl px-4 py-3 text-sm font-mono font-bold text-gray-800 outline-none transition-all duration-300 tracking-widest`}
                                                        />
                                                        {cardErrors.cvv && <p className="text-red-500 text-xs mt-1 font-medium">{cardErrors.cvv}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 mt-4">
                                                    <FaInfoCircle className="text-amber-400 flex-shrink-0" />
                                                    <span>Demo mode — add <code className="font-mono text-amber-700">VITE_STRIPE_PUBLISHABLE_KEY</code> to <code className="font-mono text-amber-700">.env</code> for real payments.</span>
                                                </div>
                                            </>
                                        )}

                                        {/* Stripe error message */}
                                        {stripeError && (
                                            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                                <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
                                                <p className="text-xs text-red-600 font-bold">{stripeError}</p>
                                            </div>
                                        )}

                                        {/* Security badge */}
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                            <FaLock className="text-green-500 flex-shrink-0" />
                                            <span>Your card details are encrypted and never stored on our servers.</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                                </div>
                            )}

                            {/* ── Privacy + submit ── */}
                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                <p className="text-[12px] text-gray-500 leading-snug">
                                    Your personal data will be used to process your order and is protected by our{" "}
                                    <button type="button" className="text-blue-600 hover:underline">privacy policy</button>.
                                </p>

                                <button
                                    type="submit"
                                    disabled={isProcessing || (paymentMode === "card" && isStripeMode && !stripe)}
                                    className={`w-full font-bold py-4 transition-all duration-300 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg
                                        ${paymentMode === "card" ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200" : "bg-[#ff6b20] hover:bg-orange-400 text-white shadow-orange-200"}
                                        ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {paymentMode === "card" ? "PROCESSING PAYMENT..." : "PLACING ORDER..."}
                                        </>
                                    ) : (
                                        <>
                                            {paymentMode === "card" ? <FaLock size={11} /> : <FaMoneyBill size={11} />}
                                            {paymentMode === "card" ? `PAY $${total.toFixed(2)}` : "PLACE ORDER"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   OUTER WRAPPER — provides Stripe Elements context
───────────────────────────────────────────────────────── */
const Checkout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutInner />
    </Elements>
);

export default Checkout;

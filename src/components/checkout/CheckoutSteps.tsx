import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

interface CheckoutStepsProps {
    currentStep: number;
}

const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
    const steps = [
        { id: 1, name: "Shopping Cart", path: "/cart" },
        { id: 2, name: "Checkout", path: "/checkout" },
        { id: 3, name: "Order Complete", path: "/order-complete" },
    ];

    return (
        <div className="border-b border-gray-100 mb-12">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 text-center">
                <div className="flex items-center justify-center gap-2 md:gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 md:gap-4">
                            <Link
                                to={step.id < currentStep ? step.path : "#"}
                                className={`${step.id === currentStep
                                        ? "text-gray-900"
                                        : step.id < currentStep
                                            ? "text-blue-600 hover:text-black transition-colors"
                                            : "text-gray-300 cursor-default"
                                    }`}
                                onClick={(e) => step.id >= currentStep && e.preventDefault()}
                            >
                                {step.id}. {step.name}
                            </Link>
                            {index < steps.length - 1 && (
                                <FaChevronRight
                                    size={8}
                                    className={`${step.id < currentStep ? "text-blue-600" : "text-gray-300"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CheckoutSteps;

import { Check } from "lucide-react";
import type { CheckoutStep } from "@/pages/Checkout";

interface ProgressIndicatorProps {
  currentStep: CheckoutStep;
}

const steps = [
  { number: 1, label: "Delivery Address" },
  { number: 2, label: "Payment Method" },
  { number: 3, label: "Order Confirmation" },
];

export const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep > step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "border-primary text-primary bg-background"
                    : "border-muted text-muted-foreground bg-background"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm font-medium ${
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 transition-colors ${
                  currentStep > step.number
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

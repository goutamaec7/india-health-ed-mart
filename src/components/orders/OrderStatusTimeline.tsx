import { format } from "date-fns";
import { Check, Circle, Package, Truck, CheckCircle2 } from "lucide-react";

interface OrderStatusTimelineProps {
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function OrderStatusTimeline({
  status,
  createdAt,
  updatedAt,
}: OrderStatusTimelineProps) {
  const steps = [
    {
      key: "confirmed",
      label: "Order Confirmed",
      icon: Check,
      description: "We've received your order",
    },
    {
      key: "processing",
      label: "Processing",
      icon: Package,
      description: "Your order is being prepared",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: Truck,
      description: "Your order is on the way",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: CheckCircle2,
      description: "Order has been delivered",
    },
  ];

  const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentIndex = statusOrder.indexOf(status);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const getStepDate = (stepKey: string) => {
    if (stepKey === "confirmed") {
      return format(new Date(createdAt), "MMM dd, hh:mm a");
    }
    if (statusOrder.indexOf(stepKey) <= currentIndex) {
      return format(new Date(updatedAt), "MMM dd, hh:mm a");
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(index);
        const Icon = step.icon;
        const date = getStepDate(step.key);

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  stepStatus === "completed"
                    ? "bg-primary border-primary text-primary-foreground"
                    : stepStatus === "current"
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {stepStatus === "completed" ? (
                  <Check className="h-5 w-5" />
                ) : stepStatus === "current" ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    stepStatus === "completed"
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-6">
              <p
                className={`font-semibold ${
                  stepStatus === "current" ? "text-primary" : ""
                }`}
              >
                {step.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
              {date && (
                <p className="text-xs text-muted-foreground mt-1">{date}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { calculatePasswordStrength, checkPasswordRequirements } from "@/lib/validation/password";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;
  
  const strength = calculatePasswordStrength(password);
  const requirements = checkPasswordRequirements(password);
  const progressValue = (strength.score / 5) * 100;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength:</span>
          <span className="font-medium" style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className="h-2"
          style={{
            '--progress-background': strength.color,
          } as any}
        />
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <RequirementItem
          met={requirements.minLength}
          text="At least 8 characters"
        />
        <RequirementItem
          met={requirements.hasUppercase}
          text="One uppercase letter"
        />
        <RequirementItem
          met={requirements.hasLowercase}
          text="One lowercase letter"
        />
        <RequirementItem
          met={requirements.hasNumber}
          text="One number"
        />
      </div>
    </div>
  );
};

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="h-3.5 w-3.5 text-green-600" />
    ) : (
      <X className="h-3.5 w-3.5 text-muted-foreground" />
    )}
    <span className={met ? "text-green-600" : "text-muted-foreground"}>
      {text}
    </span>
  </div>
);

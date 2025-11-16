import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { signUp } from "@/lib/api";
import { isValidEmail, isValidPhone, isValidGSTIN, isValidFullName } from "@/lib/validation/form";
import { isPasswordValid } from "@/lib/validation/password";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Building2, User } from "lucide-react";

const organizationTypes = [
  { value: "hospital", label: "Hospital" },
  { value: "clinic", label: "Clinic" },
  { value: "diagnostic_center", label: "Diagnostic Center" },
  { value: "school", label: "School" },
  { value: "college", label: "College" },
  { value: "university", label: "University" },
  { value: "research_institute", label: "Research Institute" },
];

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'individual' | 'institution'>('individual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationType: "",
    gstin: "",
    acceptTerms: false,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!isValidFullName(formData.fullName)) {
      newErrors.fullName = "Please enter a valid name (letters only)";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian mobile number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password = "Password does not meet requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Institution-specific validation
    if (userType === 'institution') {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = "Organization name is required";
      }

      if (!formData.organizationType) {
        newErrors.organizationType = "Please select organization type";
      }

      if (formData.gstin && !isValidGSTIN(formData.gstin)) {
        newErrors.gstin = "Please enter a valid GSTIN (e.g., 29ABCDE1234F1Z5)";
      }
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear general error
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signUp({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        userType,
        organizationName: userType === 'institution' ? formData.organizationName.trim() : undefined,
        organizationType: userType === 'institution' ? formData.organizationType as any : undefined,
        gstin: userType === 'institution' && formData.gstin ? formData.gstin.toUpperCase() : undefined,
      });

      toast.success("Registration successful! Check your email to verify your account.");
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err: any) {
      console.error("Registration error:", err);
      
      // Handle specific error cases
      if (err.message?.includes("already registered")) {
        setErrors({ email: "This email is already registered" });
        setError("An account with this email already exists. Please login instead.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-healthcare-light/20 to-educational-light/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Create Your Account
            </h1>
            <p className="text-lg text-muted-foreground">
              Join India's trusted platform for healthcare and educational supplies
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
              <CardDescription>
                Choose your account type and fill in your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Tabs value={userType} onValueChange={(v) => setUserType(v as any)} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual" className="gap-2">
                      <User className="h-4 w-4" />
                      Individual
                    </TabsTrigger>
                    <TabsTrigger value="institution" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      Institution
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="individual" className="space-y-4 mt-6">
                    <IndividualForm
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                    />
                  </TabsContent>

                  <TabsContent value="institution" className="space-y-4 mt-6">
                    <InstitutionForm
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                    />
                  </TabsContent>
                </Tabs>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I accept the{" "}
                      <a href="/terms" className="text-primary underline">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-sm text-destructive">{errors.acceptTerms}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading || !formData.acceptTerms}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate("/login")}
                      type="button"
                    >
                      Login here
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Individual form fields component
const IndividualForm = ({ formData, errors, onChange }: any) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="fullName">Full Name *</Label>
      <Input
        id="fullName"
        placeholder="John Doe"
        value={formData.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        className={errors.fullName ? "border-destructive" : ""}
      />
      {errors.fullName && (
        <p className="text-sm text-destructive">{errors.fullName}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email Address *</Label>
      <Input
        id="email"
        type="email"
        placeholder="john@example.com"
        value={formData.email}
        onChange={(e) => onChange("email", e.target.value)}
        className={errors.email ? "border-destructive" : ""}
      />
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number *</Label>
      <Input
        id="phone"
        placeholder="9876543210"
        value={formData.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        maxLength={10}
        className={errors.phone ? "border-destructive" : ""}
      />
      {errors.phone && (
        <p className="text-sm text-destructive">{errors.phone}</p>
      )}
      <p className="text-xs text-muted-foreground">Enter 10-digit mobile number</p>
    </div>

    <div className="space-y-2">
      <Label htmlFor="password">Password *</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => onChange("password", e.target.value)}
        className={errors.password ? "border-destructive" : ""}
      />
      {errors.password && (
        <p className="text-sm text-destructive">{errors.password}</p>
      )}
      <PasswordStrengthIndicator password={formData.password} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm Password *</Label>
      <Input
        id="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={(e) => onChange("confirmPassword", e.target.value)}
        className={errors.confirmPassword ? "border-destructive" : ""}
      />
      {errors.confirmPassword && (
        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
      )}
    </div>
  </>
);

// Institution form fields component
const InstitutionForm = ({ formData, errors, onChange }: any) => (
  <>
    <IndividualForm formData={formData} errors={errors} onChange={onChange} />

    <div className="pt-4 border-t border-border">
      <h3 className="font-semibold text-foreground mb-4">Organization Details</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization Name *</Label>
          <Input
            id="organizationName"
            placeholder="City Hospital"
            value={formData.organizationName}
            onChange={(e) => onChange("organizationName", e.target.value)}
            className={errors.organizationName ? "border-destructive" : ""}
          />
          {errors.organizationName && (
            <p className="text-sm text-destructive">{errors.organizationName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationType">Organization Type *</Label>
          <Select
            value={formData.organizationType}
            onValueChange={(value) => onChange("organizationType", value)}
          >
            <SelectTrigger className={errors.organizationType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizationType && (
            <p className="text-sm text-destructive">{errors.organizationType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstin">GST Number (Optional)</Label>
          <Input
            id="gstin"
            placeholder="29ABCDE1234F1Z5"
            value={formData.gstin}
            onChange={(e) => onChange("gstin", e.target.value.toUpperCase())}
            maxLength={15}
            className={errors.gstin ? "border-destructive" : ""}
          />
          {errors.gstin && (
            <p className="text-sm text-destructive">{errors.gstin}</p>
          )}
          <p className="text-xs text-muted-foreground">15-character GST Identification Number</p>
        </div>
      </div>
    </div>
  </>
);

export default Register;

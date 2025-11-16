import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";

export function DashboardProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    user_type: "individual" as "individual" | "institution",
    organization_name: "",
    organization_type: "",
    gstin: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        user_type: profile.user_type || "individual",
        organization_name: profile.organization_name || "",
        organization_type: profile.organization_type || "",
        gstin: profile.gstin || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
        full_name: formData.full_name,
        phone: formData.phone,
        user_type: formData.user_type,
        organization_name:
          formData.user_type === "institution" ? formData.organization_name : null,
        organization_type:
          formData.user_type === "institution" && formData.organization_type
            ? formData.organization_type as any
            : null,
        gstin: formData.gstin || null,
        })
        .eq("id", user?.id);

      if (error) throw error;

      await refreshProfile();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                disabled={!isEditing}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                placeholder="10-digit phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_type">User Type</Label>
              <Input
                id="user_type"
                value={formData.user_type === "individual" ? "Individual" : "Institution"}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                User type cannot be changed
              </p>
            </div>

            {formData.user_type === "institution" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organization_name">Organization Name</Label>
                  <Input
                    id="organization_name"
                    value={formData.organization_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization_name: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization_type">Organization Type</Label>
                  <Select
                    value={formData.organization_type || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, organization_type: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="diagnostic_center">
                        Diagnostic Center
                      </SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="research_institute">
                        Research Institute
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="gstin">GST Number (Optional)</Label>
              <Input
                id="gstin"
                value={formData.gstin}
                onChange={(e) =>
                  setFormData({ ...formData, gstin: e.target.value })
                }
                disabled={!isEditing}
                placeholder="Enter GST number if applicable"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setFormData({
                      full_name: profile.full_name || "",
                      phone: profile.phone || "",
                      user_type: profile.user_type || "individual",
                      organization_name: profile.organization_name || "",
                      organization_type: profile.organization_type || "",
                      gstin: profile.gstin || "",
                    });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

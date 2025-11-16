import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardSavedItems } from "@/components/dashboard/DashboardSavedItems";
import { DashboardAddresses } from "@/components/dashboard/DashboardAddresses";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";
import { DashboardSettings } from "@/components/dashboard/DashboardSettings";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Manage your account, orders, and preferences
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders" onClick={() => navigate("/orders")}>
              Orders
            </TabsTrigger>
            <TabsTrigger value="saved">Saved Items</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="saved">
            <DashboardSavedItems />
          </TabsContent>

          <TabsContent value="addresses">
            <DashboardAddresses />
          </TabsContent>

          <TabsContent value="profile">
            <DashboardProfile />
          </TabsContent>

          <TabsContent value="settings">
            <DashboardSettings />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

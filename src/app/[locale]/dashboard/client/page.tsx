import ClientDashboard from "@/src/components/ClientDashboard";
import AuthGuard from "@/src/components/AuthGuard";

export default function ClientDashboardPage() {
  return (
    <AuthGuard requiredRole="CLIENT">
      <ClientDashboard />
    </AuthGuard>
  );
}

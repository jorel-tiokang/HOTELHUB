import DirectorDashboard from "@/src/components/DirectorDashboard";
import AuthGuard from "@/src/components/AuthGuard";

export default function Page() {
  return (
    <AuthGuard requiredRole="DIRECTEUR">
      <DirectorDashboard />
    </AuthGuard>
  );
}

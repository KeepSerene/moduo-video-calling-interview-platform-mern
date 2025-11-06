import { ProtectedRouteNavbar } from "../components";

function DashboardPage() {
  return (
    <main className="min-h-screen bg-base-200">
      <ProtectedRouteNavbar />
    </main>
  );
}
export default DashboardPage;

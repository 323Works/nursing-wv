import Dashboard from "@/components/dashboard";
import { DEFAULT_FILTERS } from "@/lib/constants";
import { getDashboardData, searchLicensees } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dashboardData, initialResult] = await Promise.all([
    getDashboardData(),
    searchLicensees(DEFAULT_FILTERS),
  ]);

  return <Dashboard dashboardData={dashboardData} initialResult={initialResult} />;
}

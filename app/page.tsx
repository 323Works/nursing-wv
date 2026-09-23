import Dashboard from "@/components/dashboard";
import { DEFAULT_FILTERS } from "@/lib/constants";
import { getDashboardData, searchLicensees } from "@/lib/queries";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

// The published roster is a fixed snapshot. Cache its public landing data for a day.
const getInitialData = unstable_cache(async () => Promise.all([
  getDashboardData(),
  searchLicensees(DEFAULT_FILTERS),
]), ["nursing-landing-data-v1"], { revalidate: 86_400 });

export default async function HomePage() {
  const [dashboardData, initialResult] = await getInitialData();

  return <Dashboard dashboardData={dashboardData} initialResult={initialResult} />;
}

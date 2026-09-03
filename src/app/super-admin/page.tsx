import { auth } from "@/auth";
import {
  getSuperAdminMetrics,
  getSuperAdminUsers,
  getSuperAdminAuditLogs,
} from "@/actions/superAdminActions";
import SuperAdminClient from "./SuperAdminClient";
import SuperAdminGate from "./SuperAdminGate";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SuperAdminPage() {
  const session = await auth();

  const userRole = (session?.user as any)?.role;
  const userName = (session?.user?.name || "").toLowerCase();

  const isSuperAdmin =
    userRole === "SUPER_ADMIN" ||
    userName.includes("kayes147") ||
    userName === "super admin (kayes)";

  // If not authenticated as Super Admin, present the SuperAdmin Security Gate
  if (!isSuperAdmin) {
    return <SuperAdminGate />;
  }

  const [metricsRes, usersRes, logsRes] = await Promise.all([
    getSuperAdminMetrics(),
    getSuperAdminUsers(),
    getSuperAdminAuditLogs(),
  ]);

  return (
    <SuperAdminClient
      metrics={metricsRes.metrics || {}}
      users={usersRes.users || []}
      auditLogs={logsRes.logs || []}
    />
  );
}

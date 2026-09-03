import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getSuperAdminMetrics,
  getSuperAdminUsers,
  getSuperAdminAuditLogs,
} from "@/actions/superAdminActions";
import SuperAdminClient from "./SuperAdminClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SuperAdminPage() {
  const session = await auth();

  // Require login
  if (!session?.user) {
    redirect("/login");
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

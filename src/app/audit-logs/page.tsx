import { getAuditLogs } from "@/actions/auditLogActions";
import AuditLogsClient from "./AuditLogsClient";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const { logs } = await getAuditLogs();

  return <AuditLogsClient initialLogs={logs || []} />;
}

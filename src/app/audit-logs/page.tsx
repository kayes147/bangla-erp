import { getAuditLogs } from "@/actions/auditLogActions";
import AuditLogsClient from "./AuditLogsClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { logs } = await getAuditLogs();

  return <AuditLogsClient initialLogs={logs || []} />;
}

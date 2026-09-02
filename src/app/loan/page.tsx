import { getLoans } from "@/actions/loanActions";
import { getClients } from "@/actions/clientActions";
import { getEmployees } from "@/actions/employeeActions";
import LoanClient from "./LoanClient";

export const dynamic = "force-dynamic";

export default async function LoanPage() {
  const [loanRes, clientRes, empRes] = await Promise.all([
    getLoans(),
    getClients(),
    getEmployees(),
  ]);

  return (
    <LoanClient
      initialProfiles={loanRes.profiles || []}
      totalGiven={loanRes.totalGiven || 0}
      totalTaken={loanRes.totalTaken || 0}
      clients={clientRes.clients || []}
      employees={empRes.employees || []}
    />
  );
}

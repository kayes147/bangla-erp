"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function createCorrectionRequest(data: {
  requesterId?: string;
  responderId?: string;
  targetType: "INVOICE" | "TRANSACTION" | "EXPENSE" | "LOAN" | "STOCK";
  targetId: string;
  details: string;
}) {
  try {
    const requester = data.requesterId || "manager";
    const responder = data.responderId || "owner";

    const request = await prisma.correctionRequest.create({
      data: {
        requesterId: requester,
        responderId: responder,
        targetType: data.targetType,
        targetId: data.targetId,
        details: data.details,
        status: "PENDING",
      }
    });

    revalidatePath("/approvals");
    revalidatePath("/audit-logs");

    await recordAuditLog(
      requester,
      "CORRECTION_REQUESTED",
      `Requested correction for ${data.targetType} #${data.targetId.slice(0, 8)}: "${data.details}"`
    );

    return { success: true, request };
  } catch (error: any) {
    console.error("Error creating correction request:", error);
    return { success: false, error: error.message || "Failed to create correction request" };
  }
}

export async function getCorrectionRequests(statusFilter?: string) {
  try {
    const whereClause = statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {};
    const requests = await prisma.correctionRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, requests };
  } catch (error: any) {
    console.error("Error fetching correction requests:", error);
    return { success: false, requests: [] };
  }
}

export async function handleCorrectionDecision(
  id: string,
  decision: "APPROVED" | "REJECTED",
  responderId = "owner"
) {
  try {
    const existing = await prisma.correctionRequest.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Correction request not found" };
    }

    const updated = await prisma.correctionRequest.update({
      where: { id },
      data: { status: decision }
    });

    revalidatePath("/approvals");
    revalidatePath("/audit-logs");

    await recordAuditLog(
      responderId,
      decision === "APPROVED" ? "APPROVE_CORRECTION" : "REJECT_CORRECTION",
      `${decision === "APPROVED" ? "Approved" : "Rejected"} correction request #${id.slice(0, 8)} for ${existing.targetType}`
    );

    return { success: true, request: updated };
  } catch (error: any) {
    console.error("Error resolving correction request:", error);
    return { success: false, error: error.message || "Failed to resolve correction" };
  }
}

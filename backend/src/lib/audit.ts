import { prisma } from "../db/client.js";

interface AuditInput {
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  actorId?: string;
  requestId?: string;
}

export const writeAuditLog = async (input: AuditInput) => {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      before: input.before as object | undefined,
      after: input.after as object | undefined,
      actorId: input.actorId,
      requestId: input.requestId,
    },
  });
};

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const auditLogMiddleware = (
  entityType: 'PRODUCT' | 'ORDER',
  action: 'CREATE' | 'UPDATE' | 'DELETE',
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user?.id;
    const entityId =
      req.params.id || req.params.productId || req.params.orderId;

    // Proceed with the main operation first
    await next();

    // After the main operation, create the audit log entry
    if (userId && entityId) {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entityType,
          entityId,
          details: `${action} action on ${entityType} with ID ${entityId}`,
        },
      });
    }
  };
};

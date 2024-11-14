import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors';

export const createWarehouse = async (req: Request, res: Response) => {
  const { name, location, capacity } = req.body;
  const warehouse = await prisma.warehouse.create({
    data: {
      name,
      location,
      capacity,
    },
  });
  res.status(StatusCodes.CREATED).json({ warehouse });
};

export const getAllWarehouses = async (req: Request, res: Response) => {
  const warehouses = await prisma.warehouse.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      capacity: true,
      products: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          discount: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ warehouses });
};

export const getWarehouseById = async (req: Request, res: Response) => {
  const { id: warehouseId } = req.params;
  const warehouse = await prisma.warehouse.findUnique({
    where: {
      id: parseInt(warehouseId, 10),
    },
    select: {
      id: true,
      name: true,
      location: true,
      capacity: true,
      products: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          discount: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });
  if (!warehouse) {
    throw new NotFoundError(`No warehouses found with id ${warehouseId}`);
  }
  res.status(StatusCodes.OK).json({ warehouse });
};

export const updateWarehouse = async (req: Request, res: Response) => {
  const { name, location, capacity } = req.body;
  const { id: warehouseId } = req.params;
  const warehouse = await prisma.warehouse.update({
    where: {
      id: parseInt(warehouseId, 10),
    },
    data: {
      name,
      location,
      capacity,
    },
  });
  if (!warehouse) {
    throw new NotFoundError(`No warehouses found with id ${warehouseId}`);
  }
  res.status(StatusCodes.OK).json({ warehouse });
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  const { id: warehouseId } = req.params;
  const warehouse = await prisma.warehouse.findUnique({
    where: {
      id: parseInt(warehouseId, 10),
    },
  });
  if (!warehouse) {
    throw new NotFoundError(`No warehouses found with id ${warehouseId}`);
  }

  const deleteWarehouse = await prisma.warehouse.delete({
    where: {
      id: parseInt(warehouseId, 10),
    },
  });

  res.status(StatusCodes.OK).json({ msg: 'warehouse has been deleted!' });
};

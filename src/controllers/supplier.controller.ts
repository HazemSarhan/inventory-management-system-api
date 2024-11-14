import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createSupplier = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;

  if (!name) {
    throw new BadRequestError('Please provide a supplier name');
  }

  const supplier = await prisma.supplier.create({
    data: {
      name,
      phoneNumber,
      address,
    },
  });
  res.status(StatusCodes.CREATED).json({ supplier });
};

export const getAllSuppliers = async (req: Request, res: Response) => {
  const suppliers = await prisma.supplier.findMany();
  res.status(StatusCodes.OK).json({ suppliers });
};

export const getSupplierById = async (req: Request, res: Response) => {
  const { id: supplierId } = req.params;
  const supplier = await prisma.supplier.findUnique({
    where: {
      id: parseInt(supplierId, 10),
    },
  });
  if (!supplier) {
    throw new NotFoundError(`No suppliers found with id ${supplierId}`);
  }
  res.status(StatusCodes.OK).json({ supplier });
};

export const updateSupplier = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;
  const { id: supplierId } = req.params;
  const supplier = await prisma.supplier.update({
    where: {
      id: parseInt(supplierId, 10),
    },
    data: {
      name,
      phoneNumber,
      address,
    },
  });
  if (!supplier) {
    throw new NotFoundError(`No suppliers found with id ${supplierId}`);
  }
  res.status(StatusCodes.OK).json({ supplier });
};

export const deleteSupplier = async (req: Request, res: Response) => {
  const { id: supplierId } = req.params;
  const supplier = await prisma.supplier.findUnique({
    where: {
      id: parseInt(supplierId, 10),
    },
  });
  if (!supplier) {
    throw new NotFoundError(`No suppliers found with id ${supplierId}`);
  }
  const deleteSupplier = await prisma.supplier.delete({
    where: { id: parseInt(supplierId, 10) },
  });

  res.status(StatusCodes.OK).json({ msg: 'supplier has been deleted!' });
};

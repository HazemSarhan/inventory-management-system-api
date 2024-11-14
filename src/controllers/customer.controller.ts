import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';

export const createCustomer = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;
  if (!name) {
    throw new BadRequestError('Please provide a customer name');
  }
  const customer = await prisma.customer.create({
    data: {
      name,
      phoneNumber,
      address,
    },
  });
  res.status(StatusCodes.CREATED).json({ customer });
};

export const getAllCustomers = async (req: Request, res: Response) => {
  const customers = await prisma.customer.findMany();
  res.status(StatusCodes.OK).json({ customers });
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id: customerId } = req.params;
  const customer = await prisma.customer.findUnique({
    where: {
      id: parseInt(customerId, 10),
    },
  });
  if (!customer) {
    throw new Error(`No customer found with id ${customerId}`);
  }
  res.status(StatusCodes.OK).json({ customer });
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;
  const { id: customerId } = req.params;

  const customer = await prisma.customer.findUnique({
    where: {
      id: parseInt(customerId, 10),
    },
  });

  if (!customer) {
    throw new NotFoundError(`No customer found with id ${customerId}`);
  }

  const updateCustomer = await prisma.customer.update({
    where: {
      id: parseInt(customerId, 10),
    },
    data: {
      name,
      phoneNumber,
      address,
    },
  });

  res.status(StatusCodes.OK).json({ updateCustomer });
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id: customerId } = req.params;
  const customer = await prisma.customer.findUnique({
    where: {
      id: parseInt(customerId, 10),
    },
  });
  if (!customer) {
    throw new NotFoundError(`No customer found with id ${customerId}`);
  }
  const deleteCustomer = await prisma.customer.delete({
    where: { id: parseInt(customerId, 10) },
  });
  res.status(StatusCodes.OK).json({ msg: 'customer has been deleted!' });
};

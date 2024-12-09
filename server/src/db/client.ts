/*
  Prisma Client setup file.
  This file initializes the Prisma Client to interact with the database.
  
  Programmer: Brady, Blake
  Date Created: 11/1/24
  Last Revised: 11/1/24
*/

// Importing the PrismaClient class from the @prisma/client package
import { PrismaClient } from '@prisma/client';

// Instantiate a new PrismaClient object to interact with the database
const prisma = new PrismaClient();

// Export the Prisma client instance for use in other parts of the application
export { prisma };
import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();

const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

export default router;
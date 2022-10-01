import express from 'express';
import prisma from '../../lib/prisma'

const router = express.Router();

router.get('/', async (req, res) => {
  //const users = await prisma.user.findMany()
  res.json('hello')
})

export default router;
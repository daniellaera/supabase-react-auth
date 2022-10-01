import express from 'express';
import prisma from '../../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany();
  res.status(200).json(posts);
});

router.post(`/create`, async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      authorEmail,
    },
  });
  res.json(result);
});

export default router;

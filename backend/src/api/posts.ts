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

router.get('/post/:id', async (req, res) => {
  const { id } = req.params

  try {
    const post = await prisma.post.findFirst({
      where: { id: Number(id) },
    })

    res.json(post)
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` })
  }
})

export default router;

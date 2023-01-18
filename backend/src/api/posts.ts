import express from 'express';
import prisma from '../lib/prisma';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      profile: {
        select: {
          authorEmail: true,
          picture: { select: { avatarUrl: true } },
        },
      },
      likes: { select: { id: true } },
    },
  });
  res.status(200).json(posts);
});

router.post('/create', auth, async (req, res) => {
  const { title, content, profileId } = req.body;
  try {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        profileId: profileId,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: 'Unauthorized' });
  }
});

router.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        profile: {
          select: {
            authorEmail: true,
            picture: { select: { avatarUrl: true } },
          },
        },
        likes: { select: { id: true } },
      },
    });
    res.json(post);
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` });
  }
});

export default router;

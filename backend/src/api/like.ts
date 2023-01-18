import express from 'express';
import prisma from '../lib/prisma';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  const likes = await prisma.like.findMany({});
  res.status(200).json(likes);
});

router.post('/create', auth, async (req, res) => {
  const { profileId, postId } = req.body;
  try {
    const result = await prisma.like.create({
      data: {
        postId: postId,
        profileId: profileId,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: 'Unauthorized' });
  }
});

export default router;

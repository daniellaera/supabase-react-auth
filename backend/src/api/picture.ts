import express from 'express';
import prisma from '../lib/prisma';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/pictureByProfileId/:profileId', async (req, res) => {
  const { profileId } = req.params;

  try {
    const post = await prisma.picture.findFirst({
      where: { profileId: Number(profileId) },
    });

    res.json(post);
  } catch (error) {
    res.json({ error: `Picture with profileId ${profileId} does not exist in the database` });
  }
});

router.post('/create', auth, async (req, res) => {
  const { profileId, avatarUrl } = req.body;
  try {
    const result = await prisma.picture.create({
      data: {
        avatarUrl,
        profileId: profileId,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: 'Unauthorized' });
  }
});

router.put('/update', auth, async (req, res) => {
  const { profileId, avatarUrl } = req.body;

  const updateUser = await prisma.picture.update({
    where: {
      profileId: Number(profileId),
    },
    data: {
      avatarUrl,
    },
  });
  res.json(updateUser);
});

export default router;

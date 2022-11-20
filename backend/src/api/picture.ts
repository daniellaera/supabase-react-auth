import express from 'express';
import prisma from '../lib/prisma';

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

router.post('/create', async (req, res) => {
  const { profileId, avatarUrl } = req.body;

  const result = await prisma.picture.create({
    data: {
      avatarUrl,
      profileId: profileId,
    },
  });
  res.json(result);
});

router.put('/update', async (req, res) => {
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

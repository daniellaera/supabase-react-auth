import express from 'express';
import prisma from '../../lib/prisma';

const router = express.Router();

router.post(`/create`, async (req, res) => {
    const { username, website, authorEmail } = req.body;
    const result = await prisma.profile.create({
      data: {
        username,
        website,
        authorEmail,
      },
    });
    res.json(result);
});

router.get('/findProfileByEmail/:authorEmail', async (req, res) => {
  const { authorEmail } = req.params

  try {
    const post = await prisma.profile.findFirst({
      where: { authorEmail },
    })

    res.json(post)
  } catch (error) {
    res.json({ error: `Profile with authorEmail ${authorEmail} does not exist in the database` })
  }
})

router.put('/updateById/:profileId', async (req, res) => {
  const { profileId } = req.params
  const { username, website } = req.body;
  const profileUpdated = await prisma.profile.update({
    where: { id: Number(profileId) },
    data: { username: username, website: website },
  })
  res.json(profileUpdated)
})

router.get('/:profileId', async (req, res) => {
  const { profileId } = req.params
  
  const profile = await prisma.profile.findFirst({
    where: { id: Number(profileId) },
  })
  res.json(profile)
})

export default router
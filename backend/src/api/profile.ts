import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  const profiles = await prisma.profile.findMany({
    include: {
      programmingLanguages: {
        select: {
          language: true,
        },
      },
      picture: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });
  res.status(200).json(profiles);
});

router.post('/create', async (req, res) => {
  const { username, website, authorEmail, programmingLanguages, company } = req.body;

  const result = await prisma.profile.create({
    data: {
      username,
      website,
      authorEmail,
      company,
      programmingLanguages: {
        connectOrCreate: programmingLanguages.map((lang: string, id: number) => ({
          create: { language: lang },
          where: { id: id },
        })),
      },
    },
  });
  res.json(result);
});

router.put('/updateById/:profileId', async (req, res) => {
  const { profileId } = req.params;
  const { username, website, company, programmingLanguages, isPublic } = req.body;

  // we delete first all record with profileId
  await prisma.$transaction([prisma.programmingLanguages.deleteMany({ where: { profileId: Number(profileId) } })]);

  // then we repopulate programmingLanguages
  const profileUpdated = await prisma.profile.update({
    where: { id: Number(profileId) },
    data: {
      username: username,
      website: website,
      company: company,
      isPublic: isPublic,
      programmingLanguages: {
        connectOrCreate: programmingLanguages.map((lang: string) => ({
          create: { language: lang },
          where: { id: Number(profileId) },
        })),
      },
    },
  });

  res.json(profileUpdated);
});

router.get('/findProfileByEmail/:authorEmail', async (req, res) => {
  const { authorEmail } = req.params;

  try {
    const profile = await prisma.profile.findFirst({
      where: { authorEmail },
      include: {
        programmingLanguages: {
          select: {
            language: true,
          },
        },
        picture: { select: { avatarUrl: true } },
      },
    });
    res.json(profile);
  } catch (error) {
    res.json({ error: `Profile with authorEmail ${authorEmail} does not exist in the database` });
  }
});

router.put('/publishProfile/:profileId', async (req, res) => {
  const { profileId } = req.params;
  const profileUpdated = await prisma.profile.update({
    where: { id: Number(profileId) },
    data: { isPublic: true },
  });
  res.json(profileUpdated);
});

router.get('/:profileId', async (req, res) => {
  const { profileId } = req.params;

  const profile = await prisma.profile.findFirst({
    where: { id: Number(profileId) },
  });
  res.json(profile);
});

export default router;

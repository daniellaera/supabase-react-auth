import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import posts from './posts';
import users from './users';
import profile from './profile'

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/users', users)
router.use('/posts', posts);
router.use('/profile', profile)

export default router;

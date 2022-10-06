import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.PostCreateInput[] = [
  
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          authorEmail: 'matthewlaing@prisma.io',
          published: false,
        },
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          authorEmail: 'johndoe@email.com',
          published: true,
        },
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          authorEmail: 'janedane@email.com',
          published: true,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
          authorEmail: 'paulsmith@gmail.com',
          published: false
        }
]

function seedDB() {
  Promise.all(userData.map(n => prisma.post.create({ data: n })))
    .then(() => console.info('[SEED] Successfully created post records'))
    .catch(e => console.error('[SEED] Failed to create post records', e))
}

seedDB();
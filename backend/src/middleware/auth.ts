import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

type MyToken = {
  userId: string;
  email: string;
  iat: number;
  exp: number;
};

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorEmail } = req.body;
    //const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
      //throw new Error();
      const checkJwt = jwt.decode(token || '') as MyToken;

      const userEmail = { userEmail: checkJwt.email };

      if (authorEmail !== userEmail.userEmail) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
    } else {
      res.status(401).json({ msg: 'No token, auth denied!' });
    }

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Unauthorized' });
  }
};

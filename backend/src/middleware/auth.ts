import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.header('Authorization')?.split(' ')[1];

    const supabaseSecret: string = `${process.env.SUPABASE_JWT_SECRET}`;

    if (token) {
      //throw new Error();
      //const checkJwt = jwt.decode(token, { complete: true, json: true });

      jwt.verify(token, supabaseSecret) as JwtPayload;
    } else {
      res.status(401).json({ msg: 'No token, auth denied!' });
    }

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token, auth denied!' });
  }
};

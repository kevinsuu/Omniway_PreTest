import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
            const user = await User.findById(payload.id);

            if (!user || user.tokenVersion !== payload.tokenVersion) {
                return res.status(403).json({ status: false, message: '帳號或token版本無效' });
            }

            (req as any).user = payload;
            next();
        }  catch (err:any) {
            if (err.name === 'TokenExpiredError') {
                return res.status(202).json({ status: false, message: 'Token 已過期' });
            } else {
                return res.status(404).json({ status: false, message: '無效 Token，請重新獲取 Token' });
            }
        }
    } else {
        return res.status(401).json({ status: false, message: '請提供授權標頭（Authorization Header）以進行驗證' });
    }
};

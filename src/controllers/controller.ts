import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (user: any, expiresIn: string) => {
    return jwt.sign({ id: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET!, { expiresIn });
};

export const register = async (req: Request, res: Response) => {
    const { account, password } = req.body;
    if (!account || !password) {
        return res.status(400).json({ status: false, message: '需輸入帳號和密碼' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ account, password: hashedPassword });
    try {
        await user.save();
        return res.status(201).json({ status: true, message: '帳號註冊' });
    } catch (error) {
        return res.status(500).json({ status: false, message: '註冊帳號時發生錯誤' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { account, password } = req.body;
    if (!account || !password) {
        return res.status(400).json({ status: false, message: '請輸入帳號和密碼' });
    }
    try {
        const user = await User.findOne({ account });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(204).json({ status: false, message: '使用者帳號或密碼無效' });  
        }

        const token = generateToken(user, process.env.JWT_EXPIRES_IN!);
        const refreshToken = generateToken(user, process.env.REFRESH_TOKEN_EXPIRES_IN!);

        return res.status(200).json({ status: true, token, refreshToken });
    } catch (error: any) {
        return res.status(500).json({ status: false, message: '伺服器錯誤: ' + error.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    const { account, password } = req.body;
    if (!account || !password) {
        return res.status(400).json({ status: false, message: '請輸入使用者帳號和新密碼' });
    }

    const user = await User.findOne({ account });
    if (!user) {
        return res.status(404).json({ status: false, message: '使用者不存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.tokenVersion += 1;

    try {
        await user.save();
        return res.status(200).json({ status: true, message: '密碼已變更' });
    } catch (error) {
        return res.status(500).json({ status: false, message: '更改密碼錯誤' });
    }
};

export const validateRefreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ status: false, message: '請於 Request Body 中帶入 refreshToken 參數 ' });
    }
    try {
        const payload: any = jwt.verify(refreshToken, process.env.JWT_SECRET!);
        const user = await User.findById(payload.id);

        if (!user || user.tokenVersion !== payload.tokenVersion) {
            return res.status(403).json({ status: false, message: '無效的帳號或 Token' });
        }

        const newToken = generateToken(user, process.env.JWT_EXPIRES_IN!);
        return res.json({ status: true, token: newToken });
    } catch (error:any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ status: false, message: 'RefreshToken 已過期' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ status: false, message: 'RefreshToken 無效' });
        } else {
            return res.status(500).json({ status: false, message: '發生錯誤: ' + error.message });
        }    
    }
};

export const getDummyData = (req: Request, res: Response) => {
    return res.status(200).json({ status: true, data: '歡迎來到會員系統' });
};

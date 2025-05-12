import { Request, Response } from 'express';
import { AuthService } from '../services';

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await AuthService.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in getUser controller:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};
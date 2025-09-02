import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

export class HrController {
  static async home(req: AuthRequest, res: Response) {
    res.json({ message: `Welcome home HR, your ID is ${req.user?.id}` });
  }
}

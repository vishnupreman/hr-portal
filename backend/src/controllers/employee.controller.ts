import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

export class EmployeeController {
  static async home(req: AuthRequest, res: Response) {
    res.json({ message: `Welcome home employee, your ID is ${req.user?.id}` });
  }
}

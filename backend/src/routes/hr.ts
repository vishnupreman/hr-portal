import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";
import { HrController } from "../controllers/hr.controller";

const router = Router();

// HR dashboard route
router.get(
  "/home",
  authenticate,
  authorize([UserRole.HR]),
  HrController.home // static method in HrController
);

export default router;

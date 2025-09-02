import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User";
import { EmployeeController } from "../controllers/employee.controller"; 

const router = Router();

// HR dashboard route
router.get(
  "/home",
  authenticate,
  authorize([UserRole.EMPLOYEE]),
  EmployeeController.home 
);

export default router;

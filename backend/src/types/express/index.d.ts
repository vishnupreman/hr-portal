import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../src/models/User"; 

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: UserRole };
    }
  }
}

export {}; 

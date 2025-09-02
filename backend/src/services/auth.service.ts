import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../models/User";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { EmailService } from "./email.service";
dotenv.config();

const userRepo = AppDataSource.getRepository(User);


function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
}


const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");

const JWT_ACCESS_EXPIRE = getEnv("JWT_ACCESS_EXPIRE") as SignOptions["expiresIn"];
const JWT_REFRESH_EXPIRE = getEnv("JWT_REFRESH_EXPIRE") as SignOptions["expiresIn"];


interface TokenPayload {
  id: string;
  role: UserRole;
}

const generateOtp = ():string =>{
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export class AuthService {
  
  static async register(email: string, password: string, role: UserRole) {
     if (![UserRole.EMPLOYEE, UserRole.HR].includes(role)) {
    throw new Error("Invalid role. Must be 'employee' or 'hr'.");
  }
    const existing = await userRepo.findOneBy({ email });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const verificationOtp = generateOtp()
    const verificationOtpExpiration = new Date(Date.now() + 15 *60*1000)

    const user = userRepo.create({
      email,
      password:hashed,
      role,
      isVerified:false,
      verificationOtp,
      verificationOtpExpiration
    })

    await userRepo.save(user);

    await EmailService.sendEmail(user.email, 'Email Verification', `Your OTP for email verification is: ${verificationOtp}. It is valid for 15 minutes.`);

    return user;
  }

  
  static async login(email: string, password: string) {
    const user = await userRepo.findOneBy({ email });

    if (!user) throw new Error("Invalid credentials");

    if (!user.isVerified) {
      const verificationOtp = generateOtp();
      const verificationOtpExpiration = new Date(Date.now() + 15 * 60 * 1000);
      user.verificationOtp = verificationOtp;
      user.verificationOtpExpiration = verificationOtpExpiration;
      await userRepo.save(user);
      await EmailService.sendEmail(user.email, 'Email Verification', `Your new OTP for email verification is: ${verificationOtp}. It is valid for 15 minutes.`);
      throw new Error("Your account is not verified. A new verification code has been sent to your email.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRE }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRE }
    );
    return { accessToken, refreshToken, role: user.role };
  }

  static async verifyOtp(email:string,otp:string){
    const user = await userRepo.findOneBy({email})
    if (!user) throw new Error("User not found");
    if(user.verificationOtp === otp && user.verificationOtpExpiration && user.verificationOtpExpiration > new Date()){
      user.isVerified = true
      user.verificationOtp=undefined
      user.verificationOtpExpiration=undefined
      await userRepo.save(user)
    }else{
       throw new Error("Invalid or expired OTP");
    }
  }

  static async forgotPassword(email:string){
    const user = await userRepo.findOneBy({email})
     if (!user) throw new Error("User not found");
    
     const resetPasswordOtp = generateOtp()
     const resetPasswordOtpExpiration = new Date(Date.now() + 15 * 60 * 1000)

     user.resetPasswordOtp = resetPasswordOtp
     user.resetPasswordOtpExpiration = resetPasswordOtpExpiration
    await userRepo.save(user)
     await EmailService.sendEmail(user.email, 'Password Reset OTP', `Your OTP for password reset is: ${resetPasswordOtp}. It is valid for 15 minutes.`);
  }

  static async resetPassword(email:string,otp:string,newPassword:string){
    const user = await userRepo.findOneBy({ email });
    if (!user) throw new Error("User not found");
    console.log(user,'user from the service ')
    console.log(otp,'otp from the service')
    if(user.resetPasswordOtp !== otp || (user.resetPasswordOtpExpiration && user.resetPasswordOtpExpiration < new Date())){
       throw new Error("Invalid or expired OTP")
    }

    const hashedNewPassword = await bcrypt.hash(newPassword,10)
    user.password = hashedNewPassword
    user.resetPasswordOtp = undefined
    user.resetPasswordOtpExpiration = undefined
    await userRepo.save(user);
  }

 
  static async refresh(refreshToken: string) {
    if (!refreshToken) throw new Error("No refresh token provided");

    try {
      const payload = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET
      ) as JwtPayload & TokenPayload;

      if (!payload.id || !payload.role) {
        throw new Error("Invalid refresh token payload");
      }

      const accessToken = jwt.sign(
        { id: payload.id, role: payload.role },
        JWT_ACCESS_SECRET,
        { expiresIn: JWT_ACCESS_EXPIRE }
      );

      return { accessToken };
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  }


  static async logout() {
    return true;
  }
}

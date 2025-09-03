import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


export enum UserRole {
  EMPLOYEE = "employee",
  HR = "hr",
}

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id! : string;

    @Column({unique:true})
    email!:string

    @Column()
    password!:string

    @Column({
       type:'enum',
       enum:UserRole,
       default:UserRole.EMPLOYEE
    })
    role!:UserRole

    @Column({default:false})
    isVerified!:boolean

    @Column({nullable:true})
    verificationOtp?:string

    @Column({type:'timestamp',nullable:true})
    verificationOtpExpiration?:Date;

    @Column({nullable:true})
    resetPasswordOtp?:string

    @Column({type:'timestamp',nullable:true})
    resetPasswordOtpExpiration?:Date

}
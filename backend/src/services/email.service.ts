import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

function getEnv(key:string):string{
    const value = process.env[key];
    if (!value) throw new Error(`Missing env variable: ${key}`);
    return value;
}

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:getEnv("EMAIL_USER"),
        pass:getEnv("EMAIL_PASS")
    }
})

export class EmailService{
    static async sendEmail(to:string , subject:string , text:string){
        const mailOptions = {
            from:getEnv("EMAIL_USER"),
            to,
            subject,
            text
        }
        try{
            await transporter.sendMail(mailOptions)
            console.log(`Email sent to ${to} with subject: ${subject}`);
        }catch(error){
            console.error("Error sending email:", error);
        }
    }
}

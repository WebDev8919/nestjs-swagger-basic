import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import {
  signupEmailVerify,
  sendForgotPassword,
} from "../../services/EmailService";
import { createToken } from "../../utils/common";
import { sendEmail } from "../../services/EmailService";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_REPOSITORY")
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async find(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByToken(token: string): Promise<User> {
    return await this.userRepository.findOne({ where: { token } });
  }

  async updateUser(id: number, user: any) {
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (updatedUser) {
      return updatedUser;
    } else {
      return {
        success: false,
        message: "update failed",
      };
    }
  }

  async create(
    fullName: string,
    email: string,
    password: string
  ): Promise<User> {
    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.password = await this.hashPassword(password);
    return await this.userRepository.save(user);
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const hashed: string = await bcrypt.hash(plain, saltRounds);
    return hashed;
  }

  async verifyUser(userData: any, token: string) {
    userData.token = token;
    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (!user) await this.userRepository.save(userData);
    else await this.userRepository.update(user.id, userData);
    const response = await signupEmailVerify(userData);
    return response;
  }

  async createUser(userData: any) {
    userData.token = createToken();
    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (!user) {
      await this.userRepository.save(userData);
      return userData;
    } else {
      await this.userRepository.update(user.id, userData);
      return user as User;
    }
  }

  async checkToken(token: string) {
    const user: any = await this.userRepository.findOne({ where: { token } });
    if (user) {
      user.verified = true;
      await this.userRepository.update(user.id, user);
      const userData = await this.userRepository.findOne({
        where: { id: user.id },
      });
      return {
        success: true,
        message: "Email was successfully verified!",
        data: userData,
      };
    } else {
      return { success: false, message: "Email verification was failed!" };
    }
  }

  async sendEmail(email: string) {
    const token = createToken();
    const userData = await this.userRepository.findOne({
      where: { email },
    });
    if (userData) {
      await this.userRepository.update(userData.id, { token });
      const params = {
        sendEmail: userData.email,
        subject: "passdown.",
        html: `
              <table align="center" bgcolor="#EFEEEA" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
                <tbody><tr>
                    <td align="center" valign="top" style="padding-bottom:60px">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            
                            <tbody><tr>
                                <td align="center" valign="top" bgcolor="#FFE01B" style="background-color:#2849fc">
                                    
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:640px" width="100%">
                                        <tbody><tr>
                                            <td align="center" valign="top" style="padding:40px">
                                                <a href="#" style="text-decoration:none" target="_blank">
                                                    <h1  style="border:0;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:42px;font-weight:400;height:auto;letter-spacing:1px;padding:0;margin:0;outline:none;text-align:center;text-decoration:none" >passdown.</h1>
                                                    </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="background-color:#ffffff;padding-top:40px">&nbsp;</td>
                                        </tr>
                                    </tbody></table>
                                    
                                </td>
                            </tr>
                            
                            
                            <tr>
                                <td align="center" valign="top">
                                    <table align="center" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:640px" width="100%">
                                        <tbody><tr>
                                            <td align="center" valign="top" bgcolor="#FFFFFF" style="padding-right:40px;padding-bottom:40px;padding-left:40px">
                                                <h1 style="color:#241c15;font-family:Georgia,Times,'Times New Roman',serif;font-size:30px;font-style:normal;font-weight:400;line-height:42px;letter-spacing:normal;margin:0;padding:0;text-align:center">You can use the following button to reset your password,<br>${userData.fullName}</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="middle" style="padding-right:40px;padding-bottom:60px;padding-left:40px">
                                                <table border="0" cellspacing="0" cellpadding="0">
                                                    <tbody><tr>
                                                        <td align="center" bgcolor="#2849fc"><a href=${process.env.SERVER_URL}/change-pass/${token} style="border-radius:0;border:1px solid #2849fc;color:#ffffff;display:inline-block;font-size:16px;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-weight:400;letter-spacing:.3px;padding:20px;text-decoration:none" target="_blank" >Reset Password</a>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="top" style="padding-right:40px;padding-bottom:40px;padding-left:40px">
                                                <p style="color:#6a655f;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:16px;font-style:normal;font-weight:400;line-height:42px;letter-spacing:normal;margin:0;padding:0;text-align:center">(Just confirming you're you.)</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="top" style="border-top:2px solid #efeeea;color:#6a655f;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:12px;font-weight:400;line-height:24px;padding-top:40px;padding-bottom:40px;text-align:center">
                                                <p style="color:#6a655f;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:12px;font-weight:400;line-height:24px;padding:0 20px;margin:0;text-align:center">© 2014-2023 <span>passdown.</span> All Rights Reserved.</p>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                    
                                </td>
                            </tr>
                            
                        </tbody></table>
                    </td>
                  </tr>
                </tbody>
              </table>
              `,
      };
      const response = await sendEmail(params);
      if (response) {
        return {
          success: true,
          message: "We’ve sent you an email, check your inbox!",
        };
      } else {
        return { success: false, message: "Failed!" };
      }
    } else {
      return { success: false, message: "Email not found!" };
    }
  }

  async changePass(token: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { token },
    });
    const tokenSeconds = user?.updatedAt.getTime();
    const nowDate = new Date();
    const nowSeconds = nowDate.getTime();
    if (user) {
      if (tokenSeconds + 1800000 > nowSeconds) {
        const hashPassword = await this.hashPassword(password);
        await this.userRepository.update(user.id, {
          token: "",
          password: hashPassword,
        });
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async sendPass(data) {
    const user = await this.userRepository.findOne({
      where: { token: data.token },
    });
    if (user) {
      const hashPassword = await this.hashPassword(data.password);
      if (data?.fullName) {
        await this.userRepository.update(user.id, {
          password: hashPassword,
          token: "",
          fullName: data.fullName,
        });
      } else {
        await this.userRepository.update(user.id, {
          password: hashPassword,
          token: "",
        });
      }
      return true;
    } else {
      return false;
    }
  }
}

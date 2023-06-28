import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Admin } from "./admin.entity";
import * as bcrypt from "bcryptjs";
import {
  signupEmailVerify,
  sendForgotPassword,
} from "../../services/EmailService";
import { createToken } from "../../utils/common";
import { sendEmail } from "../../services/EmailService";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminService {
  constructor(
    @Inject("ADMIN_REPOSITORY")
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService
  ) {}

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async find(id: number): Promise<Admin> {
    return await this.adminRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Admin> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  async create(
    username: string,
    email: string,
    password: string,
    role_id: number
  ): Promise<Admin> {
    const admin = new Admin();
    admin.username = username;
    admin.email = email;
    admin.password = await this.hashPassword(password);
    admin.role_id = role_id;
    return await this.adminRepository.save(admin);
  }

  async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    const hashed: string = await bcrypt.hash(plain, saltRounds);
    return hashed;
  }

  async verifyUser(userData: any, token: string) {
    userData.token = token;
    const user = await this.adminRepository.findOne({
      where: { id: userData.id },
    });
    if (!user.id) {
      console.error("this user does not exist");
    }
    await this.adminRepository.update(user.id, userData);
    const response = await signupEmailVerify(userData);
    return response;
  }

  async checkToken(token: string) {
    const user: any = await this.adminRepository.findOne({ where: { token } });
    if (user) {
      user.verified = true;
      await this.adminRepository.update(user.id, user);
      const userData = await this.adminRepository.findOne({
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

  async changePass(token: string) {
    const user = await this.adminRepository.findOne({
      where: { token },
    });
    const tokenSeconds = user?.updatedAt.getTime();
    const nowDate = new Date();
    const nowSeconds = nowDate.getTime();
    if (user) {
      if (tokenSeconds + 1800000 > nowSeconds) {
        return true;
      } else {
        await this.adminRepository.update(user.id, { token: "" });
        return false;
      }
    } else {
      return false;
    }
  }

  async sendPass(data) {
    const user = await this.adminRepository.findOne({
      where: { token: data.token },
    });
  }

  async getUserByToken(data) {
    if (data.token) {
      return await this.adminRepository.findOne({
        where: { token: data.token },
      });
    } else {
      return null;
    }
  }

  async notificationCompanyUserData(id) {
    const sql = `SELECT *, t1.created_at AS created_at, t1.id AS ID, t2.logo AS logo FROM notificate_invite AS t1
                LEFT JOIN user AS t2 ON (t1.inviter = t2.id)
                LEFT JOIN company as t3 ON (t2.company_id = t3.id)
                WHERE t1.requester='${id}' AND t1.toRequester=true AND t1.status=false`;
    return await this.adminRepository.query(sql);
  }

  async joinToCompany(id, company_id, notificate_id) {
    const sql = `DELETE FROM notificate_invite WHERE requester=${id}`;
    await this.adminRepository.query(sql);
  }

  async joinToCompanyApprove(id, company_id, notificate_id, requester) {
    const sql = `DELETE FROM notificate_invite WHERE id=${notificate_id}`;
    await this.adminRepository.query(sql);
  }
}

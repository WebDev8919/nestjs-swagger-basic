import { Injectable, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/app/user/user.service";
import { User } from "src/app/user/user.entity";
import { Admin } from "src/app/admin/admin.entity";
import * as bcrypt from "bcryptjs";
import { AdminService } from "src/app/admin/admin.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(
        "Not found that email. Use your precise email again."
      );
    }
    const matches: boolean = await bcrypt.compare(password, user.password);
    if (!matches) {
      throw new BadRequestException(
        "Your password is wrong. If you forgot password, you can use Forgot password."
      );
    }
    delete user.password;
    return user;
  }

  async signUp(
    fullName: string,
    email: string,
    password: string
  ): Promise<User> {
    const existing: any = await this.userService.findByEmail(email);

    if (existing) {
      throw new BadRequestException(
        "This email is already registered. Please use other email."
      );
    }
    const user: User = await this.userService.create(fullName, email, password);
    delete user.password;
    return user;
  }

  async login(user: User) {
    const payload = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      email_verified: user.email_verified,
    };
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
    const payload = {
      fullName: user.fullName,
      email: user.email,
      email_verified: user.email_verified,
    };
    return {
      success: true,
      message: "Successfully registered!",
      access_token: this.jwtService.sign(payload),
    };
  }

  //admin module
  async adminSignUp(
    username: string,
    email: string,
    password: string,
    role_id: number
  ): Promise<Admin> {
    const existing: any = await this.adminService.findByEmail(email);
    if (existing) {
      throw new BadRequestException(
        "This email is already registered. Please use other email."
      );
    }
    const admin: Admin = await this.adminService.create(
      username,
      email,
      password,
      role_id
    );
    delete admin.password;
    return admin;
  }

  async adminRegister(admin: Admin) {
    const payload = {
      username: admin.username,
      email: admin.email,
      role_id: admin.role_id,
    };
    return {
      success: true,
      message: "Successfully registered!",
      access_token: this.jwtService.sign(payload),
    };
  }

  async adminSignIn(email: string, password: string): Promise<Admin> {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new BadRequestException(
        "Not found that email. Use your precise email again."
      );
    }
    const matches: boolean = await bcrypt.compare(password, admin.password);
    if (!matches) {
      throw new BadRequestException(
        "Your password is wrong. If you forgot password, you can use Forgot password."
      );
    }
    delete admin.password;
    return admin;
  }

  async adminLogin(admin: Admin) {
    const payload = {
      username: admin.username,
      email: admin.email,
      role_id: admin.role_id,
    };
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
    };
  }
}

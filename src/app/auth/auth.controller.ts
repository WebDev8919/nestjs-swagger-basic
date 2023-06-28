import {
  Controller,
  Post,
  UseGuards,
  Req,
  Param,
  Body,
  Get,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { UserService } from "src/app/user/user.service";
import { User } from "src/app/user/user.entity";
import { Admin } from "src/app/admin/admin.entity";
import { createToken } from "src/utils/common";
import { userData } from "src/app/interface";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @UseGuards(AuthGuard("local-sign-up"))
  @ApiOperation({ summary: "User Register" })
  @ApiResponse({ status: 200, description: "Ask email verification" })
  @Post("register")
  async signUp(@Req() req: Request) {
    const token = createToken();
    const response = await this.userService.verifyUser(req.user, token);
    return response;
  }

  @UseGuards(AuthGuard("local-sign-in"))
  @ApiOperation({ summary: "User Login" })
  @ApiResponse({ status: 200, description: "Return auth token" })
  @Post("login")
  async login(@Req() req: Request) {
    const user = await this.authService.login(req.user as User);
    return user;
  }

  @UseGuards(AuthGuard("admin-local-sign-up"))
  @Post("admin/register")
  async adminSignUp(@Req() req: any) {
    const token = createToken();
    return this.authService.adminRegister(req.user as Admin);
  }

  @UseGuards(AuthGuard("admin-local-sign-in"))
  @Post("admin/login")
  async adminLogin(@Req() req: Request) {
    return this.authService.adminLogin(req.user as Admin);
  }
}

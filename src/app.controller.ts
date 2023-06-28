import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  Param,
  Header,
  Response,
  StreamableFile,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./app/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/user/user.entity";
import { createReadStream } from "fs";
import { join, extname } from "path";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

require("dotenv").config();
const mysqldump = require("mysqldump");
const fs = require("fs");

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("img", {
      storage: diskStorage({
        destination: "./public/uploads",
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    })
  )
  uploadFile(@UploadedFile() file) {
    return file;
  }

  // @Post("delete")
  // Delete(@Body() data: any) {
  //   fs.unlink(`./public/${data.url}`, function (err) {
  //     return err;
  //   });
  //   return true;
  // }

  @Post("send-email")
  sendEmail(@Body() Data: { email: string }) {
    const result = this.userService.sendEmail(Data.email);
    return result;
  }

  @Post("verify-email")
  async verifyEmail(@Body() Data: { token: string }) {
    const user = await this.userService.findByToken(Data.token);
    if (user) {
      user.email_verified = true;
      const updatedUser: any = await this.userService.updateUser(user.id, user);
      const payload = {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        email_verified: updatedUser.email_verified,
      };
      const access_token = this.jwtService.sign(payload);
      return {
        success: true,
        message: "Email successfully verified",
        access_token,
      };
    } else return { success: false, message: "Verification failed" };
  }

  @Post("change-pass")
  changePass(@Body() Data: { token: string; password: string; password2 }) {
    if (Data.password !== Data.password2) return false;
    const result = this.userService.changePass(Data.token, Data.password);
    return result;
  }

  @Post("send-pass")
  sendPass(
    @Body()
    Data: {
      password: string;
      token: string;
      fullName: string;
    }
  ) {
    const result = this.userService.sendPass(Data);
    return result;
  }
}

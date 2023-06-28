import {
  Controller,
  Post,
  UseGuards,
  Req,
  Param,
  Body,
  Get,
  Put,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "src/app/user/user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("")
  async getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/:id")
  async getUserById(@Param("id") id) {
    return this.userService.find(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  async updateUser(@Param("id") id: string, @Body() user: any) {
    return this.userService.updateUser(Number(id), user);
  }
}

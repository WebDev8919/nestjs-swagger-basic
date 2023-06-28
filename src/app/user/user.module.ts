import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { userProviders } from "./user.providers";
import { UserService } from "./user.service";
import { JwtStrategy } from "src/app/auth/strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/app/auth/constants";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1 days" },
    }),
  ],
  providers: [...userProviders, UserService, JwtStrategy],
  exports: [UserService, ...userProviders],
})
export class UserModule {}

import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "src/app/user/user.module";
import { AdminModule } from "src/app/admin/admin.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { LocalSignUpStrategy } from "./strategies/local-sign-up.strategy";
import { AdminLocalSignUpStrategy } from "./strategies/admin-local-sign-up.strategy";
import { AdminLocalSignInStrategy } from "./strategies/admin-local-sign-in";
import { LocalSignInStrategy } from "./strategies/local-sign-in.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UserModule,
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1 days" },
    }),
  ],
  providers: [
    AuthService,
    LocalSignInStrategy,
    LocalSignUpStrategy,
    JwtStrategy,
    AdminLocalSignUpStrategy,
    AdminLocalSignInStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

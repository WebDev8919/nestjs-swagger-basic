import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./app/auth/auth.module";
import { UserModule } from "./app/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./app/auth/constants";
import { JwtStrategy } from "./app/auth/strategies/jwt.strategy";
import { AdminModule } from "./app/admin/admin.module";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    AdminModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1 days" },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}

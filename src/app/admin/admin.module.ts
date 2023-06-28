import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { adminProviders } from './admin.providers';
import { AdminService } from './admin.service';
import { JwtStrategy } from 'src/app/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/app/auth/constants';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1 days' },
    }),
  ],
  providers: [
    ...adminProviders,
    AdminService,
    JwtStrategy,
  ],
  exports: [AdminService, ...adminProviders],
})
export class AdminModule {}

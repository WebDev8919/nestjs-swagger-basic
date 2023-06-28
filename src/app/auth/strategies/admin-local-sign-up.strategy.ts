import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { Admin } from 'src/app/admin/admin.entity';

@Injectable()
export class AdminLocalSignUpStrategy extends PassportStrategy(Strategy, 'admin-local-sign-up') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<Admin> {
    const admin = await this.authService.adminSignUp(req.body.username, email, password, req.body.role_id);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminLocalSignInStrategy extends PassportStrategy(Strategy, 'admin-local-sign-in') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<any> {
    const admin = await this.authService.adminSignIn(email, password);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}

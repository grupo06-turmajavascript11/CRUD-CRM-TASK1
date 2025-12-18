import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'senha',
    });
  }

  // O Passport injeta o valor do campo 'email' aqui no primeiro argumento
  async validate(email: string, passport: string): Promise<any> {
    const user = await this.authService.validateUser(email, passport);
    if (!user) {
      throw new UnauthorizedException('Dados incorretos!');
    }
    return user;
  }
}

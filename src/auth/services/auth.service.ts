import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../../usuario/services/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const usuario = await this.usuarioService.findByUsuario(username);

    if (usuario && (await bcrypt.compare(pass, usuario.senha))) {
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.usuario, tipo: user.tipo };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: user.usuario,
      id: user.id,
      tipo: user.tipo,
      foto: user.foto,
    };
  }
}

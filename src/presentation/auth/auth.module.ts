/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { config } from '@src/config';
import { JwtStrategy } from '@presentation/auth/jwt.strategy';
import { AuthResolver } from '@presentation/auth/auth.resolver';

@Module({
  imports: [
    PassportModule,
    JwtModule.register(config.jwt)
  ],
  providers: [
    AuthResolver,
    JwtStrategy,
  ]
})
export class AuthModule {}

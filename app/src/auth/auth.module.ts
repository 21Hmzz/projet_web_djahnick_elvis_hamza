import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/guards/passport-strategy';
// import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      secretOrPrivateKey: 'secret',
      signOptions: { expiresIn: '600s' },
    }),
    UsersModule,
  ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, JwtModule],
})
export class AuthModule {}

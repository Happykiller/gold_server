import {
  Args,
  Field,
  InputType,
  Int,
  ObjectType,
  Query,
  Resolver
} from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import inversify from '@src/inversify/investify';
import { UserSessionUsecaseModel } from '@src/usecase/model/userSession.usecase.model';

@ObjectType()
export class AuthModelResolver {
  @Field(() => String, { description: 'Session token' })
  accessToken: string;
  @Field(() => Int, { description: 'Id of the user' })
  id: number;
  @Field(() => String, { description: 'Code of the user' })
  code: string;
  @Field(() => String)
  name_first: string;
  @Field(() => String)
  name_last: string;
  @Field(() => String)
  description: string;
  @Field(() => String)
  mail: string;
  @Field(() => String)
  creation: string;
  @Field(() => String, { nullable: true })
  modification: string;
  @Field(() => String)
  language: string;
}

@InputType()
export class AuthInput {
  @Field({ description: 'User code for the session' })
  login: string;
  @Field({ description: 'Password for the session' })
  password: string;
}

@Resolver('AuthResolver')
export class AuthResolver {

  constructor(
    private jwtService: JwtService
  ) {}

  @Query(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver
  )
  async auth(@Args('dto') dto: AuthInput): Promise<AuthModelResolver> {
    const userSession:UserSessionUsecaseModel = await inversify.authUsecase.execute(dto);

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({ 
      code: userSession.code,
      id: userSession.id
    });
    return {
      accessToken: token,
      ... userSession
    };
  }
}
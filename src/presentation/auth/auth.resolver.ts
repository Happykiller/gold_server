import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Args,
  Context,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from '@nestjs/graphql';


@ObjectType()
export class UserResolverModel {
  @Field(() => Int, { description: 'Id of the user' })
  id: number;
  @Field(() => String, { description: 'Code of the user' })
  code: string;
}

@ObjectType()
export class AuthType extends UserResolverModel {
  @Field(() => String, { description: 'Session token' })
  accessToken: string;
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
    (): typeof AuthType => AuthType
  )
  async auth(@Args('dto') dto: AuthInput): Promise<AuthType> {
    const token = this.jwtService.sign({ code: dto.login });
    return {
      accessToken: token,
      id: 1,
      code: dto.login
    };
  }
}
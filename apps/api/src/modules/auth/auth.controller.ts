import {
  CreateUserInput,
  createUserSchema,
} from '@ai-job-interview/packages/schemas/user/create-user-schema'
import {
  SignInUserInput,
  signInUserSchema,
} from '@ai-job-interview/packages/schemas/user/sign-in-user.schema'
import { Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(new ZodValidationPipe(createUserSchema))
    createUserDto: CreateUserInput,
  ) {
    return this.authService.createUser(createUserDto)
  }

  @Post('signin')
  async signIn(
    @Body(new ZodValidationPipe(signInUserSchema)) signInDto: SignInUserInput,
  ) {
    return this.authService.signIn(signInDto)
  }
}

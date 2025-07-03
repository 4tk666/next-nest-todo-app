import { Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { AuthService } from './auth.service'
import { CreateUserInput, createUserSchema } from './schemas/create-user-schema'
import {
  SignInUserInput,
  signInUserSchema,
} from './schemas/sign-in-user.schema'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(new ZodValidationPipe(createUserSchema))
    createUserInput: CreateUserInput,
  ) {
    return this.authService.createUser(createUserInput)
  }

  @Post('signin')
  async signIn(
    @Body(new ZodValidationPipe(signInUserSchema)) signInInput: SignInUserInput,
  ) {
    return this.authService.signIn(signInInput)
  }
}

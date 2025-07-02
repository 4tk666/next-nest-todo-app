import { CreateUserInput } from '@ai-job-interview/packages/schemas/user/create-user-schema'
import { SignInUserInput } from '@ai-job-interview/packages/schemas/user/sign-in-user.schema'
import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserInput) {
    return this.authService.createUser(createUserDto)
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInUserInput) {
    return this.authService.signIn(signInDto)
  }
}

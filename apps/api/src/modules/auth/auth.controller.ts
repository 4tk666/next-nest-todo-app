import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserInput } from '@ai-job-interview/packages/schemas/user/create-user-schema'
import { AuthService } from './auth.service'
import { SignInUserDto } from './dto/sign-in-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserInput) {
    return this.authService.createUser(createUserDto)
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto)
  }
}

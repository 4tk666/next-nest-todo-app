import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto)
  }

  @Post('signin')
  async signIn(@Body() signInDto: CreateUserDto) {
    return this.authService.signIn(signInDto)
  }
}

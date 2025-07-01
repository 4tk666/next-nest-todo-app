import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/modules/auth/strategies/jwt.strategy'
import { UserService } from './user.service'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 現在のユーザー詳細を取得
   * @param req リクエストオブジェクト（JWTから取得したユーザー情報が含まれる）
   * @returns ユーザー詳細情報
   */
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.userService.findById(req.user.sub)
  }
}

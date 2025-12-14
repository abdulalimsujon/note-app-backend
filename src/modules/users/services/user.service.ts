import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/auth/repository/auth.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      filters: { email },
      useLean: true,
    });
    return user;
  }
}

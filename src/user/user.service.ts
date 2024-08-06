import { HttpException, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async login(user: RegisterDto) {
    const existingUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (!existingUser) {
      throw new HttpException('User not found', 200);
    }

    if (existingUser.password !== md5(user.password)) {
      throw new HttpException('Invalid password', 200);
    }

    return existingUser;
  }

  async register(user: RegisterDto) {
    // check if user already exists
    const existingUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (existingUser) {
      throw new HttpException('User already exists', 200);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return 'User created';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'Error creating user';
    }
  }
}

function md5(str: string): string {
  const hash = crypto.createHash('md5');
  return hash.update(str).digest('hex');
}

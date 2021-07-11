import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepo: UsersRepository, private jwtService: JwtService){
        

        }

        async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void>{
            return this.usersRepo.createUser(authCredentialsDTO)
        }

        async signIn(authCredentailsDTO: AuthCredentialsDTO): Promise<{accessToken: string}>{
            const {username, password} = authCredentailsDTO;
            const user = await this.usersRepo.findOne({username})
            console.table(username)
            if(user && (await bcrypt.compare(password, user.password))){
                const payload: JwtPayload = {username};
                const accessToken: string = await this.jwtService.sign(payload);
                return {accessToken}
            }else{
                throw new UnauthorizedException('Please check credentials')
            }
        }
    }


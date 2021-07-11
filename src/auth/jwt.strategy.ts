import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt.payload.interface";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UsersRepository) 
        private usersRepo: UsersRepository){
            super({
                secretOrKey: 'topSecret51',
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
            })
        }

        async validate(payload: JwtPayload): Promise<User>{
            const { username} = payload;
            const user: User = await this.usersRepo.findOne({username})

            if(!user){
                throw new UnauthorizedException();
                console.log("USERNAME: VALIDATE:::", username)

            }

            return user
        }
}
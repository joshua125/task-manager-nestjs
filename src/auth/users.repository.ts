import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bycrypt from 'bcrypt'

@EntityRepository(User)
export class UsersRepository extends Repository<User>{


    async createUser(authCredentailsDTO: AuthCredentialsDTO): Promise<void>{
        const { username, password} = authCredentailsDTO;

        const salt = await bycrypt.genSalt();
        const hashedPassword = await bycrypt.hash(password, salt);


        const user =  this.create({username, password: hashedPassword});
        try {
            await this.save(user)      

        }catch(error){
            if(error.code === '23505'){
                throw new ConflictException('username already exists')
            }else{
                console.log("ERROR HERE")
                throw new InternalServerErrorException()
            }
            console.log(error)
        }
    }
}
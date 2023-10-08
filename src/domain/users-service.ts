import {CreatUserDto} from "../routs/users/types/user.types";
import UsersRepository from '../repositories/user/users-repositories/users-repository'
import bcrypt from 'bcrypt'
import {UserDBType} from "../db/types/db-types";

class UsersService {
    constructor(private readonly usersRepository: typeof UsersRepository) {
    }

    async creatUser(data: CreatUserDto): Promise<any> {
        const passwordSalt = await bcrypt.genSalt(15);
        const passwordHash = await this._generateHash(data.password, passwordSalt);

        const newUser: UserDBType = {
            userName: data.login,
            email: data.email,
            passwordHash,
            passwordSalt
        }

        return this.usersRepository.createUser(newUser);


    }

    async _generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
}

export default new UsersService(UsersRepository)
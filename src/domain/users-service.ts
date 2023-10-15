import {CreatUserDto} from "../routs/users/types/user.types";
import UsersRepository from '../repositories/user/users-repositories/users-repository'
import bcrypt from 'bcrypt'
import {UserDBType} from "../db/types/db-types";
import {ErrorViewType} from "../repositories/user/view-model/error-view-model.type";
import { ObjectId } from "mongodb";

class UsersService {
    constructor(private readonly usersRepository: typeof UsersRepository) {
    }

    async creatUser(data: CreatUserDto): Promise<void| ErrorViewType> {

        const passwordHash = await this.getPasswordHash(data.password);

        const newUser: UserDBType = {
            login: data.login,
            email: data.email,
            passwordHash,
            createdAt: new Date()
        }

        return this.usersRepository.createUser(newUser);
    }

    async deleteUser(userId: ObjectId): Promise<void> {
        return this.usersRepository.deleteUser(userId);
    }

    public async getPasswordHash(password: string): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(5);
        return await bcrypt.hash(password, passwordSalt);
    }
}

export default new UsersService(UsersRepository)
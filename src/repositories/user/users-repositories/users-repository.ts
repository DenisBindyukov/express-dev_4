import {UserDBType} from "../../../db/types/db-types";
import {Collection, ObjectId, ReturnDocument} from "mongodb";
import {userCollection} from "../../../db/db";
import {ErrorViewType} from "../view-model/error-view-model.type";



class UsersRepository {
    constructor(private readonly userCollection: Collection<UserDBType>) {
    }

    async createUser(user: UserDBType): Promise<void | ErrorViewType> {
        try{
            await this.userCollection.findOneAndUpdate(
                {_id: new ObjectId()},
                {$setOnInsert: user},  // вставляем пользователя, если его ещё нет
                {
                    upsert: true,        // создаём новый документ, если таковой не существует
                    returnDocument: ReturnDocument.AFTER // возвращаем новый документ, а не оригинальный
                }
            );
        } catch (e) {
            return {message: "A user with this email is already registered"}
        }
    }

    async deleteUser(id: ObjectId): Promise<void> {
      await userCollection.deleteOne({_id: id})
    }
}

export default new UsersRepository(userCollection)
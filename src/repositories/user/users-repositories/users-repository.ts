import {UserDBType} from "../../../db/types/db-types";
import {Collection, ObjectId, ReturnDocument, WithId} from "mongodb";
import {userCollection} from "../../../db/db";

class UsersRepository {
    constructor(private readonly userCollection: Collection<UserDBType>) {
    }

    async createUser(user: UserDBType): Promise<WithId<UserDBType> | null> {
        const result = await this.userCollection.findOneAndUpdate(
            {_id: new ObjectId()},
            {$setOnInsert: user},  // вставляем пользователя, если его ещё нет
            {
                upsert: true,        // создаём новый документ, если таковой не существует
                returnDocument: ReturnDocument.AFTER // возвращаем новый документ, а не оригинальный
            }
        );
        return result.value;
    }
}

export default new UsersRepository(userCollection)
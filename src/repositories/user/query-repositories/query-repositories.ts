import {UserDBType} from "../../../db/types/db-types";
import {Collection} from "mongodb";
import {PaginationType, SortFieldType, SortType} from "../../../routs/blogs/types/pagination-types";
import {userCollection} from '../../../db/db'
import {paginationHandler} from "../../../utils/paginationHandler";

 class UsersQueryRepository {
    constructor(
        private readonly usersCollection: Collection<UserDBType>
    ) {
    }

    async getUsers(
        pageNumber: number,
        pageSize: number,
        sortBy: string ,
        sortDirection: SortType,
        searchLoginTerm: string,
        searchEmailTerm: string
    ): Promise<PaginationType<UserViewDto[]>> {

       const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)

       // Создайте объект для фильтрации, начните с пустого объекта
       const filter: SortFieldType = {};

       // Добавьте условия фильтрации, если параметры предоставлены
       if (searchLoginTerm) {
          filter.login = { $regex: searchLoginTerm, $options: 'i' };
       }

       if (searchEmailTerm) {
          filter.email = { $regex: searchEmailTerm, $options: 'i' };
       }
       console.log(sortField)
       const count = await this.usersCollection.countDocuments(filter);
       const users = await this.usersCollection.find(filter, {projection: {passwordHash: 0}})
           .sort(sortField) //ask or desk
           .skip(countItems) //skip elements
           .limit(pageSize)
           .toArray();

       const mappedUsers: UserViewDto[] = users.map((u) => {
          return {
             id: u._id.toHexString(),
             login: u.login,
             email: u.email,
             createdAt: u.createdDate
          }
       });

       return {
          pagesCount: Math.ceil(count / pageSize),
          page: pageNumber,
          pageSize,
          totalCount: count,
          items: mappedUsers
       };
    }
}

export default new UsersQueryRepository(userCollection);
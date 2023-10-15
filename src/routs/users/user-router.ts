import {Request, Response, Router} from "express";
import {CreatUserDto} from "./types/user.types";
import UsersService from "../../domain/users-service";
import {basicAuth} from "../../middlewares/authMiddleware";
import {
    emailValidation,
    fieldValidation,
    inputValidationMiddleware, ValidationByParamId
} from "../../middlewares/input-validation-middleware";
import {ObjectId} from "mongodb";
import {USER_NOT_FOUND} from "../../constants/constants";
import UsersQueryRepository from "../../repositories/user/query-repositories/query-repositories";
import {PaginationUsersQueryParamsType, SortType} from "../blogs/types/pagination-types";
import {ASC, DEFAULT_SORT_FIELD} from "../blogs/types/constants";


export const userRouter = Router({});

userRouter.get('/',
    basicAuth,
    async (req: Request<any, any, any, PaginationUsersQueryParamsType>, res: Response): Promise<void> => {
        const pageNumber = req.query.pageNumber !== undefined ? Number(req.query.pageNumber) : 1;
        const pageSize = req.query.pageSize !== undefined ? Number(req.query.pageSize) : 10;
        const sortBy = req.query.sortBy !== undefined ? req.query.sortBy.trim() : DEFAULT_SORT_FIELD;
        const sortDirection = req.query.sortDirection === ASC ? SortType.asc : SortType.desc;
        const searchLoginTerm = req.query.searchLoginTerm !== undefined ? req.query.searchLoginTerm.trim() : '';
        const searchEmailTerm = req.query.searchEmailTerm !== undefined ? req.query.searchEmailTerm.trim() : '';

        const result = await UsersQueryRepository.getUsers(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        );

        res.send(result);
    })

userRouter.post('/',
    basicAuth,
    emailValidation,
    fieldValidation('password', 'field is required and max length 100 symbols', 100),
    inputValidationMiddleware,
    async (req: Request<any, any, CreatUserDto>, res: Response): Promise<any> => {
        const result = await UsersService.creatUser(req.body);

        if (result) {
            res.status(400).send(result);
            return;
        }
        res.status(204).send();
    });

userRouter.delete("/:id",
    basicAuth,
    ValidationByParamId(UsersService.deleteUser, USER_NOT_FOUND),
    inputValidationMiddleware,
    async (req, res): Promise<void> => {
        const userId = req.params?.id;
        const objectIdUserId = new ObjectId(userId);
        await UsersService.deleteUser(objectIdUserId);
        res.status(204);
    })
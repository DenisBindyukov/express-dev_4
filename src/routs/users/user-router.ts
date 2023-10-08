import {Request, Response, Router} from "express";
import {CreatUserDto} from "./types/user.types";
import UsersService from "../../domain/users-service";
import {auth} from "../../middlewares/authMiddleware";

export const userRouter = Router({});

userRouter.post('/',
    auth,
    async (req: Request<any, any, CreatUserDto>, res: Response): Promise<any> => {
    const result = UsersService.creatUser(req.body);
    res.status(201).send(result);
});
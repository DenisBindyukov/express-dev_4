import {Request, Response, Router} from "express";
import postsService from "../domain/post-service";
import postsQueryRepository from "../repositories/posts/query-repositories/query-repositories";
import {auth} from "../middlewares/authMiddleware";
import {
    blogIdValidation,
    contentValidation,
    inputValidationMiddleware,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/input-validation-middleware";
import {PostDtoType} from "../repositories/posts/posts-repositories/types/types";
import {PaginationQueryParamsType, SortType} from "../repositories/types/ownTypes";
import {ASC} from "../repositories/types/constants";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request<any, any, any, PaginationQueryParamsType>, res: Response) => {
    const posts = await postsQueryRepository.getPosts(
        req.query?.pageNumber && Number(req.query.pageNumber),
        req.query?.pageSize && Number(req.query.pageSize),
        req.query?.searchNameTerm && req.query.searchNameTerm,
        req.query?.sortBy && req.query.sortBy.trim(),
        req.query?.sortDirection === ASC ? SortType.asc : SortType.desc,
    );
    res.send(posts);
});

postsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const post = await postsQueryRepository.getPost(req.params.id);
        if (post) {
            res.send(post);
            return
        }

        res.status(404).send();
    });


postsRouter.post('/',
    auth,
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, PostDtoType>, res: Response) => {
        const post = await postsService.createPost(req.body);
        if (post) res.status(201).send(post);
        else res.status(404).send('Blog not found');
    });

postsRouter.put('/:id',
    auth,
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const postWasUpdated = await postsService.updatePost(req.params.id, req.body);
        if (postWasUpdated) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    });


postsRouter.delete('/:id',
    auth,
    async (req: Request<{ id: string }>, res: Response) => {
        const postWasDelete = await postsService.deletePost(req.params.id);
        if (postWasDelete) {
            res.status(204).send()
        } else {
            res.status(404).send()
        }
    });

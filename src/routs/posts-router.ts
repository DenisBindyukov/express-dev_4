import {Request, Response, Router} from "express";
import postsService from "../domain/post-service";
import {auth} from "../middlewares/authMiddleware";
import {
    blogIdValidation,
    contentValidation,
    inputValidationMiddleware,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/input-validation-middleware";
import {PostDtoType} from "../repositories/posts/types/types";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsService.getPosts();
    res.send(posts)
});

postsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const post = await postsService.getPost(req.params.id);
        if (post) {
            res.send(post);
            return
        }

        res.status(404).send()
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

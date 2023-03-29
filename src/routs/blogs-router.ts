import {Request, Response, Router} from "express";
import {auth} from "../middlewares/authMiddleware";
import blogService from "../domain/blogs-service";
import {
    descriptionValidation,
    inputValidationMiddleware,
    nameValidation, websiteUrlValidation
} from "../middlewares/input-validation-middleware";
import {BlogDtoType} from "./types/types";

export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogService.getBlogs();
    res.send(blogs);
});

blogsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const blog = await blogService.getBlogById(req.params.id);
        if (blog) {
            res.status(200).send(blog);
        } else {
            res.status(404).send();
        }

    });


blogsRouter.post('/',
    auth,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, BlogDtoType>, res: Response) => {
        const newBlog = await blogService.createBlog(req.body);
        res.status(201).send(newBlog)
    });

blogsRouter.put('/:id',
    auth,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const updatedBlog = await blogService.updateBlog(req.params.id, req.body)
        if (updatedBlog) {
            res.status(204).send()
        } else {
            res.status(404).send()
        }
    });


blogsRouter.delete('/:id',
    auth,
    async (req: Request, res: Response) => {
        const wasDeleted = await blogService.deleteBlog(req.params.id)

        if (wasDeleted) {
            res.status(204).send()
        } else {
            res.status(404).send()
        }
    });

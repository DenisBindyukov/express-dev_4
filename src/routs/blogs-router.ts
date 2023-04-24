import {Request, Response, Router} from "express";
import {auth} from "../middlewares/authMiddleware";
import blogService from "../domain/blogs-service";
import {
    descriptionValidation,
    inputValidationMiddleware,
    nameValidation,
    websiteUrlValidation
} from "../middlewares/input-validation-middleware";
import blogsQueryRepositories from "../repositories/blog/query-repositories";
import {ASC, BlogDtoType, BlogQueryParamsType, SortType, UrlParamsType} from "../repositories/blog/types/types";


export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request<any, any, any, BlogQueryParamsType>, res: Response) => {
    const blogs = await blogsQueryRepositories.getBlogs(
        req.query?.pageNumber && Number(req.query.pageNumber),
        req.query?.pageSize && Number(req.query.pageSize),
        req.query?.searchNameTerm && req.query.searchNameTerm,
        req.query?.sortBy && req.query.sortBy,
        req.query?.sortDirection === ASC ? SortType.asc : SortType.desc,
    );
    res.send(blogs);
});

blogsRouter.get('/:blogId',
    async (req: Request<UrlParamsType, any, any, BlogQueryParamsType>, res: Response) => {
        const blog = await blogService.getBlogById(req.params.blogId);
        if (blog) {
            res.status(200).send(blog);
        } else {
            res.status(404).send();
        }

    });

blogsRouter.get('/:blogId/posts',
    async (req: Request<UrlParamsType, any, any, BlogQueryParamsType>, res: Response) => {
        const blog = await blogService.getBlogById(req.params.blogId);
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

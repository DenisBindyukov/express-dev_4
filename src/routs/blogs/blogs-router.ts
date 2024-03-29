import {Request, Response, Router} from "express";
import {basicAuth} from "../../middlewares/authMiddleware";
import blogService from "../../domain/blogs-service";
import blogsQueryRepositories from "../../repositories/blogs/query-repositories/query-repository";
import {
    contentValidation,
    descriptionValidation,
    inputValidationMiddleware,
    nameValidation, shortDescriptionValidation, titleValidation,
    websiteUrlValidation
} from "../../middlewares/input-validation-middleware";
import {ASC} from "./types/constants";
import {PaginationQueryParamsType, SortType} from "./types/pagination-types";
import {BlogDtoType, BlogUrlParamsType} from "./types/blog.types";


export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request<any, any, any, PaginationQueryParamsType>, res: Response) => {
    const blogs = await blogsQueryRepositories.getBlogs(
        req.query?.pageNumber && Number(req.query.pageNumber),
        req.query?.pageSize && Number(req.query.pageSize),
        req.query?.searchNameTerm && req.query.searchNameTerm,
        req.query?.sortBy && req.query.sortBy.trim(),
        req.query?.sortDirection === ASC ? SortType.asc : SortType.desc,
    );
    res.send(blogs);
});

blogsRouter.get('/:blogId',
    async (req: Request<BlogUrlParamsType, any, any, PaginationQueryParamsType>, res: Response) => {
        const blog = await blogsQueryRepositories.getBlogById(req.params.blogId);
        if (blog) {
            res.status(200).send(blog);
        } else {
            res.status(404).send();
        }
    });

blogsRouter.get('/:blogId/posts',
    async (req: Request<BlogUrlParamsType, any, any, PaginationQueryParamsType>, res: Response) => {
        const blog = await blogsQueryRepositories.getBlogById(req.params.blogId);
        if (blog) {
            const posts = await blogsQueryRepositories.getPostsByBlogId(
                req.params.blogId,
                req.query?.pageNumber && Number(req.query.pageNumber),
                req.query?.pageSize && Number(req.query.pageSize),
                req.query?.sortBy && req.query.sortBy.trim(),
                req.query?.sortDirection?.trim() === ASC ? SortType.asc : SortType.desc,
            );
            res.status(200).send(posts);
            return;
        }
        res.status(404).send('Blog not found');
    });

blogsRouter.post('/:blogId/posts',
    basicAuth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if (req.params?.blogId) {
            const post = await blogService.createPostByBlogId({...req.body, blogId: req.params.blogId});
            if (post) {
                res.status(201).send(post);
                return;
            }
        }

        res.status(404).send('Blog not found');
    });

blogsRouter.post('/',
    basicAuth,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, BlogDtoType>, res: Response) => {
        const newBlog = await blogService.createBlog(req.body);
        res.status(201).send(newBlog)
    });

blogsRouter.put('/:id',
    basicAuth,
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
    basicAuth,
    async (req: Request, res: Response) => {
        const wasDeleted = await blogService.deleteBlog(req.params.id)

        if (wasDeleted) {
            res.status(204).send()
        } else {
            res.status(404).send()
        }
    });

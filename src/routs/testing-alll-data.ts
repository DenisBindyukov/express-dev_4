import {Request, Response, Router} from "express";
import blogsRepositories from '../repositories/blogs/blogs-repositories/blogs-repository'
import postsRepositories from '../repositories/posts/posts-repositories/posts-repository'

export const  testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    const resultBlogs = await blogsRepositories.clearCluster()
    const resultPosts = await postsRepositories.clearCluster()

    if (resultBlogs && resultPosts) {
        res.status(204).send()
    } else  {
        throw new Error("Database level error")
    }

});

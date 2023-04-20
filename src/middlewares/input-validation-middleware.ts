import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import blogsRepositories from '../repositories/blog/blogs-repositories'

export function inputValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const arrayErrors = errors.array({onlyFirstError: true});
        res.status(400).json({
            errorsMessages: arrayErrors.map((e) => ({message: e.msg, field: e.param}))
        });
    } else {
        next();
    }
}

export const nameValidation = body('name')
    .isString()
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('field is required and max length 15 symbols')
export const descriptionValidation = body('description')
    .isString()
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage('field is required and max length 500 symbols')
export const websiteUrlValidation = body('websiteUrl')
    .isURL()
export const titleValidation = body('title')
    .isString()
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('field is required and max length 30 symbols')
export const shortDescriptionValidation = body('shortDescription')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('field is required and max length 100 symbols')
export const contentValidation = body('content')
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('field is required and max length 1000 symbols')
export const blogIdValidation = body('blogId').custom(async (value) => {
    const blog = await blogsRepositories.getBlogById(value)
    if (!blog) {
        throw new Error('blog not found')
    } else {
        return true
    }
})


import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";
import blogsQueryRepositories from "../repositories/blogs/query-repositories/query-repository";
import {ObjectId} from "mongodb";

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
    const blog = await blogsQueryRepositories.getBlogById(value)
    if (!blog) {
        throw new Error('blogs not found')
    } else {
        return true
    }
})

export const emailValidation = body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail();


export const ValidationByParamId = ( findMethod: any, error: string, ) =>
    body().custom(async  (value, { req }): Promise<boolean> => {
    const id = req.params?.id;

    try {
        const objectId = new ObjectId(id);
        const res = await findMethod(objectId)

        if (!res) {
            throw new Error(error)
        } else {
            return true
        }

    } catch (e) {
        throw new Error(error)
    }
})

export const fieldValidation = (field: string, textError: string, maxLetterCount: number = 300, minLetterCount: number = 1 ) => {
    return body(field)
        .isString()
        .trim()
        .isLength({min: minLetterCount, max: maxLetterCount})
        .withMessage(textError)

}


import {NextFunction, Request, Response} from 'express'

const credentials = {
    login: 'admin',
    password: 'qwerty'
}

let data = `${credentials.login}:${credentials.password}`;
let base64data =  Buffer.from(data, 'utf-8').toString('base64');

export let auth = (req: Request<any,any,any,any>, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        res.send(401)
        return
    }
    if (authHeader && authHeader === `Basic ${base64data}`) {
        next();
    } else {
        res.send(401)
        return
    }
}
import {ObjectId} from "mongodb";

export interface BaseDBType {
    _id?: ObjectId;
    createdDate?: Date;
}

export interface BlogDBType  extends BaseDBType{
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}

export interface PostDBType extends BaseDBType{
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date
}

export interface UserDBType extends BaseDBType{
    userName: string
    email: string
    passwordHash: string
    passwordSalt: string
}
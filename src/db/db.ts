import * as dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {BlogDBType, PostDBType, UserDBType} from "./types/db-types";


dotenv.config()
const mongoUri = process.env.MONGO_URL || '';

export const client = new MongoClient(mongoUri);

//Name db "blogger-platform"
const db = client.db();
//Name collection "blogs" and "posts"
export const blogsCollection = db.collection<BlogDBType>('blogs');
export const postsCollection = db.collection<PostDBType>('posts');
export const userCollection = db.collection<UserDBType>('user');

export async function runDb() {
    try {
        await client.connect();
        console.log('client mongo db connected');
    } catch (e) {
        console.log('can not to connect to mongo db');
    }
}
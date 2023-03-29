export interface BlogDtoType {
    name: string,
    description: string,
    websiteUrl: string
}

export interface PostDtoType {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}
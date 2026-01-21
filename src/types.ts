export type ResourceType = "Link" | "Note" | "To Do";

export interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    content: string;
    createdAt: number;
    tags?: string[];
    isFavorite?: boolean;
    isArchived?: boolean;
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

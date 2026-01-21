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
    url?: string;
    description?: string;
    images?: string[];
    documents?: string[];
    dueDate?: string;
    dueTime?: string;
    priority?: 'Low' | 'Medium' | 'High';
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

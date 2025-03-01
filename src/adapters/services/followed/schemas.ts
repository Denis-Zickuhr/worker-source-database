import {z} from "zod";

export const mongoDbIdSchema = z.string().refine((val) => /^[a-fA-F0-9]{24}$/.test(val), {
    message: 'Must be a valid ID',
});

export const GetDocumentByIdSchema = z.object({
    id: mongoDbIdSchema,
});

export const GetFollowedSchema = GetDocumentByIdSchema.extend({
    includeFollowed: z.coerce.boolean().default(false)
});

export const DeleteDocumentByIdSchema = z.object({
    id: mongoDbIdSchema,
});

export const PostFollowedSchema = z.object({
    name: z.string(),
    source: z.string(),
    sync_rate: z.number().optional(),
});

export const PatchFollowedSchema = z.object({
    id: mongoDbIdSchema,
    name: z.string().optional(),
    source: z.string().optional(),
    sync_rate: z.number().optional(),
});

export const PaginatedListSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const ListFollowedSchema =  PaginatedListSchema.extend({
    filter: z.object({
        name: z.string().optional(),
        source: z.string().optional(),
    }).optional(),
});

export type PaginatedListFilters = z.infer<typeof PaginatedListSchema>;

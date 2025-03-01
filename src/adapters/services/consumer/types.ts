import { z } from "zod";
import {mongoDbIdSchema} from "../followed/schemas";

export const SyncMessageSchema = z.object({
    _id: mongoDbIdSchema,
    name: z.string(),
    entry_id: mongoDbIdSchema,
    source: z.string().url(),
    sync_rate: z.string().regex(/^\d+$/).transform(Number).optional(),
    last_sync: z.string().datetime().optional(),
    last_status: z.number().optional(),
});

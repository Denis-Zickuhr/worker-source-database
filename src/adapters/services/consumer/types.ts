import { z } from "zod";
import {mongoDbIdSchema} from "../followed/schemas";

export const SyncMessageSchema = z.object({
    _id: mongoDbIdSchema,
    entry_id: mongoDbIdSchema,
    source: z.string(),
});

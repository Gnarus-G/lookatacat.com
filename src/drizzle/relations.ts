import { relations } from "drizzle-orm/relations";
import { Cat, CatPic } from "./schema";

export const catsRelations = relations(Cat, ({ many }) => ({
  pics: many(CatPic),
}));

export const catPicsRelations = relations(CatPic, ({ one }) => ({
  cat: one(Cat, {
    fields: [CatPic.catId],
    references: [Cat.id],
  }),
}));

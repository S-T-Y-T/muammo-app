import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const muammolarTable = sqliteTable("muammolar", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sarlavha: text("sarlavha").notNull(),
  tavsif: text("tavsif").notNull(),
  muhimlik: text("muhimlik").notNull(), // 'yuqori' | 'orta'
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  rasm_url: text("rasm_url"),
  holat: text("holat").default('yangi').notNull(), // 'yangi' | 'jarayonda' | 'hal_etildi'
  yaratilgan_sana: text("yaratilgan_sana").$defaultFn(() => new Date().toISOString()).notNull(),
});

// export const insertMuammoSchema = createInsertSchema(muammolarTable).omit({ 
//   id: true,
//   holat: true,
//   yaratilgan_sana: true
// });

// export type InsertMuammo = z.infer<typeof insertMuammoSchema>;
export type Muammo = typeof muammolarTable.$inferSelect;

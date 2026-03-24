import { Router, type IRouter } from "express";
import { db, muammolarTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const createMuammoSchema = {
  parse: (data: any) => {
    if (!data.sarlavha || !data.tavsif || !data.muhimlik || 
        data.lat === undefined || data.lng === undefined) {
      throw new Error("Missing required fields");
    }
    return data;
  }
};

const router: IRouter = Router();

router.get("/muammolar", async (_req, res) => {
  try {
    const muammolar = await db.select().from(muammolarTable).orderBy(desc(muammolarTable.yaratilgan_sana));
    res.json(muammolar);
  } catch (error) {
    console.error("Failed to fetch muammolar:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/muammolar", async (req, res) => {
  try {
    const data = createMuammoSchema.parse(req.body);
    
    // insertMuammoSchema and CreateMuammoRequest should be similar
    const result = await db.insert(muammolarTable).values({
      sarlavha: data.sarlavha,
      tavsif: data.tavsif,
      muhimlik: data.muhimlik,
      lat: data.lat,
      lng: data.lng,
      rasm_url: data.rasm_url || null,
    }).returning();
    
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Failed to insert muammo:", error);
    res.status(400).json({ error: "Bad Request" });
  }
});

export default router;

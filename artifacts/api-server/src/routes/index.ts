import { Router, type IRouter } from "express";
import healthRouter from "./health";
import muammolarRouter from "./muammolar";

const router: IRouter = Router();

router.use(healthRouter);
router.use(muammolarRouter);

export default router;

import { Request, Response } from "express";
import { executeJob } from "../jobs/Job";
/**
 * GET /
 * Home page.
 */
export let index = (_: Request, res: Response) => {
  res.json({
    message: "App is runing",
  });
};

export const startJob = (_: Request, res: Response) => {
  res.json({
    message: "Job was executed",
  });
  executeJob();
};

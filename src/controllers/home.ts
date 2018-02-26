import { Request, Response } from "express";
import { executeJob } from "../jobs/Job";
/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};

export const startJob = (req: Request, res: Response) => {
  res.render("job");
  executeJob();
};

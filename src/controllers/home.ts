import { Request, Response } from "express";
import { executeJob } from "../jobs/job";
import { logSync } from "../services/LogService";
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
  setTimeout(async () => {
    await logSync("Job exited", "success");
  }, 10000);
};

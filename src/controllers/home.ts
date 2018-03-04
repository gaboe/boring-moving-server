import { Request, Response } from "express";
import { executeJob } from "../jobs/Job";
/**
 * GET /
 * Home page.
 */
export let index = (_: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};

export const startJob = (_: Request, res: Response) => {
  res.render("job");
  executeJob();
};

import { RequestHandler } from "express";

export const get: RequestHandler = (req, res) => {
  setTimeout(() => {
    res.send('available');
  }, 100);
};

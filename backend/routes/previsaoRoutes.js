import express from "express";
import { PrevisaoTempo } from "../controllers/PrevisaoTempo.js";

export const router = express.Router();

router.get("/getAll", PrevisaoTempo.getAll);

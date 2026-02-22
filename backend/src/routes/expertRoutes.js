import express from "express";
import {
  getExperts,
  getExpertById,
  getExpertSlots,
  getCategories,
  createExpert,
  updateExpert,
  deleteExpert,
} from "../controllers/expertController.js";

const router = express.Router();

/*
GET    /api/experts        -> Get all experts
GET    /api/experts/:id    -> Get single expert
POST   /api/experts        -> Create expert
PUT    /api/experts/:id    -> Update expert
DELETE /api/experts/:id    -> Delete expert
*/

router.route("/")
  .get(getExperts)
  .post(createExpert);

router.route("/categories")
  .get(getCategories);

router.route("/:id/slots")
  .get(getExpertSlots);

router.route("/:id")
  .get(getExpertById)
  .put(updateExpert)
  .delete(deleteExpert);

router.get("/:id/slots", getExpertSlots);

export default router;
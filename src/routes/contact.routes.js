import express from "express"
import {verifyUser} from "../middleware/verifyUser.js"
import { createContact, editContact, searchContact } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/create",verifyUser,createContact)
router.put("/edit",verifyUser,editContact)
router.get("/search",verifyUser,searchContact)

export default router
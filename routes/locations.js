import { Router } from "express";
const router = Router();
import { getAllParkingLocations, getParkingLocationById } from "../data/locations.js";
import validation from '../helpers.js'


router
    .route("/")
    .get(async (req, res) => {
        try {
            const locations = await getAllParkingLocations(req.params.id);
            return res.json(locations);
        } catch (e) {
            return res.status(404).json({error: e});
        }
    });

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const locations = await getParkingLocationById(req.params.id);
            return res.json(locations);
        } catch (e) {
            return res.status(404).json({error: e});
        }
    });


export default router;
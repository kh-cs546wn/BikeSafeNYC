import { Router } from "express";
const router = Router();
import { getAllParkingLocations, getParkingLocationById, searchParkingLocationsByName, getParkingLocationsByCoordinates} from "../data/locations.js";
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
    .route("/find/coordinates")
    .get(async (req, res) => {
        try {
            let {latitude, longitude, distance} = req.query;
            // Example: http://localhost:3000/locations/find?latitude=40.0&longitude=-74.2&distance=0.5
            // Min: (Staten Island): 40.506011, -74.246361
            // Max: (Rye) 40.907993, -73.700283

            // Example for sorting: http://localhost:3000/locations/find?latitude=40.707&longitude=-73.973&distance=1
            // 102 S 6 ST Large Hoop is indexed earlier in the DB, but 50 DIVISION AV U Rack is closer by distance

            latitude = parseFloat(latitude);
            longitude = parseFloat(longitude);
            distance = parseFloat(distance);

            if (!latitude || latitude === undefined) throw 'Missing latitude!';
            if (!longitude || latitude === longitude) throw 'Missing longitude!';
            if (!distance || distance === undefined) throw 'Missing distance!';


            const {latMin, latMax, longMin, longMax}  = validation.getBoundingCoordinatesForDistance(latitude, longitude, distance);

            const locations = await getParkingLocationsByCoordinates(latMin, latMax, longMin, longMax, latitude, longitude);
            return res.json(locations);
        } catch (e) {
            return res.status(404).json({error: e});
        }
    });

router
    .route("/find/address/:address")
    .get(async (req, res) => {
        try {
            // Example: http://localhost:3000/locations/find/address/89 E 42nd St, New York, NY 10017?distance=0.25

            const address = req.params.address;
            if (!address || address === undefined) throw 'Missing address!';

            // Relies on https://nominatim.openstreetmap.org/search API
            const {latitude, longitude} = await validation.getCoordinatesForAddress(address);
            const distance = parseFloat(req.query.distance);
            
            if (!latitude || latitude === undefined) throw 'Missing latitude!';
            if (!longitude || latitude === undefined) throw 'Missing longitude!';
            if (!distance || distance === undefined) throw 'Missing distance!';

            const {latMin, latMax, longMin, longMax}  = validation.getBoundingCoordinatesForDistance(latitude, longitude, distance);

            const locations = await getParkingLocationsByCoordinates(latMin, latMax, longMin, longMax, latitude, longitude);
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

router
    .route("/search/:searchTerm")
    .get(async (req, res) => {
        /**
         * Note: Spaces in URLs are encoded as - %20
         * But express automatically decodes %20 back into spaces, so no additional handling needed
         * example: http://localhost:3000/locations/search/grand conc
         */
        try {
            const locations = await searchParkingLocationsByName(req.params.searchTerm);
            return res.json(locations);
        } catch (e) {
            return res.status(404).json({error: e});
        }
    });





export default router;
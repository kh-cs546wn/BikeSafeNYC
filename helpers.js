//You can add and export any helper functions/validation functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from "mongodb";
import axios from "axios";

const exportedMethods = {
    checkId(id){
        if (id === undefined) throw 'No ID provided!';

        if (typeof id !== 'string') throw 'Bad Request!';

        
        if (!id) throw 'No ID provided!';
        id = id.trim();
        if (id.length === 0) throw 'Empty ID!';

        if (!ObjectId.isValid(id)) throw 'Invalid ObjectId!';
        return id;
    },

    getBoundingCoordinatesForDistance(latitude, longitude, distance){
        // Distance input is in miles

        const latitudeToRadians = latitude * Math.PI / 180;
        const latitudeDelta = distance / 69;
        const longitudeDelta = distance / (69 * Math.cos(latitudeToRadians));


        const latMin = latitude - latitudeDelta;
        const latMax = latitude + latitudeDelta;
        const longMin = longitude - longitudeDelta;
        const longMax = longitude + longitudeDelta;

        return {latMin, latMax, longMin, longMax};
    },

    getDistanceBetweenCoordinates(lat1, long1, lat2, long2){
        const latDelta = lat2 - lat1;
        const longDelta = (long2 - long1) * Math.cos(lat1 * Math.PI / 180);

        return Math.sqrt(latDelta ** 2 + longDelta ** 2);
    },

    async getCoordinatesForAddress(address){
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
            params: {
                q: address,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "bikesafe-nyc"
            }
            }
        );

        if (!response.data.length) {
            throw new Error("Address not found");
        }

        return {
            latitude: parseFloat(response.data[0].lat),
            longitude: parseFloat(response.data[0].lon)
        };

    }
};

export default exportedMethods
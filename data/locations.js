import { parkingLocations } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import validation from '../helpers.js'


export const getAllParkingLocations = async () => {
    const parkingLocationsCollection = await parkingLocations();
    return await parkingLocationsCollection.find({}).toArray();
}


export const getParkingLocationById = async (id) => {
    try{
      id = validation.checkId(id);
    }catch (e){
      throw new Error(e);
    }

    const parkingLocationsCollection = await parkingLocations();
    const locations = await parkingLocationsCollection.findOne({_id: new ObjectId(id)});

    if (!locations) throw `Parking location ${id} not found!`;
    return locations;

};


export const searchParkingLocationsByName = async (searchTerm) => {
    const parkingLocationsCollection = await parkingLocations();

    const locations = await parkingLocationsCollection
    .find({locationName : {$regex: searchTerm, $options: "i"}})
    .toArray();

    if (!locations) throw `No locations found for search term: ${searchTerm}!`;

    console.log(`Returning ${locations.length} locations searched by name`);

    return locations;

};


export const getParkingLocationsByCoordinates = async (latMin, latMax, longMin, longMax, originLat, originLong) => {
    console.log(`Searching for coords -> lat: ${originLat} long: ${originLong} with Boundaries -> lat: ${latMin}<->${latMax} long: ${longMin}<->${longMax}`);

    const parkingLocationsCollection = await parkingLocations();

    const locations = await parkingLocationsCollection
      .find({latitude: {$gte: latMin, $lte: latMax},
            longitude: {$gte: longMin, $lte: longMax}})
      .toArray();

    if (!locations) throw `No locations found within distance!`;

    console.log(`Returning ${locations.length} locations searched by coordinates/address`);
    
    // Sort locations by distance from origin - adds "distance" field to response object
    return locations
      .sort((a, b) =>
        validation.getDistanceBetweenCoordinates(originLat, originLong, a.latitude, a.longitude) - 
        validation.getDistanceBetweenCoordinates(originLat, originLong, b.latitude, b.longitude)
      )
      .map(location => ({
        ...location,
        distance: Math.round(validation.getDistanceBetweenCoordinates(originLat, originLong, location.latitude, location.longitude) * 69 * 100) / 100
      }));
};

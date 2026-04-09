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

    console.log(id);
    

    const parkingLocationsCollection = await parkingLocations();
    const locations = await parkingLocationsCollection.findOne({_id: new ObjectId(id)});

    if (!locations) throw `Parking location! ${id} not found!`;
    return locations;

};
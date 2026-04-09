import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {legacyTheftRecords, parkingLocations, theftReports, users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

// JSON files for seeding
import legacyTheftSeedData from './seedLegacyData.json' with {type: 'json'};
import parkingLocationData from './seedParkingLocationData.json' with {type: 'json'};

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const legacyTheftCollection = await legacyTheftRecords();
    const parkingLocationsCollection = await parkingLocations();

    await legacyTheftCollection.insertMany(legacyTheftSeedData);
    await parkingLocationsCollection.insertMany(parkingLocationData);


    console.log('Seeded data!!!');

    await closeConnection();

};

main();
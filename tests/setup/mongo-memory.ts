import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, connection } from "mongoose";

let mongo: MongoMemoryServer;

/**
 * Connects to a new in-memory MongoDB instance.
 * Use before running tests.
 */
export const connectTestDB = async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await connect(uri);
}

/**
 * Disconnects from the in-memory MongoDB instance,
 * drops the database, and stops the server.
 * Use after running tests.
 */
export const disconnectTestDB = async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongo.stop();
}
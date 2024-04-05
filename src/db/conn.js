import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI;
const mongoURIs = "mongodb+srv://raphaelvillaroman:villaroman@ccapdev-cluster.jpugkbw.mongodb.net/"; //atlas

export function connectToMongo(dbName = process.env.DB_NAME) {
    return mongoose.connect(mongoURI, {dbName: dbName});
};


// These are just used for closing the connection properly
function signalHandler() {
    console.log("Closing MongoDB connection...");
    mongoose.disconnect();
    client.close();
}

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);
import { MongoClient } from 'mongodb';

class MongoDB extends MongoClient {
    public constructor() {
        super(process.env.MONGO!, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    public async connect() {
        return super.connect();
    }

    public async createIndex() {
        return Promise.all([]);
    }
}

const Connection = new MongoDB();

export { Connection };
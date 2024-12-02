import { MongoClient } from 'mongodb';

class MongoDB extends MongoClient {
	public constructor() {
		super(process.env.DATABASE_CONNECTION_URL!);
	}
}

export const DatabaseProvider = new MongoDB();
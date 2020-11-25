import { MongoClient } from 'mongodb';

class MongoDB extends MongoClient {
	constructor(options: Object) {
		super(process.env.DB, options);
	}
}

export default MongoDB;

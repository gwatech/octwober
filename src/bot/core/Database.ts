import { MongoClient } from 'mongodb';
import { config } from './config'

class MongoDB extends MongoClient {
	constructor(options: Object) {
		super(config.database, options);
	}
}

export default MongoDB;

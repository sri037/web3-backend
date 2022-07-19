import { connect } from 'mongoose';

const mongoose = require('mongoose');

export default class DbClient {

    public async connect() {
        const mongoUri = `mongodb://${process.env.DB_HOST}/${process.env.DB_SCHEMA}`;
        return connect(mongoUri);
    }

    // Cast id to mongo objectID
    public static buildMongoQuery(query: any): Promise<any> {
        return new Promise((resolve: any): any => {
            let buildQuery = {};
            for (let key in query) {
                let value = query[key];
                if ((key.toLowerCase().includes('_id')) || (key.toLowerCase().includes('userId'))) {
                    buildQuery[key] = mongoose.Types.ObjectId(value);
                } else {
                    buildQuery[key] = value;
                }
            }
            return resolve(buildQuery);
        });
    }
}

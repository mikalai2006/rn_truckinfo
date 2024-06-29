import Realm, {BSON, ObjectSchema} from 'realm';

export class CountryStat extends Realm.Object<CountryStat> {
    _id!: BSON.ObjectId;
    idCountry!: string;
    code!: string;
    count?: number;
    lastUpdatedAt!: string;

    static schema: ObjectSchema = {
        name: 'CountryStat',
        properties: {
            _id: 'objectId',
            idCountry: 'string',
            code: {type: 'string'},
            count: 'int?',
            lastUpdatedAt: {type: 'string', optional: true},
        },
        primaryKey: '_id',
    };
}

import Realm, {BSON, ObjectSchema} from 'realm';

export class PointSchema extends Realm.Object<PointSchema> {
    _id!: BSON.ObjectId;
    lat!: number;
    lon!: number;
    accuracy!: number;
    createdAt!: string;
    isLocal?: boolean;

    static schema: ObjectSchema = {
        name: 'PointSchema',
        properties: {
            _id: 'objectId',
            lat: 'double',
            lon: 'double',
            accuracy: 'double',
            createdAt: {type: 'string', optional: true},
            isLocal: 'bool?',
        },
        primaryKey: '_id',
    };
}

export type TPointSchema = {
    [Property in keyof PointSchema]?: PointSchema[Property];
};

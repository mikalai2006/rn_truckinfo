import Realm, {BSON, ObjectSchema} from 'realm';

export class ReviewSchema extends Realm.Object<ReviewSchema> {
    _id!: BSON.ObjectId; // _id
    nlid!: string; // local node id
    nodeId!: string; // server node id

    review!: string;
    rate!: number;
    oldRate!: number;
    isLocal?: boolean;
    updatedAt!: string;

    static schema: ObjectSchema = {
        name: 'ReviewSchema',
        properties: {
            _id: 'objectId',
            nlid: 'string',
            nodeId: 'string',
            review: 'string',
            rate: {type: 'int'},
            oldRate: {type: 'int'},
            isLocal: 'bool?',
            updatedAt: {type: 'string', optional: true},
        },
        primaryKey: '_id',
    };
}

export type TReviewSchema = {
    [Property in keyof ReviewSchema]?: ReviewSchema[Property];
};

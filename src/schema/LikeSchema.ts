import Realm, {BSON, ObjectSchema} from 'realm';

export class LikeSchema extends Realm.Object<LikeSchema> {
    _id!: BSON.ObjectId; // _id
    nlid!: string;
    ccode!: string;
    localNodedataId!: string; // local nodedata id
    serverNodedataId!: string; // server nodedata id
    value!: number;
    oldValue!: number;
    isLocal?: boolean;
    // tagId!: string;
    // tagoptId!: string;

    static schema: ObjectSchema = {
        name: 'LikeSchema',
        properties: {
            _id: 'objectId',
            nlid: 'string',
            ccode: 'string',
            localNodedataId: 'string',
            serverNodedataId: 'string',
            value: {type: 'int'},
            oldValue: {type: 'int'},
            isLocal: 'bool?',
            // tagId: 'string',
            // tagoptId: 'string',
        },
        primaryKey: '_id',
    };
}

export type TLikeSchema = {
    [Property in keyof LikeSchema]?: LikeSchema[Property];
};

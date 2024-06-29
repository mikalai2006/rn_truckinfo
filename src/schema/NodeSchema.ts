import Realm, {BSON, ObjectSchema} from 'realm';
import {NodeDataSchemaEmbedded} from './NodeDataSchema';

export class NodeSchema extends Realm.Object<NodeSchema> {
    _id!: BSON.ObjectId; // app _id
    sid!: string; // server _id
    name!: string;
    type!: string;
    lat?: number;
    lon?: number;
    ccode!: string;
    // userId?: string;
    my!: boolean;
    data!: Realm.List<NodeDataSchemaEmbedded>;
    createdAt!: string;

    static schema: ObjectSchema = {
        name: 'NodeSchema',
        properties: {
            _id: 'objectId',
            sid: 'string',
            name: {type: 'string'},
            type: {type: 'string', indexed: 'full-text'},
            lat: 'double?',
            lon: 'double?',
            ccode: {type: 'string'},
            // userId: {type: 'string', optional: true},
            my: 'bool',
            // embedded object
            data: {type: 'list', objectType: 'NodeDataSchemaEmbedded'},
            createdAt: {type: 'string', optional: true},
        },
        primaryKey: '_id',
    };
}

export type TNodeSchema = {
    [Property in keyof NodeSchema]?: NodeSchema[Property];
};

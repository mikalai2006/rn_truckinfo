import Realm, {BSON, ObjectSchema} from 'realm';

export class NodeAuditSchema extends Realm.Object<NodeAuditSchema> {
    _id!: BSON.ObjectId; // _id
    nlid!: string; // local node id
    nodeId!: string; // server node id

    message!: string;
    status!: number;
    isLocal?: boolean;

    static schema: ObjectSchema = {
        name: 'NodeAuditSchema',
        properties: {
            _id: 'objectId',
            nlid: 'string',
            nodeId: 'string',
            message: 'string',
            status: {type: 'int'},
            isLocal: 'bool?',
        },
        primaryKey: '_id',
    };
}

export type TNodeAuditSchema = {
    [Property in keyof NodeAuditSchema]?: NodeAuditSchema[Property];
};

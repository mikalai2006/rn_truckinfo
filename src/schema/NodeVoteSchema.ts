import Realm, {BSON, ObjectSchema} from 'realm';

export class NodeVoteSchema extends Realm.Object<NodeVoteSchema> {
    _id!: BSON.ObjectId; // _id
    nlid!: string; // local node id
    nodeId!: string; // server node id

    value!: number;
    oldValue!: number;

    isLocal?: boolean;

    static schema: ObjectSchema = {
        name: 'NodeVoteSchema',
        properties: {
            _id: 'objectId',
            nlid: 'string',
            nodeId: 'string',
            value: {type: 'int'},
            oldValue: {type: 'int'},
            isLocal: 'bool?',
        },
        primaryKey: '_id',
    };
}

export type TNodeVoteSchema = {
    [Property in keyof NodeVoteSchema]?: NodeVoteSchema[Property];
};

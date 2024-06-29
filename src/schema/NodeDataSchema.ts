import Realm, {BSON} from 'realm';

export class NodeDataSchema extends Realm.Object<NodeDataSchema> {
    _id!: BSON.ObjectId; // app _id
    sid!: string; // server _id
    nlid!: string; // id local node
    nsid?: string; // id server node
    tagoptId!: string;
    tagId!: string;
    value?: Realm.Mixed;
    isLocal?: boolean;

    // node!: Realm.List<NodeSchema>;

    static schema: Realm.ObjectSchema = {
        name: 'NodeDataSchema',
        // embedded: true,
        properties: {
            _id: 'objectId',
            sid: 'string',
            nlid: 'string',
            nsid: 'string?',
            tagoptId: 'string',
            tagId: 'string',
            value: 'mixed?',
            isLocal: 'bool?',

            // related node objects
            // node: {
            //     type: 'linkingObjects',
            //     objectType: 'NodeSchema',
            //     property: 'data',
            // },
        },
        primaryKey: '_id',
    };
}

export class NodeDataSchemaEmbedded extends Realm.Object<NodeDataSchemaEmbedded> {
    sid!: string;
    tagoptId!: string;
    tagId!: string;
    value?: Realm.Mixed;

    static schema: Realm.ObjectSchema = {
        name: 'NodeDataSchemaEmbedded',
        embedded: true,
        properties: {
            sid: 'string',
            tagoptId: 'string',
            tagId: {type: 'string', indexed: true},
            value: 'mixed',
        },
    };
}

export type TNodeDataSchema = {
    [Property in keyof NodeDataSchema]?: NodeDataSchema[Property];
};

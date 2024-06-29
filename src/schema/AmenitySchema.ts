// import Realm, {BSON, ObjectSchema} from 'realm';

// export class AmenitySchema extends Realm.Object<AmenitySchema> {
//     _id!: BSON.ObjectId;
//     key!: string;
//     group!: string;
//     title?: string;
//     type!: string;
//     description!: string;
//     v?: number;
//     // data!: Realm.List<NodeDataSchema>;

//     static schema: ObjectSchema = {
//         name: 'AmenitySchema',
//         properties: {
//             _id: 'objectId',
//             key: {type: 'string', indexed: 'full-text'},
//             group: {type: 'string'},
//             title: {type: 'string'},
//             type: {type: 'string'},
//             description: {type: 'string'},
//             lon: 'double?',
//             // data: 'NodeDataSchema[]',
//         },
//         primaryKey: '_id',
//     };
// }

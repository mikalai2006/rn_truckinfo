import Realm, {BSON, ObjectSchema} from 'realm';
import {ImageObjectSchema} from './ImageObjectSchema';

export class ImageSchema extends Realm.Object<ImageSchema> {
    _id!: BSON.ObjectId; // app _id
    nlid!: string; // id local node
    service!: string;
    serviceId!: string; // server node id
    images!: Realm.List<ImageObjectSchema>;

    static schema: ObjectSchema = {
        name: 'ImageSchema',
        properties: {
            _id: 'objectId',
            nlid: 'string',
            service: 'string',
            serviceId: {type: 'string'},
            images: {type: 'list', objectType: 'ImageObjectSchema'},
        },
        primaryKey: '_id',
    };
}

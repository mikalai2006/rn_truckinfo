import Realm, {ObjectSchema} from 'realm';

export class ImageObjectSchema extends Realm.Object<ImageObjectSchema> {
    name!: string;
    type!: string;
    uri!: string;

    static schema: ObjectSchema = {
        name: 'ImageObjectSchema',
        embedded: true,
        properties: {
            name: 'string',
            type: 'string',
            uri: 'string',
        },
    };
}

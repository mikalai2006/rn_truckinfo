import {useQuery, useRealm} from '@realm/react';
import {useState} from 'react';
import {Button, TextInput, View} from 'react-native';
import {BSON} from 'realm';
import {HOST_API} from '@env';
import {NodeSchema} from '~schema/NodeSchema';
import {useAppSelector} from '~store/hooks';
import {tokens} from '~store/appSlice';

export const WidgetSyncForm = () => {
    const [name, setName] = useState('');
    const realm = useRealm();

    const tokensFromStore = useAppSelector(tokens);

    const nodes = useQuery(
        NodeSchema,
        nodes => {
            return nodes; //.filtered('priority >= $0', priority);
        },
        [],
    );

    const handleAddNode = data => {
        // realm.write(() => {
        //     realm.create('NodeSchema', {
        //         _id: new BSON.ObjectId(),
        //         name: data.name,
        //         type: data.type,
        //         lat: data.lat,
        //         lon: data.lon,
        //     });
        // });
        realm.write(() => {
            try {
                const nodesFromDb = [...nodes];
                const maps = new Map(nodesFromDb.map(s => [s._id.toHexString(), s]));

                // console.log(maps);
                // console.log(nodesFromDb[0]);
                const newNodes = data.filter(x => !maps.get(x.id.toString()));
                // console.log(newNodes[0], maps.get(newNodes[0].id.toString()));
                for (let i = 0, total = newNodes.length; i < total; i++) {
                    const newItem = {
                        ...newNodes[i],
                        _id: new BSON.ObjectId(),
                        sid: newNodes[i].id,
                    };
                    // console.log('newItem: ', newItem);
                    realm.create('NodeSchema', newItem); // , Realm.UpdateMode.All
                }
                console.log('New newNodes: ', newNodes.length, newNodes[0]);
            } catch (e) {
                console.log(e);
            }
        });
    };

    const onFindAllNodes = () => {
        if (!tokensFromStore.access_token) {
            return;
        }
        console.log('onFindAllNodes');

        fetch(HOST_API + '/gql/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin-Type': '*',
                Authorization: `Bearer ${tokensFromStore.access_token}`,
            },
            body: JSON.stringify({
                query: `
                    query findNodesForMap($filter: [NodeFilterTag]!, $center:[Float], $latA: Float!,$limit:Int, $latB: Float!, $lonA: Float!, $lonB: Float!, $c: [String]!) {
                        nodes(
                            limit:$limit,
                            input: {
                                latA: $latA,
                                latB: $latB,
                                lonA: $lonA,
                                lonB: $lonB,
                                center: $center,
                                filter: $filter,
                                c: $c
                            }
                            ) {
                                total
                                limit
                                data {
                                    id
                                    type
                                    lat
                                    lon
                                    name
                                    ccode
                                    my
                                    data {
                                        tagId
                                        tagoptId
                                        value
                                    }
                                }
                            }
                        }
                  `,
                variables: {
                    limit: 1000000, //this.limit,
                    filter: [], //this.getFilter,
                    latA: -86.00669476043257, //_southWest?.lat,
                    latB: 87.87683126888442, //_northEast?.lat,
                    lonA: -159.60937500000003, //_southWest?.lng,
                    lonB: 155.39062500000003, //_northEast?.lng,
                    // center: [17.811456088564483, -2.1093750000000004], //[this.center?.lat, this.center?.lng],
                    query: '', //this.queryString,
                    c: ['by'], // this.queryCountry,
                },
            }),
        })
            .then(r => r.json())
            .then(res => {
                // Add markers to the layer
                // console.log('res =', res);

                if (!res.data) {
                    return;
                }
                // console.log('data.nodes.data.length=', res.data.nodes.data.length);
                const edges = res.data.nodes.data;
                if (edges) {
                    console.log('[...nodes].length=', edges.length);

                    handleAddNode(edges);
                }
            })
            .catch(e => {
                // setNodesX([...nodesFromStore]);
            });
    };

    return (
        <View tw="flex-1 mt-12">
            <TextInput
                tw="p-4 text-lg border border-s-200 dark:border-s-700 text-s-500 dark:text-s-300 bg-white dark:bg-s-900 rounded-lg"
                value={name}
                onChangeText={setName}
            />
            <Button onPress={() => onFindAllNodes()} title="Add Nodes" />
        </View>
    );
};

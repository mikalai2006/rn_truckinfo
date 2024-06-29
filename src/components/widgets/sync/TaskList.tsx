import React from 'react';

import {useQuery} from '@realm/react';
import {ScrollView, Text} from 'react-native';
import {ImageSchema} from '~schema/ImageSchema';
import {NodeSchema} from '~schema/NodeSchema';

export const TaskList = () => {
    //const [priority, setPriority] = useState(4);
    // filter for tasks with a high priority
    const localNodes = useQuery(
        NodeSchema,
        tasks => {
            return tasks.filtered('sid == $0', '');
        },
        [],
    );
    // filter for tasks that have just-started or short-running progress
    const lowProgressTasks = useQuery(NodeSchema, tasks => {
        return tasks; //.filtered('$0 <= progressMinutes && progressMinutes < $1', 1, 10);
    });

    const images = useQuery(ImageSchema, tasks => {
        return tasks;
    });
    return (
        <ScrollView>
            <Text tw="text-black">Local items:</Text>
            {localNodes.map((taskItem, index) => {
                return (
                    <Text tw="text-black" key={index}>
                        {taskItem.name} - {taskItem.lat},{taskItem.lon}
                    </Text>
                );
            })}
            <Text tw="text-black">Images:</Text>
            {images.map((taskItem, index) => {
                return (
                    <Text tw="text-black" key={index}>
                        {taskItem.service}: {taskItem.serviceId} - : {taskItem.images.length}
                    </Text>
                );
            })}
            <Text tw="text-black">Your tasks without much progress:</Text>
            {lowProgressTasks
                .slice(lowProgressTasks.length - 101, lowProgressTasks.length - 1)
                .map((taskItem, index) => {
                    return (
                        <Text tw="text-black" key={index}>
                            {taskItem.lat},{taskItem.lon}: {taskItem.name}
                        </Text>
                    );
                })}
        </ScrollView>
    );
};

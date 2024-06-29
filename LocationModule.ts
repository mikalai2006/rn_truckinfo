/**
 * This exposes the native CalendarModule module as a JS module. This has a
 * function 'createCalendarEvent' which takes the following parameters:
 *
 * 1. String name: A string representing the name of the event
 * 2. String location: A string representing the location of the event
 */
import {NativeModule, NativeModules} from 'react-native';
const {LocationModule} = NativeModules;
interface LocationModuleInterface extends NativeModule {
    startLocationReceiver(): void;
    stopLocationReceiver(): void;
}
export default LocationModule as LocationModuleInterface;

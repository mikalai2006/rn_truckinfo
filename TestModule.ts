/**
 * This exposes the native CalendarModule module as a JS module. This has a
 * function 'createCalendarEvent' which takes the following parameters:
 *
 * 1. String name: A string representing the name of the event
 * 2. String location: A string representing the location of the event
 */
import {NativeModule, NativeModules} from 'react-native';
const {TestModule} = NativeModules;
interface TestModuleInterface extends NativeModule {
    show(): void;
    heading(): void;
    startUpdates(): void;
    stopUpdates(): void;
    setUpdateInterval(timeMs: number): void;
    setUpdateAlpha(newAlpha: number): void;
    startAzimut(): void;
    stopAzimut(): void;
    setDark(): void;
    setLight(): void;
    setSystem(): void;
}
export default TestModule as TestModuleInterface;

import {AppRegistry} from 'react-native';
import {RNAndroidNotificationListenerHeadlessJsName} from 'react-native-android-notification-listener';
import {name as appName} from './app.json';
import App from './src/App';
import {MMKV} from 'react-native-mmkv';
import {headlessNotificationListener} from './src/helper/headlessNotificationListener';
export const storage = new MMKV();

/**
 * AppRegistry should be required early in the require sequence
 * to make sure the JS execution environment is setup before other
 * modules are required.
 */
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener,
);

AppRegistry.registerComponent(appName, () => App);

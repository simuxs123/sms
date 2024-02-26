import { AppRegistry } from 'react-native'
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener'


import { name as appName } from './app.json'
import App from './src/App'
import { MMKV } from 'react-native-mmkv'
import { SendDirectSms } from 'react-native-send-direct-sms';
/**
 * Note that this method MUST return a Promise.
 * Is that why I'm using a async function here.
 */
export const storage = new MMKV()

export const headlessNotificationListener = async ({ notification }) => {
    /**
     * This notification is a JSON string in the follow format:
     *  {
     *      "app": string,
     *      "title": string,
     *      "titleBig": string,
     *      "text": string,
     *      "subText": string,
     *      "summaryText": string,
     *      "bigText": string,
     *      "audioContentsURI": string,
     *      "imageBackgroundURI": string,
     *      "extraInfoText": string,
     *      "groupedMessages": Array<Object> [
     *          {
     *              "title": string,
     *              "text": string
     *          }
     *      ]
     *  }
     */
        const parsedNot = JSON.parse(notification)
        const phone = storage.getString('@phoneNumber')
    if (notification && phone && parsedNot.app && parsedNot.app.includes("facebook")) {
        /**
         * Here you could store the notifications in a external API.
         * I'm using AsyncStorage here as an example.
         */
        const bodyText = `Siuntejas: ${parsedNot.title}. Pranesimas: ${parsedNot.text}`
        try {
            await SendDirectSms(phone, bodyText);
        } catch (e){
            const err=typeof e === 'string' ? e : "Something went wrong";
            storage.set("@error", err);
        }
    }
}

/**
 * AppRegistry should be required early in the require sequence
 * to make sure the JS execution environment is setup before other
 * modules are required.
 */
AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName,
    () => headlessNotificationListener
)

AppRegistry.registerComponent(appName, () => App)
// import {SendDirectSms} from 'react-native-send-direct-sms';
import {storage} from '../..';
import {hasDayPassed} from './hasDayPassed';
import {ToastAndroid, Alert} from 'react-native';
import {SendDirectSms} from './sendSms';
/**
 * Note that this method MUST return a Promise.
 * Is that why I'm using a async function here.
 */

export const headlessNotificationListener = async ({notification}: any) => {
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
  const parsedNot = JSON.parse(notification);
  const phone = storage.getString('@phoneNumber');
  if (hasDayPassed()) {
    return;
  }
  if (
    notification &&
    phone &&
    parsedNot.app &&
    parsedNot.app.includes('facebook')
  ) {
    const bodyText = `Siuntejas: ${parsedNot.title}. Pranesimas: ${parsedNot.text}`;
    try {
      await SendDirectSms(`+${phone}`, bodyText);
    } catch (e) {
      const err = typeof e === 'string' ? e : 'Something went wrong';
      storage.set('@error', err);
    }
  }
};

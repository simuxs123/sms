import {NativeModules, PermissionsAndroid} from 'react-native';

const SendSms = NativeModules.SendDirectSms;

export const SendDirectSms = async (
  mobileNumber: string,
  bodySMS: string,
): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (mobileNumber) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await SendSms.sendDirectSms(mobileNumber, bodySMS);
          resolve('SMS sent'); // Resolve the promise if SMS sent successfully
        } else {
          reject('SMS permission denied'); // Reject the promise if permission is denied
        }
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
      }
    } else {
      reject('Invalid mobile number'); // Reject the promise for an invalid mobile number
    }
  });
};

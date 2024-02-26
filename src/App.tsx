import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  AppState,
  View,
  PermissionsAndroid,
  Linking,
  TextInput,
} from 'react-native';
import RNAndroidNotificationListener, {
  RNAndroidNotificationListenerHeadlessJsName,
} from 'react-native-android-notification-listener';

import styles from './styles';
import {storage} from '..';
import {hasDayPassed} from './helper/hasDayPassed';

const openSettings = () => {
  Linking.openSettings();
};
function App() {
  const [hasNotifPermission, setHasNotifPermission] = useState(false);
  const [hasSmsPermission, setHasSmsPermission] = useState(false);
  const [lastNotification, setLastNotification] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = React.useState('');
  const inputRef = useRef<TextInput | null>(null);

  const handleOnPressPermissionButton = async () => {
    if (!hasSmsPermission) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      switch (granted) {
        case PermissionsAndroid.RESULTS.GRANTED:
          setHasSmsPermission(true);
          break;
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          openSettings();
          break;
      }
    }
    if (!hasNotifPermission) {
      RNAndroidNotificationListener.requestPermission();
    }
  };

  const handleAppStateChange = async (nextAppState: string, force = false) => {
    if (nextAppState === 'active' || force) {
      const status = await RNAndroidNotificationListener.getPermissionStatus();
      setHasNotifPermission(status !== 'denied');
      const status2 = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      setHasSmsPermission(status2);
    }
  };

  const savePhoneHandler = async () => {
    if (!mobileNumber) return;
    storage.set('@phoneNumber', mobileNumber);
    inputRef.current?.blur();
  };
  useEffect(() => {
    // storage.clearAll();
    if (!storage.getString('@startTime')) {
      const startTime = new Date();
      storage.set('@startTime', startTime.toString());
    }
    const phoneNumber = storage.getString('@phoneNumber');
    setMobileNumber(phoneNumber ?? '');
  }, []);
  useEffect(() => {
    const listener = AppState.addEventListener('change', handleAppStateChange);
    handleAppStateChange('', true);
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {hasDayPassed() ? (
        <Text style={[styles.permissionStatus, {color: 'red'}]}>Expired</Text>
      ) : (
        <>
          <View style={styles.buttonWrapper}>
            <Text
              style={[
                styles.permissionStatus,
                {
                  color:
                    hasNotifPermission && hasSmsPermission ? 'green' : 'red',
                },
              ]}>
              {hasNotifPermission && hasSmsPermission
                ? 'Allowed to handle notifications'
                : 'NOT allowed to handle notifications'}
            </Text>
            <Button
              title="Check permissions"
              onPress={handleOnPressPermissionButton}
              disabled={hasNotifPermission && hasSmsPermission}
            />
          </View>
          {hasNotifPermission && hasSmsPermission && (
            <View style={styles.buttonWrapper}>
              <Text style={styles.textInfo}>Enter Recipients Number</Text>
              <TextInput
                ref={inputRef}
                value={mobileNumber}
                onChangeText={mobileNumber => setMobileNumber(mobileNumber)}
                placeholder={'37000000000'}
                keyboardType="numeric"
                style={styles.textInput}
              />
              <Button title="Save number" onPress={savePhoneHandler} />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

export default App;

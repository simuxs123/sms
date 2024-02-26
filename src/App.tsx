import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  Button,
  AppState,
  View,
  FlatList,
  ScrollView,
  PermissionsAndroid,
  Linking,
  TextInput,
  AppRegistry,
} from 'react-native';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';

import styles from './styles';
import {headlessNotificationListener, storage} from '..';

const openSettings = () => {
  Linking.openSettings();
};
function App() {
  const [hasNotifPermission, setHasNotifPermission] = useState(false);
  const [hasSmsPermission, setHasSmsPermission] = useState(false);
  const [lastNotification, setLastNotification] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = React.useState('');

  const handleOnPressPermissionButton = async () => {
    if (!hasSmsPermission) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
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
    if(!mobileNumber) return;
    storage.set('@phoneNumber',mobileNumber)
  };

  useEffect(() => {
    const phoneNumber = storage.getString('@phoneNumber');
    setMobileNumber(phoneNumber??"")
    const listener = AppState.addEventListener('change', handleAppStateChange);
    handleAppStateChange('', true);
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Text
          style={[
            styles.permissionStatus,
            {color: hasNotifPermission && hasSmsPermission ? 'green' : 'red'},
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
     {hasNotifPermission && hasSmsPermission&&<View style={styles.buttonWrapper}>
        <Text style={styles.textInfo}>Enter Recipients Number</Text>
        <TextInput
          value={mobileNumber}
          onChangeText={mobileNumber => setMobileNumber(mobileNumber)}
          placeholder={'37000000000'}
          keyboardType="numeric"
          style={styles.textInput}
        />
        <Button
          title="Save number"
          onPress={savePhoneHandler}
        />
      </View>}
    </SafeAreaView>
  );
}

export default App;

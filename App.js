import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function App() {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }

  const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken, 'the oldtoken');
    if (!fcmToken) {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log(fcmToken, 'the new genrated token');
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (error) {
        console.log(error, 'error rasied in fcmToken');
        showError(error.message);
      }
    }
  };

  const pushNoti = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notifications caused app to open from background state',
        remoteMessage.notification,
      );
    });
    messaging().onMessage(async remoteMessage => {
      console.log('recive in forbround', remoteMessage);
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
  };

  useEffect(() => {
    requestUserPermission();
    pushNoti();
  });

  return (
    <View
      style={{
        backgroundColor: '#756544',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 24}}>PushNotifications</Text>
    </View>
  );
}

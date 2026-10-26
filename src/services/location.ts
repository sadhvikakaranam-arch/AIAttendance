import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type { AttendanceLocation } from './firebase';

export async function getAttendanceLocation(): Promise<AttendanceLocation> {
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Allow Chotu to use your location?',
      message: 'Your location is saved with each check-in and check-out to record where attendance happened.',
      buttonPositive: 'Allow location',
      buttonNegative: 'Not now',
    });

    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      throw Object.assign(new Error('Location permission is required to record attendance.'), { code: 'location/permission-denied' });
    }
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
      }),
      error => {
        if (error.code === 1) {
          reject(Object.assign(new Error('Location permission was denied.'), { code: 'location/permission-denied' }));
        } else {
          reject(Object.assign(new Error('Could not get your location. Turn on device location and try again.'), { code: 'location/unavailable' }));
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, forceRequestLocation: true, showLocationDialog: true },
    );
  });
}
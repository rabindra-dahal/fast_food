import { Alert, Platform, ToastAndroid } from 'react-native';

export function toast(msg:any) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
        Alert.alert(msg);
    }
}

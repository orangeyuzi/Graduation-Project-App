import React, { useState } from 'react';
import { View, Switch, PermissionsAndroid, StyleSheet, Alert, Text, Pressable, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage = (props: any) => {
    const [isEnabledLocation, setIsEnabledLocation] = useState(false);
    const [isEnabledCamera, setIsEnabledCamera] = useState(false);
    const [isEnabledStorage, setIsEnabledStorage] = useState(false);
    const [fast, setFast] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === 'android') {
                checkPermission();
            }
        }, [])
    );


    const checkFastLoginSelection = async () => { //should use saveData to set 'FastLogin' to 'true'
        try {
            const value = await AsyncStorage.getItem('FastLogin');
            if (value) {
                return (value);
            }
            else {
                return ('false');
            }
        } catch (e) {
            console.log("error", e);
        }
    };
    const saveFast = (value: any) => {
        try {
            AsyncStorage.setItem('FastLogin', value);
            return true
        } catch (e) {
            console.log("error", e);
            return false
        }
    };
    const getFastStat = async () => {
        const FLSelect = await checkFastLoginSelection();
        if (FLSelect === 'false') {

            setFast(false);
            return;
        } else {
            setFast(true);
        }
    }
    const changeFastStat = async (fastState: any) => {
        if (fastState) {
            setFast(false);
            saveFast('false')
        }
        else {
            setFast(true);
            saveFast('true')
        }
        getFastStat()
    }
    getFastStat();

    const checkPermission = async () => {
        try {
            const grantedCamera = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            const grantedLocation = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            const grantedStorage = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );
            setIsEnabledCamera(grantedCamera);
            setIsEnabledLocation(grantedLocation);
            setIsEnabledStorage(grantedStorage);
        } catch (err) {
            console.warn(err);
        }
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "This app needs access to your camera",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("You can use the camera");
                setIsEnabledCamera(true);
            } else {
                Alert.alert("Camera permission denied");
                setIsEnabledCamera(false);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app needs access to your location",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("You can use the location");
                setIsEnabledLocation(true);
            } else {
                Alert.alert("Location permission denied");
                setIsEnabledLocation(false);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const requestGalleryPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Gallery Permission",
                    message: "This app needs access to your gallery",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("You can access the gallery");
                setIsEnabledStorage(true);
            } else {
                Alert.alert("Gallery permission denied");
                setIsEnabledStorage(false);
            }
        } catch (err) {
            console.warn(err);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>系統權限設置</Text>
            <View style={styles.line} />


            <View style={styles.settingItem}>
                <Text style={styles.switchText}>調整位置權限</Text>
                <Switch
                    style={styles.switch}
                    value={isEnabledLocation} // Set your switch value here
                    onValueChange={(value) => {
                        // Handle switch value change
                        if (value) {
                            requestLocationPermission()
                        } else {
                            Alert.alert("需要從設定關閉此權限");
                        }

                    }}
                />

            </View>
            <View style={styles.settingItem}>
                <Text style={styles.switchText}>調整相機權限</Text>
                <Switch
                    style={styles.switch}
                    value={isEnabledCamera} // Set your switch value here
                    onValueChange={(value) => {
                        // Handle switch value change
                        if (value) {
                            requestCameraPermission()
                        } else {
                            Alert.alert("需要從設定關閉此權限");

                        }
                    }}
                />

            </View>
            <View style={styles.settingItem}>
                <Text style={styles.switchText}>調整相簿權限</Text>
                <Switch
                    style={styles.switch}
                    value={isEnabledStorage} // Set your switch value here
                    onValueChange={(value) => {
                        // Handle switch value change
                        if (value) {
                            requestGalleryPermission()
                        } else {

                            Alert.alert("需要從設定關閉此權限");
                        }
                    }}
                />

            </View>

            <View style={styles.settingItem}>
                <Text style={styles.switchText}>下次直接登入</Text>
                <Switch
                    style={styles.switch}
                    value={fast} // Set your switch value here
                    onValueChange={(value) => {
                        // Handle switch value change
                        changeFastStat(!value);
                    }}
                />

            </View>

            <Pressable onPress={() => props.navigation.goBack()} style={({ pressed }) => [
                styles.pressable,
                {
                    opacity: pressed ? 0.8 : 1,
                    borderColor: '#FFBB77'
                }
            ]}><Text style={styles.pressableText}>返回個人頁面</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',


    },
    line: {
        height: 1,

        width: '80%',
        marginBottom: '2%',
        marginVertical: '5%',
    },
    settingItem: {
        alignContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        width: '90%',
        borderRadius: 20,
        height: '13%',
        paddingHorizontal: '5%',
        justifyContent: 'space-between',
        borderColor: '#FFAF60',
        borderBottomWidth: 1
    },
    switch: {
        transform: [{ scaleX: 2 }, { scaleY: 2 }],
        marginHorizontal: 20,
    },
    switchText: {
        fontSize: 24,

        fontWeight: 'bold',
        paddingHorizontal: '5%',

    },
    pressable: {
        alignContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,

        width: '60%',
        borderRadius: 15,
        height: '10%',
        paddingHorizontal: '5%',
        justifyContent: 'center'
    },
    pressableText: {
        fontSize: 20,

        fontWeight: 'bold',
        paddingHorizontal: '5%',
    },
});

export default SettingsPage;
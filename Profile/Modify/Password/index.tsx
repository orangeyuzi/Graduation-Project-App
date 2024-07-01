import React, { useState } from 'react';
import { View, Modal, TextInput, Button, StyleSheet, Text, Pressable } from 'react-native';


const PasswordModal = ({ visible, onClose, onSave }: any) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSave = async () => {
        try {
            if (true) {
                onSave(newPassword, oldPassword);
                setNewPassword('');
                setOldPassword('');
            } else {
                setError(true);
                setNewPassword('');
                setOldPassword('');
            }

            // const response = await fetch('http://172.20.10.2:4000/ModifyPassword', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ newPassword, oldPassword })
            // });
            // const responseData = await response.json();
            // if (responseData.state === "success") {
            //     onSave(newPassword, oldPassword);
            //     setNewPassword('');
            //     setOldPassword('');
            // } else {
            //     setNewPassword('');
            //     setOldPassword('');
            // }
        } catch (error) {
            console.error('Error sending New Username data:', error);
        }
    };


    const handleClose = () => {
        onClose();
        setNewPassword('');
        setOldPassword('');
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>修改密碼</Text>
                    <Text style={styles.intro}>輸入舊密碼</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="舊密碼"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <Text style={styles.intro}>輸入新密碼</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="新密碼"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />

                    <View style={styles.buttonContainer}>
                        <Pressable onPress={handleClose} style={({ pressed }) => [
                            styles.pressable,
                            {
                                backgroundColor: pressed ? '#8E8E8E' : '#E0E0E0',
                                borderColor: pressed ? '#E0E0E0' : '#8E8E8E',
                            }
                        ]}><Text style={styles.pressableText}>取消</Text>
                        </Pressable>
                        <Pressable onPress={handleSave} style={({ pressed }) => [
                            styles.pressable,
                            {
                                backgroundColor: pressed ? '#FFAF60' : 'orange',
                                borderColor: pressed ? 'orange' : '#FFAF60',
                            }
                        ]}><Text style={styles.pressableText}>確認</Text>
                        </Pressable>
                    </View>

                    {error ? <Text style={styles.error}>新舊密碼重複或新密碼格式錯誤</Text> : <></>}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 15,
    },
    intro: {
        fontSize: 20,
        color: 'black',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        marginTop: 10,
        width: '80%',
        borderRadius: 8,
        height: 45,
        margin: 12,

        borderColor: 'gray',
        color: '#000000',
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    pressable: {
        width: '30%',
        height: 35,
        borderRadius: 10,
        borderWidth: 1,
        paddingTop: 4,
    },
    pressableText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
    error: {
        marginTop: 10,
        textAlign: 'center',
        color: 'red',
        fontSize: 15,
    }
});

export default PasswordModal;
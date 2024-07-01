import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';


const slides = [
    {
        key: 'somethun',
        title: 'Title 1',
        text: 'Description.\nSay something cool',
        image: require('../../asset/cloud.png'),
        backgroundColor: '#59b2ab',
    },
    {
        key: 'somethun-dos',
        title: 'Title 2',
        text: 'Other cool stuff',
        image: require('../../asset/rain.png'),
        backgroundColor: '#febe29',
    },
];

const IntroSlider = (props: any) => {
    const renderItem = ({ item }: any) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <AppIntroSlider renderItem={renderItem} data={slides} />
            <Pressable
                style={styles.transparentButton}
                onPress={() => props.navigation.goBack()}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)', borderless: true }}
            >
                <Text style={styles.buttonText}>Return</Text>
            </Pressable>
        </View>


    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '60%',
        marginVertical: '5%',
        // resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
    },
    transparentButton: {
        position: 'absolute',
        bottom: 20, // Adjust this value as needed
        left: 0,
        right: 0,
        width: 60,
        alignSelf: 'center',
        marginTop: 20,
        paddingVertical: 10,
        marginHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent', // This makes the border invisible
        backgroundColor: 'transparent', // Transparent background
    },
    buttonText: {
        fontSize: 18,
        color: 'white', // Text color
    },
});

export default IntroSlider;
import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to the Bus Booking System</Text>
            <Button
                title="Search Buses"
                onPress={() => navigation.navigate('Booking')}
            />
            <Button
                title="View Booking History"
                onPress={() => navigation.navigate('BookingHistory')}
            />
        </View>
    );
};

export default HomeScreen;
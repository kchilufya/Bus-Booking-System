import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { getAvailableBuses, bookSeat } from '../services/api';

const BookingScreen = ({ navigation }) => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [passengerName, setPassengerName] = useState('');
    const [seatNumber, setSeatNumber] = useState('');

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const routeId = 'some-route-id'; // You'll need to pass this from navigation
            const date = new Date().toISOString().split('T')[0];
            const busesData = await getAvailableBuses(routeId, date);
            setBuses(busesData);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch buses');
        }
    };

    const handleBooking = async () => {
        if (!selectedBus || !passengerName || !seatNumber) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const bookingData = {
                busId: selectedBus._id,
                passengerName,
                seatNumber: parseInt(seatNumber),
            };
            const response = await bookSeat(bookingData);
            Alert.alert('Success', 'Booking successful');
            navigation.navigate('Payment', { bookingDetails: response });
        } catch (error) {
            Alert.alert('Error', 'Failed to book the bus');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Book a Bus</Text>
            <FlatList
                data={buses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.busItem}>
                        <Text onPress={() => setSelectedBus(item)} style={styles.busText}>
                            Bus {item.busNumber} - {item.availableSeats} seats available
                        </Text>
                    </View>
                )}
            />
            {selectedBus && (
                <View style={styles.bookingForm}>
                    <TextInput
                        placeholder="Passenger Name"
                        value={passengerName}
                        onChangeText={setPassengerName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Seat Number"
                        value={seatNumber}
                        onChangeText={setSeatNumber}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Button title="Book Now" onPress={handleBooking} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    busItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    busText: { fontSize: 16 },
    bookingForm: { marginTop: 20 },
    input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }
});

export default BookingScreen;
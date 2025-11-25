import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { processPayment } from '../services/api';

const PaymentScreen = ({ route, navigation }) => {
    const { bookingDetails } = route.params;
    const [paymentMethod, setPaymentMethod] = useState('mobileMoney');
    const [amount, setAmount] = useState(bookingDetails.amount);

    const handlePayment = async () => {
        try {
            const response = await processPayment({
                method: paymentMethod,
                amount: amount,
                bookingId: bookingDetails.id,
            });
            if (response.success) {
                Alert.alert('Payment Successful', 'Your payment has been processed.');
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert('Payment Failed', response.message);
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while processing your payment.');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Payment</Text>
            <Text>Amount: {amount}</Text>
            <TextInput
                placeholder="Payment Method (mobileMoney or card)"
                value={paymentMethod}
                onChangeText={setPaymentMethod}
                style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
            />
            <Button title="Pay Now" onPress={handlePayment} />
        </View>
    );
};

export default PaymentScreen;
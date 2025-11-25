import axios from 'axios';

const API_URL = 'http://your-backend-url/api'; // Replace with your backend URL

// Function to get available buses
export const getAvailableBuses = async (routeId, date) => {
    try {
        const response = await axios.get(`${API_URL}/buses?routeId=${routeId}&date=${date}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to book a seat
export const bookSeat = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/bookings`, bookingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to process payment
export const processPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/payments`, paymentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to get booking history
export const getBookingHistory = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/bookings?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
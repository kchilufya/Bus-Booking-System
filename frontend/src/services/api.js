import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update with your backend URL

// Function to register a user
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
};

// Function to login a user
export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
};

// Function to search for buses
export const searchBuses = async (searchParams) => {
    const response = await axios.get(`${API_URL}/buses`, { params: searchParams });
    return response.data;
};

// Function to book a seat
export const bookSeat = async (bookingData) => {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
};

// Function to process payment
export const processPayment = async (paymentData) => {
    const response = await axios.post(`${API_URL}/payments`, paymentData);
    return response.data;
};

// Function to get booking history
export const getBookingHistory = async (userId) => {
    const response = await axios.get(`${API_URL}/bookings/history`, { params: { userId } });
    return response.data;
};
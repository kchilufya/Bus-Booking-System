import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PaymentForm.css';

// Define API URL directly
const API_URL = 'http://localhost:5000/api';

const PaymentForm = ({ bookingDetails, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('mobileMoney');
    const [loading, setLoading] = useState(false);
    const isMountedRef = useRef(true);

    // Mobile Money Form
    const [mobileMoneyData, setMobileMoneyData] = useState({
        phoneNumber: '',
        provider: 'MTN',
        name: '',
        email: ''
    });

    // Card Form
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        name: '',
        email: ''
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleMobileMoneyPayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/payments/mobile-money`, {
                bookingId: bookingDetails.bookingId,
                phoneNumber: mobileMoneyData.phoneNumber,
                provider: mobileMoneyData.provider,
                amount: bookingDetails.totalAmount,
                email: mobileMoneyData.email,
                name: mobileMoneyData.name
            });

            if (response.data.success && isMountedRef.current) {
                alert('Payment completed successfully! (Demo Mode)');
                onPaymentSuccess(response.data);
            }
        } catch (error) {
            if (isMountedRef.current) {
                alert('Payment failed: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const handleCardPayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/payments/card`, {
                bookingId: bookingDetails.bookingId,
                amount: bookingDetails.totalAmount,
                email: cardData.email,
                name: cardData.name,
                cardDetails: {
                    cardNumber: cardData.cardNumber,
                    expiryMonth: cardData.expiryMonth,
                    expiryYear: cardData.expiryYear,
                    cvv: cardData.cvv
                }
            });

            if (response.data.success && isMountedRef.current) {
                alert('Payment completed successfully! (Demo Mode)');
                onPaymentSuccess(response.data);
            }
        } catch (error) {
            if (isMountedRef.current) {
                alert('Payment failed: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="payment-form-container">
            <div className="payment-method-selector">
                <button
                    className={`method-btn ${paymentMethod === 'mobileMoney' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('mobileMoney')}
                >
                    📱 Mobile Money
                </button>
                <button
                    className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                >
                    💳 Credit/Debit Card
                </button>
            </div>

            {paymentMethod === 'mobileMoney' && (
                <form onSubmit={handleMobileMoneyPayment} className="payment-form">
                    <h3>Pay with Mobile Money</h3>
                    
                    <div className="form-group">
                        <label>Provider</label>
                        <select
                            value={mobileMoneyData.provider}
                            onChange={(e) => setMobileMoneyData({...mobileMoneyData, provider: e.target.value})}
                            required
                        >
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="AIRTEL">Airtel Money</option>
                            <option value="ZAMTEL">Zamtel Kwacha</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            placeholder="0977123456"
                            value={mobileMoneyData.phoneNumber}
                            onChange={(e) => setMobileMoneyData({...mobileMoneyData, phoneNumber: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={mobileMoneyData.name}
                            onChange={(e) => setMobileMoneyData({...mobileMoneyData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={mobileMoneyData.email}
                            onChange={(e) => setMobileMoneyData({...mobileMoneyData, email: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : `Pay K${bookingDetails.totalAmount}`}
                    </button>
                </form>
            )}

            {paymentMethod === 'card' && (
                <form onSubmit={handleCardPayment} className="payment-form">
                    <h3>Pay with Card</h3>

                    <div className="form-group">
                        <label>Card Number</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardData.cardNumber}
                            onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                            maxLength="16"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Month</label>
                            <input
                                type="text"
                                placeholder="MM"
                                value={cardData.expiryMonth}
                                onChange={(e) => setCardData({...cardData, expiryMonth: e.target.value})}
                                maxLength="2"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <input
                                type="text"
                                placeholder="YY"
                                value={cardData.expiryYear}
                                onChange={(e) => setCardData({...cardData, expiryYear: e.target.value})}
                                maxLength="2"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={cardData.cvv}
                                onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                                maxLength="3"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cardholder Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={cardData.name}
                            onChange={(e) => setCardData({...cardData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={cardData.email}
                            onChange={(e) => setCardData({...cardData, email: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : `Pay K${bookingDetails.totalAmount}`}
                    </button>
                </form>
            )}
        </div>
    );
};

export default PaymentForm;
import React, { useState, useEffect } from 'react';
import './App.css';
import RouteList from './components/Route/RouteList';
import BusList from './components/Bus/BusList';
import SeatSelection from './components/Booking/SeatSelection';
import BookingForm from './components/Booking/BookingForm';
import PaymentForm from './components/Payment/PaymentForm';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import MyBookings from './components/Booking/MyBookings';
import BookingDetailsModal from './components/Booking/BookingDetailsModal';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserRegister from './components/Auth/UserRegister';
import UserLogin from './components/Auth/UserLogin';

// Import bus images
import ubzBusImage from './assets/images/ubz-bus.jpg';
import powertoolsBusImage from './assets/images/powertools-bus.jpg';

function App() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);

  useEffect(() => {
    fetchRoutes();
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes');
      const data = await response.json();
      setRoutes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setLoading(false);
    }
  };

  const fetchBusesByRoute = async (routeId) => {
    try {
      const response = await fetch('http://localhost:5000/api/buses');
      const allBuses = await response.json();
      const filteredBuses = allBuses.filter(bus => bus.routeId._id === routeId);
      setBuses(filteredBuses);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    fetchBusesByRoute(route._id);
    setCurrentPage('buses');
  };

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    setCurrentPage('seats');
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
    setCurrentPage('booking');
  };

  const handleBookingComplete = async (details) => {
    setPassengerDetails(details);
    
    const totalAmount = selectedSeats.reduce((total, seatNum) => {
      const seatConfig = selectedBus.seatConfiguration.find(s => s.seatNumber === seatNum);
      return total + (seatConfig ? seatConfig.price : 150);
    }, 0);

    try {
      const bookingData = {
        busId: selectedBus._id,
        routeId: selectedRoute._id,
        seats: selectedSeats,
        passengerName: details.name,
        passengerEmail: details.email,
        passengerPhone: details.phone,
        totalAmount: totalAmount
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      
      if (result._id) {
        setBookingId(result._id);
        setCurrentPage('payment');
      } else {
        alert('Error creating booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking');
    }
  };

  const handleGoHome = () => {
    setCurrentPage('home');
    setSelectedRoute(null);
    setSelectedBus(null);
    setSelectedSeats([]);
    setPassengerDetails(null);
    setBookingId('');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    setCurrentPage('admin');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    setCurrentPage('home');
  };

  const handleUserLogin = (token) => {
    setUserToken(token);
    localStorage.setItem('userToken', token);
    setCurrentPage('home'); // or continue flow
  };

  const handleUserLogout = () => {
    setUserToken(null);
    localStorage.removeItem('userToken');
    setCurrentPage('home');
  };

  const renderNavigation = () => {
    return (
      <nav className="main-navigation">
        <div className="nav-container">
          <div className="nav-brand" onClick={handleGoHome}>
            <span className="nav-logo">🚌</span>
            <span className="nav-title">Zambian Bus Booking</span>
          </div>
          <div className="nav-links">
            <button 
              onClick={handleGoHome} 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => setCurrentPage('myBookings')} 
              className={`nav-link ${currentPage === 'myBookings' ? 'active' : ''}`}
            >
              📋 My Bookings
            </button>
            <button 
              onClick={toggleDarkMode} 
              className="nav-link theme-toggle"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => setCurrentPage(adminToken ? 'admin' : 'adminLogin')} 
              className={`nav-link ${currentPage === 'admin' || currentPage === 'adminLogin' ? 'active' : ''}`}
            >
              🔒 Admin
            </button>
            { !userToken ? (
              <>
                <button onClick={() => setCurrentPage('userLogin')} className="nav-link">Sign in</button>
                <button onClick={() => setCurrentPage('userRegister')} className="nav-link">Register</button>
              </>
            ) : (
              <button onClick={handleUserLogout} className="nav-link">Sign out</button>
            )}
          </div>
        </div>
      </nav>
    );
  };

  const renderHome = () => {
    return (
      <div className="home-container">
        <div className="hero-section">
          <h1>🚌 Zambian Bus Booking System</h1>
          <p>Book your bus tickets easily and travel comfortably across Zambia</p>
        </div>

        {/* Bus Showcase Section */}
        <div className="bus-showcase-section">
          <h3 style={{textAlign: 'center', fontSize: '2rem', marginBottom: '40px'}}>
            Our Premium Bus Fleet
          </h3>
          <div className="bus-showcase-grid">
            <div className="showcase-card">
              <div className="showcase-image">
                <img 
                  src={ubzBusImage} 
                  alt="UBZ Bus"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=300&fit=crop';
                  }}
                />
              </div>
              <div className="showcase-info">
                <h4>🚌 UBZ Express</h4>
                <p>Modern, comfortable buses with air conditioning and reclining seats. Perfect for long-distance travel across Zambia.</p>
                <div className="showcase-features">
                  <span>✓ AC</span>
                  <span>✓ WiFi</span>
                  <span>✓ Reclining Seats</span>
                  <span>✓ USB Charging</span>
                </div>
              </div>
            </div>

            <div className="showcase-card">
              <div className="showcase-image">
                <img 
                  src={powertoolsBusImage} 
                  alt="Power Tools Bus"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&h=300&fit=crop';
                  }}
                />
              </div>
              <div className="showcase-info">
                <h4>🚌 Power Tools Express</h4>
                <p>Premium luxury buses with spacious seating and entertainment systems. Your comfort is our priority.</p>
                <div className="showcase-features">
                  <span>✓ VIP Seats</span>
                  <span>✓ Entertainment</span>
                  <span>✓ Refreshments</span>
                  <span>✓ Washroom</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3 style={{textAlign: 'center', fontSize: '2rem'}}>Why Choose Us?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🎫 Easy Booking</h4>
              <p>Book your tickets in just a few clicks. Simple, fast, and secure online booking system.</p>
            </div>
            <div className="feature-card">
              <h4>💺 Comfortable Seats</h4>
              <p>Choose from Window or Aisle seats. All seats are standard fare - travel in comfort with our modern buses.</p>
            </div>
            <div className="feature-card">
              <h4>💳 Secure Payments</h4>
              <p>Multiple payment options including Mobile Money and Card payments. Your transactions are safe.</p>
            </div>
            <div className="feature-card">
              <h4>📱 24/7 Support</h4>
              <p>Our customer support team is always ready to help you with any queries or issues.</p>
            </div>
          </div>
        </div>

        {/* Routes Section */}
        <RouteList routes={routes} onSelectRoute={handleRouteSelect} loading={loading} />

        {/* Stats Section */}
        <div className="stats-section">
          <h3 style={{textAlign: 'center', fontSize: '2rem'}}>Our Journey So Far</h3>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Daily Trips</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Routes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">On-Time Arrivals</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBuses = () => {
    return (
      <div className="buses-container">
        <button onClick={handleGoHome} className="btn btn-outline back-button">
          ← Back to Routes
        </button>
        <h2>Available Buses</h2>
        <p className="route-info">
          {selectedRoute.startLocation} → {selectedRoute.destination}
        </p>
        <BusList buses={buses} onSelectBus={handleBusSelect} />
      </div>
    );
  };

  const renderSeats = () => {
    return (
      <SeatSelection
        busId={selectedBus._id}
        onSeatSelect={handleSeatSelect}
        onBack={() => setCurrentPage('buses')}
      />
    );
  };

  const renderBooking = () => {
    return (
      <BookingForm
        selectedRoute={selectedRoute}
        selectedBus={selectedBus}
        selectedSeats={selectedSeats}
        onComplete={handleBookingComplete}
      />
    );
  };

  const renderPayment = () => {
    const totalAmount = selectedSeats.reduce((total, seatNum) => {
      const seatConfig = selectedBus.seatConfiguration.find(s => s.seatNumber === seatNum);
      return total + (seatConfig ? seatConfig.price : 150);
    }, 0);

    const bookingDetails = {
      bookingId: bookingId,
      totalAmount: totalAmount,
      route: `${selectedRoute.startLocation} → ${selectedRoute.destination}`,
      busNumber: selectedBus.busNumber,
      seats: selectedSeats
    };

    return (
      <div className="payment-container">
        <h2>Complete Your Booking</h2>
        <div className="booking-summary">
          <p><strong>Route:</strong> {selectedRoute.startLocation} → {selectedRoute.destination}</p>
          <p><strong>Bus:</strong> {selectedBus.busNumber}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
          <p><strong>Total:</strong> K{totalAmount}</p>
        </div>
        <PaymentForm 
          bookingDetails={bookingDetails}
          onPaymentSuccess={(data) => {
            setCurrentPage('success');
          }}
        />
      </div>
    );
  };

  const renderSuccess = () => {
    return (
      <PaymentSuccess
        bookingDetails={{
          route: `${selectedRoute.startLocation} → ${selectedRoute.destination}`,
          busNumber: selectedBus.busNumber,
          seats: selectedSeats,
          passengerName: passengerDetails?.name,
          email: passengerDetails?.email,
          bookingId: bookingId
        }}
        onGoHome={handleGoHome}
      />
    );
  };

  const renderMyBookings = () => {
    return (
      <div className="my-bookings-page">
        <MyBookings onViewDetails={setSelectedBookingForDetails} />
        {selectedBookingForDetails && (
          <BookingDetailsModal
            booking={selectedBookingForDetails}
            onClose={() => setSelectedBookingForDetails(null)}
            onPrint={(booking) => {
              window.print();
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="App">
      {renderNavigation()}
      <div className="main-content">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'buses' && renderBuses()}
        {currentPage === 'seats' && renderSeats()}
        {currentPage === 'booking' && renderBooking()}
        {currentPage === 'payment' && renderPayment()}
        {currentPage === 'success' && renderSuccess()}
        {currentPage === 'myBookings' && renderMyBookings()}
        {currentPage === 'adminLogin' && <AdminLogin onLogin={handleAdminLogin} onCancel={() => setCurrentPage('home')} />}
        {currentPage === 'admin' && <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />}
        { currentPage === 'userRegister' && <UserRegister onRegister={handleUserLogin} onCancel={() => setCurrentPage('home')} /> }
        { currentPage === 'userLogin' && <UserLogin onLogin={handleUserLogin} onCancel={() => setCurrentPage('home')} /> }
      </div>
    </div>
  );
}

export default App;
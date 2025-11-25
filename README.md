# Bus Booking System

## Overview
The Bus Booking System is a web and mobile application designed to automate the ticket purchasing process for long-distance bus travel in Zambia. This system allows users to buy tickets online, select their seats, and make payments through mobile money services or credit/debit cards, significantly reducing queues and delays at bus stations.

## Features
- **User Authentication**: Users can register and log in to their accounts.
- **Bus Management**: Admins can add, update, and retrieve bus information.
- **Booking System**: Users can search for buses, select seats, and create bookings.
- **Payment Processing**: Supports mobile money and card payments for seamless transactions.
- **Booking History**: Users can view their past bookings.

## Project Structure
```
bus-booking-system
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── config
│   │   └── app.js
│   ├── package.json
│   └── .env
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── services
│   │   └── App.js
│   └── package.json
├── mobile
│   ├── src
│   │   ├── screens
│   │   ├── components
│   │   └── services
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- npm
- MongoDB (or any other database of your choice)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd bus-booking-system
   ```

2. Set up the backend:
   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Create a `.env` file and configure your database connection and other environment variables.

3. Set up the frontend:
   - Navigate to the `frontend` directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```

4. Set up the mobile app:
   - Navigate to the `mobile` directory:
     ```
     cd ../mobile
     ```
   - Install dependencies:
     ```
     npm install
     ```

### Running the Application
- Start the backend server:
  ```
  cd backend
  npm start
  ```

- Start the frontend application:
  ```
  cd ../frontend
  npm start
  ```

- Start the mobile application (if using Expo):
  ```
  cd ../mobile
  expo start
  ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
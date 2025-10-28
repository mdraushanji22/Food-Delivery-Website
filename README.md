# Food Delivery Website

A modern, responsive food delivery website built with React and Vite. This project allows users to browse food items, add them to a cart, place orders, and manage their order history.

## Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **UI Components**: React Icons
- **Notifications**: React Toastify
- **PDF Generation**: jsPDF with jspdf-autotable
- **Authentication**: React Context API with localStorage persistence

## Key Features

- Responsive design that works on mobile, tablet, and desktop
- User authentication (login/signup) with persistent sessions
- Food browsing with category filtering
- Shopping cart functionality with item management
- Order placement with delivery information form
- Order history with PDF invoice generation
- Smooth scrolling navigation
- Form validation
- LocalStorage persistence for cart items and orders
- Mobile-friendly hamburger menu navigation

## Functionality Overview

### Home Page
- Hero slider with food images
- Menu section with food items
- About section with company information
- Contact form with localStorage persistence

### Authentication
- Login and signup pages
- Persistent user sessions using localStorage
- User-specific order history

### Shopping Cart
- Add/remove items from cart
- Adjust item quantities
- Real-time price calculations
- Cart persistence across page refreshes

### Checkout Process
- Delivery information form with validation
- Order summary display
- Order placement with localStorage storage

### Order Management
- View order history
- Download PDF invoices
- Cancel orders

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd food-delivery-website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Development Server

To start the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```

The application will be available at `http://localhost:5173` (or another available port).

### Building for Production

To create a production build:

```bash
npm run build
```
or
```bash
yarn build
```

### Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
```
or
```bash
yarn preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── context/         # React Context for authentication
│   ├── Card.jsx         # Food item card component
│   ├── Card2.jsx        # Cart item card component
│   └── Nav.jsx          # Navigation component
├── pages/               # Page components
│   ├── Home.jsx         # Home page with all sections
│   ├── Login.jsx        # User login page
│   ├── Signup.jsx       # User signup page
│   ├── Cart.jsx         # Shopping cart page
│   ├── Checkout.jsx     # Checkout process page
│   └── MyOrders.jsx     # User order history page
├── redux/               # Redux store and slices
│   ├── store.js         # Redux store configuration
│   └── cartSlice.js     # Cart state management
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── food.js              # Static food data
```

## Available Scripts

- `dev`: Starts the development server
- `build`: Builds the application for production
- `preview`: Previews the production build locally
- `lint`: Runs ESLint to check for code issues

## Browser Support

This project works in all modern browsers that support ES6+ JavaScript features.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.
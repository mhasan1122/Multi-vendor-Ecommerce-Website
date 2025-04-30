# 🛍️ Multivendor Clothing eCommerce Website

A modern multivendor eCommerce platform tailored for clothing stores. Built with **Next.js** for the frontend and **Express.js** for the backend, the platform enables multiple vendors to manage their own products while customers enjoy a seamless shopping experience.

## 🚀 Features

### 👤 User Features
- User registration and login (JWT-based authentication)
- Browse clothing items by category, brand, and price
- Search and filter products
- Shopping cart and checkout functionality
- Order tracking and history

### 🛒 Vendor Features
- Vendor registration and dashboard
- Add, edit, and delete clothing products
- Track sales and order status
- Upload multiple product images

### ⚙️ Admin Features
- Manage vendors and users
- Approve or reject vendor accounts
- Manage product listings and categories
- View sales analytics and reports

## 🧱 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | Next.js, React, Tailwind CSS |
| Backend     | Express.js, Node.js, MongoDB |
| Auth        | JWT (JSON Web Token) |
| Image Upload | Cloudinary / Multer |
| Deployment  | Vercel (frontend), Render / Heroku / AWS (backend) |

## 📁 Project Structure

```bash
root/
├── client/              # Next.js frontend
│   ├── components/
│   ├── pages/
│   └── public/
├── server/              # Express.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
└── README.md
```

## 🛠️ Installation

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/multivendor-ecommerce-clothing.git
cd multivendor-ecommerce-clothing
```

### 2. Setup Backend
```bash
cd server
npm install
touch .env   # Add MongoDB URI, JWT secret, Cloudinary keys, etc.
npm start
```

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

### 4. Environment Variables

#### Backend (`server/.env`)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Coming Soon
- Stripe integration for payments
- Real-time order status updates
- Multi-language support
- Review and rating system

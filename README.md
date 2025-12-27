# SwiftShop – Multi-Language Microservices E-Commerce Platform

SwiftShop is a microservices-based online shopping platform built using multiple programming languages.  
This project demonstrates how different services written in different languages can work together in one system.

---

## 🚀 Project Status

| Service | Status | Completion | Assigned To |
|---------|--------|------------|-------------|
| **User Service** | ✅ Complete | 100% | Person 1 |
| **Product Service** | ⏳ In Progress | 0% | Person 2 |
| **Order Service** | ⏳ In Progress | 0% | Person 3 |
| **API Gateway** | ⏳ Pending | 0% | Person 1 |
| **Frontend** | ⏳ Pending | 0% | TBD |

---

## 🧩 Microservices Overview

### 1. ✅ User Service (Node.js + Express + MongoDB) - **COMPLETE**
**Port:** 3001  
**Status:** Running and Ready for Integration

**Responsibilities:**
- User registration  
- User login  
- JWT authentication  
- User profile management  

**Available Endpoints:**
```
POST   /api/users/register     - Register new user
POST   /api/users/login        - Login user
GET    /api/users/me           - Get current user profile (protected)
PUT    /api/users/me           - Update user profile (protected)
POST   /api/users/logout       - Logout user (protected)
GET    /api/users              - Get all users (protected)
```

**How to Run:**
```bash
cd user-service
npm install
npm run dev
```

**Test It:**
```bash
# Register
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"Test1234"}'

# Login
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test1234"}'
```

---

### 2. ⏳ Product Service (Python + FastAPI/Flask + PostgreSQL + Elasticsearch)
**Port:** 5000  
**Status:** Not Started

**Responsibilities:**
- Product listing  
- Categories  
- Inventory management  
- Product search and filtering  

**Required Endpoints:**
```
POST   /api/products           - Create product
GET    /api/products           - Get all products
GET    /api/products/:id       - Get product by ID
PUT    /api/products/:id       - Update product
DELETE /api/products/:id       - Delete product
GET    /api/products/search    - Search products
```

---

### 3. ⏳ Order Service (Java + Spring Boot + MySQL)
**Port:** 8080  
**Status:** Not Started

**Responsibilities:**
- Order creation  
- Order history  
- Payment processing (Stripe)  
- Order status tracking  

**Required Endpoints:**
```
POST   /api/orders             - Create order
GET    /api/orders             - Get user orders
GET    /api/orders/:id         - Get order by ID
PUT    /api/orders/:id/status  - Update order status
POST   /api/orders/:id/pay     - Process payment
```

---

### 4. ⏳ API Gateway (TypeScript + Node.js)
**Port:** 8000  
**Status:** Basic Setup Only

**Responsibilities:**
- Route requests to microservices  
- Authentication middleware  
- Request logging  
- Rate limiting  
- Error handling  

**Routes to Configure:**
```
/auth/*      → user-service:3001
/users/*     → user-service:3001
/products/*  → product-service:5000
/orders/*    → order-service:8080
```

---

### 5. ⏳ Frontend (React)
**Port:** 3000  
**Status:** Not Started

**Responsibilities:**
- User interface  
- Product browsing  
- Shopping cart  
- Checkout process  
- User dashboard  

---

## 📁 Project Structure

```
swiftshop-project/
├── user-service/              ✅ COMPLETE
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── README.md             (see user-service/README.md for details)
│
├── product-service/           ⏳ TODO
│   ├── main.py
│   └── requirements.txt
│
├── order-service/             ⏳ TODO
│   ├── src/
│   └── pom.xml
│
├── api-gateway/               ⏳ TODO
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  ⏳ TODO
│   └── (React app)
│
├── docker/                    ⏳ TODO
│   └── docker-compose.yml
│
└── README.md                  (this file)
```

---

## 🔧 Technology Stack

| Service | Language | Framework | Database | Port |
|---------|----------|-----------|----------|------|
| User Service | JavaScript | Express.js | MongoDB | 3001 |
| Product Service | Python | FastAPI | PostgreSQL | 5000 |
| Order Service | Java | Spring Boot | MySQL | 8080 |
| API Gateway | TypeScript | Express/NestJS | - | 8000 |
| Frontend | JavaScript | React | - | 3000 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Java (JDK 17+)
- MongoDB
- PostgreSQL
- MySQL
- Docker (optional)

### Quick Start

**1. Start User Service:**
```bash
cd user-service
npm install
npm run dev
```

**2. Start Product Service:** (when ready)
```bash
cd product-service
pip install -r requirements.txt
python main.py
```

**3. Start Order Service:** (when ready)
```bash
cd order-service
./mvnw spring-boot:run
```

**4. Start API Gateway:** (when configured)
```bash
cd api-gateway
npm install
npm run dev
```

**5. Start Frontend:** (when ready)
```bash
cd frontend
npm install
npm start
```

---

## 🧪 Testing the System

### Test User Service (Available Now)

**1. Register a User:**
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

**3. Get Profile (use token from login):**
```bash
curl http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Development Guidelines

### For Each Service:

1. **Follow REST API conventions**
2. **Use proper HTTP status codes**
3. **Implement error handling**
4. **Add input validation**
5. **Document your endpoints**
6. **Write basic tests**

### Response Format (Standard):
```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

### Error Format (Standard):
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical details"
}
```

---

## 🔐 Authentication Flow

1. User registers/logs in via **User Service**
2. User Service returns **JWT token**
3. Client stores token
4. Client sends token in header: `Authorization: Bearer <token>`
5. API Gateway validates token
6. Request forwarded to appropriate service

---

## 🗓️ Development Timeline

### Week 1 (Current)
- [x] User Service - Registration & Login
- [x] User Service - Profile Management
- [x] User Service - JWT Authentication
- [ ] API Gateway - Basic Routing
- [ ] Product Service - Setup

### Week 2
- [ ] Product Service - CRUD Operations
- [ ] Order Service - Setup
- [ ] Order Service - Basic Orders
- [ ] Frontend - Basic UI

### Week 3
- [ ] Integration Testing
- [ ] Docker Setup
- [ ] Bug Fixes
- [ ] Documentation

---

## 📚 Service Documentation

Detailed documentation for each service:

- **User Service:** [user-service/README.md](user-service/README.md)
- **Product Service:** Coming soon
- **Order Service:** Coming soon
- **API Gateway:** Coming soon

---

## 🤝 Team Roles

| Person | Services | Status |
|--------|----------|--------|
| Person 1 | User Service + API Gateway | User Service ✅ |
| Person 2 | Product Service | Not Started |
| Person 3 | Order Service | Not Started |
| TBD | Frontend | Not Started |

---

## 🐛 Known Issues

None yet! User Service is working perfectly. ✅

---

## 📞 Need Help?

**For User Service Issues:**
- Check [user-service/README.md](user-service/README.md)
- Verify MongoDB is running
- Check `.env` file configuration

**For Other Services:**
- Wait for documentation to be created
- Contact service owner

---

## 🎯 Next Steps

1. **Person 2:** Start Product Service
   - Setup FastAPI project
   - Connect to PostgreSQL
   - Implement basic CRUD

2. **Person 1:** Setup API Gateway
   - Configure routing to User Service
   - Add authentication middleware
   - Prepare for other services

3. **Person 3:** Start Order Service
   - Setup Spring Boot project
   - Connect to MySQL
   - Implement basic order creation

---

## ✅ Completion Checklist

- [x] Project structure created
- [x] User Service complete
- [ ] Product Service complete
- [ ] Order Service complete
- [ ] API Gateway configured
- [ ] Frontend built
- [ ] Services integrated
- [ ] Docker setup
- [ ] Documentation complete
- [ ] Testing complete
- [ ] Ready for deployment

---

## 📄 License

This project is for educational purposes.

---

## 🎓 Learning Outcomes

By completing this project, you will learn:
- Microservices architecture
- Multi-language integration
- RESTful API design
- JWT authentication
- Database management
- Docker containerization
- Service communication
- API Gateway patterns

---

**Last Updated:** December 2025  
**Status:** User Service Complete - Ready for Integration ✅
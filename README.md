# SwiftShop – Multi-Language Microservices E-Commerce Platform

SwiftShop is a microservices-based online shopping platform built using multiple programming languages.  
This project demonstrates how different services written in different languages can work together in one system.

---

## 🚀 Project Status - UPDATED

| Service | Status | Completion | Assigned To | Notes |
|---------|--------|------------|-------------|-------|
| **User Service** | ✅ Complete | 100% | Person 1 | Fully functional with JWT auth |
| **Product Service** | ❌ Not Started | 0% | Person 2 | **NEEDS IMMEDIATE ATTENTION** |
| **Order Service** | ✅ Complete | 100% | Person 3 | Basic CRUD implemented with H2 database |
| **API Gateway** | ✅ Complete | 100% | Person 1 | Routes configured for all services |
| **Frontend** | ⏳ In Progress | 70% | Person 1 | Basic structure only |Person 3 order service

---

## ✅ COMPLETED SERVICES

### 1. ✅ User Service (Node.js + Express + MongoDB) - **COMPLETE**
**Port:** 3001  
**Status:** Production Ready ✅

**Features Implemented:**
- ✅ User registration with password hashing
- ✅ User login with JWT authentication
- ✅ JWT token generation and validation
- ✅ User profile management (get/update)
- ✅ Protected routes middleware
- ✅ Get all users (admin functionality)
- ✅ Logout functionality

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

**Database:** MongoDB (local: `mongodb://localhost:27017/swiftshop`)

---

### 2. ✅ Order Service (Java + Spring Boot + H2 Database) - **COMPLETE**
**Port:** 8082  
**Status:** Functional ✅

**Features Implemented:**
- ✅ Create new orders
- ✅ Get order by ID
- ✅ Get orders by user ID
- ✅ Process payment (update order status to PAID)
- ✅ Order status tracking (CREATED, PAID, CANCELLED)
- ✅ H2 in-memory database configured
- ✅ JPA/Hibernate integration

**Available Endpoints:**
```
POST   /api/orders             - Create new order
GET    /api/orders/{id}        - Get order by ID
GET    /api/orders/user/{userId} - Get all orders for a user
PUT    /api/orders/{id}/pay    - Mark order as paid
```

**How to Run:**
```bash
cd order-service
./mvnw spring-boot:run
```

**Database:** H2 (in-memory)
- Console: http://localhost:8082/h2-console
- JDBC URL: `jdbc:h2:mem:ordersdb`
- Username: `sa`
- Password: (empty)

**Note:** Currently using H2 in-memory database. For production, should migrate to MySQL as per project requirements.

---

### 3. ✅ API Gateway (TypeScript + Node.js) - **COMPLETE**
**Port:** 8000  
**Status:** Fully Configured ✅

**Features Implemented:**
- ✅ Single entry point for all client requests
- ✅ Request routing to microservices
- ✅ Authentication header forwarding
- ✅ CORS enabled
- ✅ Error handling
- ✅ Health check endpoint
- ✅ Service status monitoring

**Routes Configured:**
```
/                    → Gateway health info
/health              → Gateway health check
/auth/register       → User Service
/auth/login          → User Service
/users/*             → User Service (with auth forwarding)
/products/*          → Product Service (placeholder - returns 503)
/orders/*            → Order Service (placeholder - returns 503)
```

**How to Run:**
```bash
cd api-gateway
npm install
npm run dev
```

**Current Limitation:** Product and Order service routes return 503 until those services are integrated.

---

## ❌ PENDING SERVICE

### 4. ❌ Product Service (Python + FastAPI + PostgreSQL + Elasticsearch)
**Port:** 5000  
**Status:** **NOT STARTED - CRITICAL**

**Required Features:**
- Product CRUD operations
- Category management
- Inventory tracking
- Product search with Elasticsearch
- Filtering capabilities

**Required Endpoints:**
```
POST   /api/products           - Create product
GET    /api/products           - Get all products
GET    /api/products/:id       - Get product by ID
PUT    /api/products/:id       - Update product
DELETE /api/products/:id       - Delete product
GET    /api/products/search    - Search products
```

**Technology Stack:**
- FastAPI or Flask
- PostgreSQL database
- Elasticsearch for search

**Current State:** Only has a basic `main.py` with a single root endpoint.

---

## ⏳ IN PROGRESS

### 5. ⏳ Frontend (React)
**Port:** 3000  
**Status:** Early Stage (70%)

**Planned Features:**
- User registration/login UI
- Product browsing
- Shopping cart
- Checkout process
- User dashboard

---

## 📊 Integration Status

### Working Integrations:
✅ API Gateway ↔ User Service (fully tested)
✅ Order Service (standalone, ready for integration)

### Pending Integrations:
❌ API Gateway ↔ Order Service (needs route update from placeholder)
❌ API Gateway ↔ Product Service (service doesn't exist yet)
❌ Frontend ↔ API Gateway (frontend not built)

---

## 🎯 NEXT STEPS (Priority Order)

### CRITICAL - Week 1-2:
1. **Product Service Development** (Person 2 - URGENT)
   - Set up FastAPI/Flask project structure
   - Configure PostgreSQL connection
   - Implement Product model and CRUD endpoints
   - Set up Elasticsearch for search
   - Test endpoints individually

2. **Order Service Integration** (Person 3)
   - Update Order Service to use MySQL instead of H2
   - Integrate payment gateway (Stripe) for real payment processing
   - Add order-product relationship

3. **API Gateway Updates** (Person 1)
   - Update `/orders/*` routes to forward to Order Service on port 8082
   - Update `/products/*` routes once Product Service is ready
   - Add rate limiting
   - Add request logging

### IMPORTANT - Week 3-4:
4. **Frontend Development** (Person 1 or assign to someone)
   - Build authentication pages (login/register)
   - Create product listing page
   - Build shopping cart
   - Implement checkout flow

5. **Service Communication**
   - Implement message queue (RabbitMQ or Kafka) for async operations
   - Set up service discovery (optional)

### NICE TO HAVE - Week 5+:
6. **Testing**
   - Unit tests for each service
   - Integration tests
   - End-to-end tests

7. **Deployment**
   - Dockerize all services
   - Create docker-compose.yml
   - Deploy to cloud (optional)

8. **Documentation**
   - API documentation with Swagger
   - Architecture diagrams
   - User guides

---

## 🔧 Technology Stack

| Service | Language | Framework | Database | Port |
|---------|----------|-----------|----------|------|
| User Service | JavaScript | Express.js | MongoDB | 3001 |
| Product Service | Python | FastAPI | PostgreSQL + Elasticsearch | 5000 |
| Order Service | Java | Spring Boot | H2 (→ MySQL) | 8082 |
| API Gateway | TypeScript | Express | - | 8000 |
| Frontend | JavaScript | React | - | 3000 |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+
- Python 3.9+
- Java JDK 17+
- MongoDB (running on localhost:27017)
- PostgreSQL (for Product Service)
- MySQL (for Order Service production)

### Start All Services:

**1. Start User Service:**
```bash
# Terminal 1
cd user-service
npm install
npm run dev
# Should see: "User Service running on port 3001"
```

**2. Start Order Service:**
```bash
# Terminal 2
cd order-service
./mvnw spring-boot:run
# Should see: "Tomcat started on port(s): 8082"
```

**3. Start API Gateway:**
```bash
# Terminal 3
cd api-gateway
npm install
npm run dev
# Should see: "API Gateway running on port 8000"
```

**4. (When Ready) Start Product Service:**
```bash
# Terminal 4
cd product-service
pip install -r requirements.txt
python main.py
```

---

## 🧪 Testing the Current System

### Test User Service via API Gateway:

**1. Register a User:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
# Save the token from response
```

**3. Get Profile:**
```bash
curl http://localhost:8000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Order Service Directly:

**1. Create Order:**
```bash
curl -X POST http://localhost:8082/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "totalAmount": 99.99
  }'
```

**2. Get Order by ID:**
```bash
curl http://localhost:8082/api/orders/1
```

**3. Pay for Order:**
```bash
curl -X PUT http://localhost:8082/api/orders/1/pay
```

---

## 🐛 Known Issues

1. **Order Service Database:** Currently using H2 in-memory database. Data is lost on restart. Need to migrate to MySQL.

2. **Order Service Port:** Running on 8082 instead of planned 8080 (likely due to port conflict).

3. **API Gateway Order Routes:** Not yet connected to actual Order Service - returns 503.

4. **No Inter-Service Authentication:** Services don't verify requests from API Gateway yet.

5. **Product Service:** Completely missing - blocking full system integration.

---

## 📝 Development Guidelines

### For Each Service:

1. **Follow REST API conventions**
2. **Use proper HTTP status codes**
3. **Implement error handling**
4. **Add input validation**
5. **Document your endpoints**
6. **Write basic tests**

### Standard Response Format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

### Standard Error Format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical details"
}
```

---

## 🔐 Authentication Flow

1. User registers/logs in via **User Service** (through API Gateway)
2. User Service returns **JWT token**
3. Client stores token
4. Client sends token in header: `Authorization: Bearer <token>`
5. API Gateway forwards token to appropriate service
6. Service validates token (future: should validate via User Service)

---

## 📞 Team Communication

| Person | Services | Status | Blockers |
|--------|----------|--------|----------|
| Person 1 | User Service, API Gateway, Frontend | User + Gateway ✅ | None |
| Person 2 | Product Service | Not started ❌ | **CRITICAL - Needs to start** |
| Person 3 | Order Service | Complete ✅ | None (ready for integration) |

---

## ⚠️ CRITICAL BLOCKERS

### 🚨 BLOCKER #1: Product Service Missing
**Impact:** HIGH  
**Assignee:** Person 2  
**Action Required:** Start Product Service development immediately

The entire e-commerce platform cannot function without products. This is the highest priority item.

### 🟡 BLOCKER #2: Order Service Database
**Impact:** MEDIUM  
**Assignee:** Person 3  
**Action Required:** Migrate from H2 to MySQL

Current in-memory database is not suitable for production.

---

## 📅 Updated Timeline

### Week 1-2 (NOW):
- [x] User Service
- [x] Order Service basic implementation
- [x] API Gateway setup
- [ ] **Product Service (CRITICAL)**
- [ ] Order Service MySQL migration

### Week 3-4:
- [ ] Frontend basic pages
- [ ] Service integration testing
- [ ] Payment gateway integration

### Week 5-6:
- [ ] Docker containerization
- [ ] Message queue setup
- [ ] Advanced features

---

## ✅ Completion Checklist

- [x] Project structure created
- [x] User Service complete
- [ ] Product Service complete **← CRITICAL**
- [x] Order Service basic implementation
- [x] API Gateway configured
- [ ] API Gateway connected to Order Service
- [ ] Frontend built
- [ ] Services fully integrated
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

**Last Updated:** December 28, 2025  
**Status:** 3/5 Services Complete - Product Service Development Required ⚠️  
**Overall Progress:** 60%
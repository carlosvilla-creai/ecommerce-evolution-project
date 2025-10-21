# Stage 3 Testing Guide

## 🎯 Complete Order Flow Testing

This guide will walk you through testing the complete order flow from adding items to cart, checking out, and viewing order history.

---

## ✅ Prerequisites

1. **Backend Running**: `cd backend && python -m uvicorn main:app --reload`
2. **Frontend Running**: `cd frontend && pnpm run dev`
3. **Clean Database**: Start with a fresh database for best results

---

## 📋 Test Scenarios

### Scenario 1: Complete Order Flow (Happy Path)

#### Step 1: Browse Products
1. Navigate to `http://localhost:5173/`
2. Click on "Products" in the header
3. **Expected**: Product catalog displays with cards showing:
   - Product name, price, stock, category
   - "Add to Cart" and "View" buttons
   - Stock status tags (In Stock / Low Stock / Out of Stock)

#### Step 2: Search and Filter Products
1. Use the search bar to search for a product (e.g., "Wireless")
2. Use the category filter to filter by category
3. Use price filters (min/max price)
4. **Expected**: Product list updates based on filters

#### Step 3: Add Items to Cart
1. Click "Add to Cart" on multiple products (at least 3 different products)
2. **Expected**:
   - Cart badge in header updates with item count
   - Success message appears for each addition
   - Cart persists in localStorage (refresh page and cart should remain)

#### Step 4: View Cart
1. Click the shopping cart icon in the header
2. **Expected**: Cart page displays with:
   - List of all cart items with product details
   - Quantity controls (increase/decrease)
   - Remove button for each item
   - Subtotal for each item
   - Total cart summary
   - "Continue Shopping" and "Proceed to Checkout" buttons

#### Step 5: Modify Cart
1. Increase quantity of an item
2. Decrease quantity of an item
3. Remove an item from cart
4. **Expected**:
   - Quantities update correctly
   - Prices recalculate automatically
   - Cart badge updates
   - Changes persist in localStorage

#### Step 6: Proceed to Checkout
1. Click "Proceed to Checkout"
2. **Expected**: Navigate to checkout page with:
   - Order summary on the right (items, prices, tax, shipping, total)
   - Checkout form on the left (shipping address, billing address, notes)

#### Step 7: Fill Checkout Form
1. Enter shipping address (at least 10 characters)
2. Check/uncheck "Same as shipping address" for billing
3. Optionally add order notes
4. Click "Place Order"
5. **Expected**:
   - Form validation works (required fields, minimum length)
   - Loading state appears on button
   - Order is created
   - Success page appears with order number

#### Step 8: View Order Confirmation
1. After successful order placement
2. **Expected**: Success page displays with:
   - Success icon and message
   - Order number
   - "View My Orders" and "Continue Shopping" buttons
   - Cart is cleared (cart badge shows 0)

#### Step 9: View Order History
1. Click "View My Orders" or navigate to "My Orders" in header
2. **Expected**: Order history page displays with:
   - List of all orders
   - Order cards showing: order ID, status, date, items count, total
   - Status badges with colors (pending=orange, confirmed=blue, etc.)
   - "View Details" button for each order
   - Pagination if more than 10 orders

#### Step 10: View Order Details
1. Click "View Details" on an order
2. **Expected**: Order detail page displays with:
   - Order ID and status badge
   - Order information (order date, last updated, addresses, notes)
   - Table of order items (product, quantity, unit price, subtotal)
   - Order summary (subtotal, tax, shipping, total)
   - "Back to Orders" button

---

### Scenario 2: Empty Cart Checkout Prevention

#### Test Steps:
1. Ensure cart is empty
2. Navigate directly to `/checkout`
3. **Expected**: 
   - Warning page appears: "Your cart is empty"
   - "Continue Shopping" button redirects to products page

---

### Scenario 3: Cart Persistence

#### Test Steps:
1. Add items to cart
2. Refresh the page (F5)
3. **Expected**: Cart items remain (retrieved from localStorage)
4. Close browser and reopen
5. **Expected**: Cart items still present

---

### Scenario 4: Stock Validation

#### Test Steps:
1. Find a product with low stock or set a product to have stock = 1
2. Add it to cart
3. Try to increase quantity beyond available stock
4. **Expected**: Cannot add more than available stock (handled by backend)

---

### Scenario 5: Authentication Flow (Note: Login not yet implemented)

**Current Behavior**: 
- Orders API requires authentication
- Without login (Stage 4), you'll get 401/403 errors when trying to place orders

**Testing with Mock Token** (for Stage 3 testing):
1. You may need to first register a user and login using API docs at `http://localhost:8000/docs`
2. Copy the JWT token
3. Use browser dev tools to set the token in API calls (or use a browser extension like ModHeader)

**Recommended**: Wait until Stage 4 for full authentication flow testing

---

### Scenario 6: Order Status Workflow

#### Test Steps (Admin):
1. Place an order (status: "pending")
2. Use API docs (`/docs`) to update order status:
   - Try invalid transitions (e.g., pending → delivered)
   - Try valid transitions (pending → confirmed → processing → shipped → delivered)
3. **Expected**: 
   - Invalid transitions are rejected
   - Valid transitions succeed
   - Order detail page reflects new status

---

## 🧪 API Testing with Swagger UI

Navigate to `http://localhost:8000/docs` to test backend endpoints directly:

### Products Endpoints:
- `GET /api/v1/products` - List products with filters
- `GET /api/v1/products/{id}` - Get single product
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/{id}` - Update product (admin)
- `DELETE /api/v1/products/{id}` - Delete product (admin)

### Users Endpoints:
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user (get JWT token)
- `GET /api/v1/users/me` - Get current user profile (requires auth)
- `PUT /api/v1/users/me` - Update profile (requires auth)

### Orders Endpoints:
- `POST /api/v1/orders` - Create order (requires auth)
- `GET /api/v1/orders/my-orders` - Get user's orders (requires auth)
- `GET /api/v1/orders/{id}` - Get order details (requires auth)
- `PUT /api/v1/orders/{id}/status` - Update order status (admin, requires auth)

---

## 🐛 Common Issues & Solutions

### Issue 1: "401 Unauthorized" when creating order
**Solution**: You need to be logged in. Register and login first at `/api/v1/users/register` and `/api/v1/users/login`, then use the JWT token.

### Issue 2: Cart not persisting
**Solution**: Check browser console for localStorage errors. Ensure localStorage is enabled in your browser.

### Issue 3: "Product not found" error during checkout
**Solution**: Ensure the products you added to cart still exist in the database.

### Issue 4: Backend not starting
**Solution**: 
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check for port conflicts (default: 8000)
- Check database file permissions

### Issue 5: Frontend not starting
**Solution**: 
- Ensure all dependencies are installed: `pnpm install`
- Check for port conflicts (default: 5173)
- Clear node_modules and reinstall if needed

---

## ✅ Success Criteria

Stage 3 is complete when:
- ✅ Users can browse and search products
- ✅ Users can add items to cart
- ✅ Cart persists in localStorage
- ✅ Cart badge shows correct count
- ✅ Users can modify cart (update quantities, remove items)
- ✅ Users can proceed to checkout
- ✅ Checkout form validates inputs
- ✅ Orders are created successfully
- ✅ Users can view order history
- ✅ Users can view order details
- ✅ Order status is displayed correctly with colored badges
- ✅ Cart is cleared after successful checkout
- ✅ Navigation flows smoothly between all pages

---

## 📊 Test Checklist

Use this checklist to track your testing progress:

### Backend:
- [ ] Database initializes correctly
- [ ] Products API endpoints work
- [ ] Users API endpoints work (register, login)
- [ ] Orders API endpoints work (create, get, list)
- [ ] Order validation works (status transitions)
- [ ] Foreign key relationships work (order → user, order_item → product)
- [ ] Transactions work (order creation is atomic)

### Frontend - Products:
- [ ] Product catalog loads
- [ ] Search works
- [ ] Filters work (category, price)
- [ ] Pagination works
- [ ] Product detail page works
- [ ] Add to cart button works

### Frontend - Cart:
- [ ] Cart badge shows correct count
- [ ] Cart page displays items
- [ ] Quantity update works
- [ ] Remove item works
- [ ] Cart summary calculates correctly
- [ ] Cart persists in localStorage
- [ ] Empty cart shows empty state

### Frontend - Orders:
- [ ] Checkout page displays correctly
- [ ] Order summary shows correct totals
- [ ] Checkout form validates
- [ ] Order creation works
- [ ] Success page appears
- [ ] Order history page loads
- [ ] Order cards display correctly
- [ ] Order detail page shows full info
- [ ] Status badges have correct colors
- [ ] Pagination works on order history

### Integration:
- [ ] Navigation between all pages works
- [ ] Header updates correctly (cart badge, active menu)
- [ ] Cart clears after order
- [ ] Error messages display properly
- [ ] Loading states appear during API calls

---

## 📝 Notes for Stage 4

Stage 3 has limited authentication. In Stage 4, we'll implement:
- Login/Register pages in the frontend
- Auth context for managing user state
- Protected routes (redirect to login if not authenticated)
- Persistent login with token refresh
- Profile management UI

For now, use the API documentation interface for authentication testing.

---

## 🎉 Next Steps

Once all tests pass:
1. Update `ARCHITECTURE.md` with Stage 3 completion details
2. Create git commit: `feat: Day 3 - Implement Orders backend with Cart and Checkout frontend`
3. Update `README.md` progress tracker
4. Proceed to Stage 4 (Users/Auth Frontend)


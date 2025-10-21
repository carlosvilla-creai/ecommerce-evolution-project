# Stage 4 Testing Guide - Authentication & Protected Routes

## 🎯 Complete Testing Flow

This guide will walk you through testing the complete authentication flow and protected routes.

---

## ✅ Prerequisites

1. **Backend Running**: `python -m uvicorn main:app --reload` (in `backend/`)
2. **Frontend Running**: `pnpm run dev` (in `frontend/`)
3. **Clean State**: Start fresh or clear localStorage

---

## 📋 Test Scenarios

### Scenario 1: User Registration (Happy Path)

#### Step 1: Navigate to Register Page
1. Go to `http://localhost:3000`
2. Click "Register" button in the header (top-right)
3. **Expected**: Registration page loads with form

#### Step 2: Fill Registration Form
1. **First Name**: John
2. **Last Name**: Doe
3. **Email**: john.doe@test.com
4. **Password**: Password123
5. **Confirm Password**: Password123
6. Click "Create Account"

#### Step 3: Verify Auto-Login
- **Expected**:
  - Success message appears
  - Automatically logged in
  - Redirected to `/products` page
  - Header shows "John" with dropdown (not Login/Register)

---

### Scenario 2: Login Flow

#### Step 1: Logout First (if logged in)
1. Click username dropdown in header
2. Click "Logout"
3. **Expected**: Success message, header shows Login/Register

#### Step 2: Navigate to Login
1. Click "Login" button in header
2. **Expected**: Login page loads

#### Step 3: Login with Credentials
1. **Email**: john.doe@test.com
2. **Password**: Password123
3. Click "Log In"
4. **Expected**:
   - Success message
   - Redirected to `/products`
   - Header shows "John"

---

### Scenario 3: Protected Routes Redirect

#### Step 1: Logout
1. Click username dropdown → Logout
2. **Expected**: Header shows Login/Register

#### Step 2: Try Accessing Protected Route
1. Manually navigate to `http://localhost:3000/orders`
2. **Expected**:
   - Automatic redirect to `/login`
   - Login form appears

#### Step 3: Login and Redirect Back
1. Login with credentials
2. **Expected**:
   - Success message
   - Automatically redirected back to `/orders` (intended destination!)

---

### Scenario 4: Complete Checkout Flow (End-to-End)

#### Step 1: Add Items to Cart (No Login Required)
1. Go to `/products`
2. Add 2-3 items to cart
3. **Check**: Cart badge updates with count

#### Step 2: View Cart
1. Click cart icon in header
2. **Expected**: Cart page with items
3. **Check**: Items, quantities, prices correct

#### Step 3: Proceed to Checkout (Auth Required)
1. Click "Proceed to Checkout"
2. **If not logged in**:
   - Redirect to `/login`
   - Login
   - Automatically redirect back to `/checkout`
3. **If logged in**:
   - Checkout page loads directly

#### Step 4: Fill Checkout Form
1. **Shipping Address**: 123 Main St, Apt 4, New York, NY 10001
2. Check "Same as shipping address" (or fill billing separately)
3. **Notes** (optional): Please ring doorbell
4. Click "Place Order"

#### Step 5: Verify Order Success
- **Expected**:
  - Success message with order number
  - Cart cleared (badge shows 0)
  - Option to "View My Orders"

#### Step 6: View Order History
1. Click "View My Orders" or navigate to `/orders`
2. **Expected**:
   - Order history page with your new order
   - Order shows: status, items count, total
   - "View Details" button

#### Step 7: View Order Details
1. Click "View Details" on your order
2. **Expected**:
   - Full order information
   - Order items table
   - Order summary (subtotal, tax, shipping, total)
   - Status badge (should be "Pending")

---

### Scenario 5: Profile Management

#### Step 1: Navigate to Profile
1. Click username dropdown in header
2. Click "My Profile"
3. **Expected**: Profile page with user info

#### Step 2: View Profile Information
- **Check displays**:
  - Full name
  - Email
  - Role (customer/admin)
  - Status (Active)
  - Account created date

#### Step 3: Edit Profile
1. Click "Edit Profile" button
2. **Change First Name**: Jane
3. **Change Last Name**: Smith
4. Click "Save Changes"
5. **Expected**:
   - Success message
   - Profile updates
   - Header shows "Jane" (not "John")

#### Step 4: Verify Persistence
1. Refresh the page (F5)
2. **Expected**:
   - Still logged in
   - Header still shows "Jane"
   - Profile page shows updated info

---

### Scenario 6: Token Persistence

#### Step 1: Login and Add Items
1. Login
2. Add items to cart
3. **Check**: Cart badge shows count

#### Step 2: Refresh Page
1. Press F5 to refresh
2. **Expected**:
   - Still logged in
   - Header shows username
   - Cart items still there

#### Step 3: Close and Reopen Browser
1. Close browser completely
2. Reopen and go to `http://localhost:3000`
3. **Expected**:
   - Still logged in (token persisted!)
   - Header shows username

#### Step 4: Logout
1. Click username dropdown → Logout
2. Refresh page
3. **Expected**:
   - Stay logged out
   - Header shows Login/Register

---

### Scenario 7: Form Validation

#### Test Registration Validation:
1. Go to `/register`
2. **Test weak password**: "password" (no uppercase/number)
   - **Expected**: Validation error
3. **Test short password**: "Pass1"
   - **Expected**: "Password must be at least 8 characters"
4. **Test mismatched passwords**:
   - Password: "Password123"
   - Confirm: "Password124"
   - **Expected**: "The passwords do not match!"
5. **Test invalid email**: "notanemail"
   - **Expected**: "Please enter a valid email"

#### Test Login Validation:
1. Go to `/login`
2. **Test empty fields**:
   - **Expected**: "Please enter your email/password"
3. **Test invalid email format**:
   - **Expected**: "Please enter a valid email"

---

### Scenario 8: User Dropdown Menu

#### Step 1: Login
1. Login with any account
2. **Expected**: Header shows username with dropdown arrow

#### Step 2: Test Dropdown Options
1. Click username in header
2. **Expected dropdown menu**:
   - "My Profile" (with user icon)
   - "My Orders" (with shopping icon)
   - Divider line
   - "Logout" (red/danger color)

#### Step 3: Test Each Option
1. Click "My Profile" → goes to `/profile`
2. Go back, click username again
3. Click "My Orders" → goes to `/orders`
4. Go back, click username again
5. Click "Logout" → logs out, redirects to `/products`

---

## 🐛 Common Issues & Solutions

### Issue 1: "Login failed" or 401 Errors
**Cause**: Backend not running or wrong URL
**Solution**:
1. Check backend is running on `http://localhost:8000`
2. Test backend: Go to `http://localhost:8000/docs`
3. Try registering a new user first

### Issue 2: Redirect Loop on Protected Routes
**Cause**: Token not being saved
**Solution**:
1. Clear localStorage: DevTools → Application → Local Storage → Clear
2. Logout and login again
3. Check browser console for errors

### Issue 3: Cart Cleared After Login
**Cause**: Expected behavior (cart is local, orders are server-side)
**Solution**: This is normal! Cart is for browsing, orders are after login

### Issue 4: Header Doesn't Update After Login
**Cause**: AuthContext not refreshing
**Solution**:
1. Refresh page
2. Check browser console for errors
3. Verify you're getting a token (DevTools → Application → Local Storage)

### Issue 5: Can't Place Order (422 Error)
**Cause**: Missing required fields
**Solution**:
1. Ensure shipping address is at least 10 characters
2. Fill all required fields
3. Check browser console for validation errors

---

## ✅ Success Criteria

After completing all scenarios, you should have:

**Registration & Login:**
- ✅ Successfully registered a new account
- ✅ Auto-logged in after registration
- ✅ Manually logged in
- ✅ Logged out

**Protected Routes:**
- ✅ Redirected to login when accessing protected routes
- ✅ Redirected back to intended page after login
- ✅ Can access orders page when logged in
- ✅ Can access checkout when logged in
- ✅ Can access profile when logged in

**Complete Flow:**
- ✅ Added items to cart (no login)
- ✅ Logged in to checkout
- ✅ Completed order
- ✅ Viewed order history
- ✅ Viewed order details

**Profile:**
- ✅ Viewed profile information
- ✅ Edited profile successfully
- ✅ Changes reflected in header

**Persistence:**
- ✅ Token persisted after refresh
- ✅ Token persisted after browser close
- ✅ Cart persisted after refresh
- ✅ Logout cleared token

**UX:**
- ✅ Error messages display correctly
- ✅ Success messages display correctly
- ✅ User dropdown works
- ✅ Form validation works
- ✅ Loading states appear

---

## 🎯 Quick Checklist

Use this checklist for rapid testing:

- [ ] Register new account
- [ ] Auto-login after registration
- [ ] Logout
- [ ] Manual login
- [ ] Try accessing `/orders` when logged out (should redirect)
- [ ] Login and verify redirect back to `/orders`
- [ ] Add items to cart
- [ ] Checkout (with login)
- [ ] Place order
- [ ] View order history
- [ ] View order details
- [ ] Edit profile
- [ ] Verify header updates
- [ ] Refresh page (stay logged in?)
- [ ] User dropdown menu works
- [ ] Logout
- [ ] Verify logout cleared state

---

## 🔍 Backend Testing (via Swagger UI)

If you want to test backend directly:

1. Go to `http://localhost:8000/docs`
2. **Test Register**: POST `/api/v1/users/register`
   ```json
   {
     "email": "test@example.com",
     "password": "Password123",
     "first_name": "Test",
     "last_name": "User"
   }
   ```
3. **Test Login**: POST `/api/v1/users/login`
   ```json
   {
     "email": "test@example.com",
     "password": "Password123"
   }
   ```
   - Copy the `access_token` from response
4. **Click "Authorize"** button (top right in Swagger)
   - Paste token in "Value" field
   - Click "Authorize"
5. **Test Protected Endpoint**: GET `/api/v1/users/me`
   - Should return your user info
6. **Test Orders**: POST `/api/v1/orders`
   ```json
   {
     "items": [
       {"product_id": 1, "quantity": 2}
     ],
     "shipping_address": "123 Main St, New York, NY 10001",
     "billing_address": "123 Main St, New York, NY 10001"
   }
   ```

---

## 🎉 All Tests Passing?

If all tests pass, congratulations! **Stage 4 is complete!** 🎊

You now have:
- ✅ Complete authentication system
- ✅ Protected routes working
- ✅ User profile management
- ✅ Full order flow end-to-end
- ✅ Token persistence
- ✅ Great UX with redirects

**Ready for Stage 5: Admin Panel!** 🚀


# Lab Platform - Frontend/Backend Analysis Report

## 1. PATIENT DASHBOARD PAGE

### Location
- **Frontend:** [frontend/app/patient/dashboard/page.jsx](frontend/app/patient/dashboard/page.jsx)
- **Route:** `/patient/dashboard`

### Current Implementation
The dashboard is a simple layout component that imports and displays 6 dashboard components:

```
- WelcomeCard
- StatusSummary 
- ActiveOrders
- UpcomingVisit
- RecentResults
- BottomNav
```

### What Data It Displays (Currently Hardcoded)
1. **StatusSummary** - Mock counts for order statuses:
   - "در انتظار" (Pending): 2
   - "زمان‌بندی شده" (Scheduled): 1
   - "در حال انجام" (In Progress): 1
   - "تکمیل شده" (Completed): 5

2. **ActiveOrders** - Example orders with:
   - Order ID
   - Test names (CBC, Vitamin D, etc.)
   - Date
   - Status text (نمونه‌گیر تخصیص داده شد = Sampler assigned)
   - Progress step (1-3)

3. **RecentResults** - Mock results with:
   - Test name
   - Date
   - Link to view detail

### Files in Dashboard Components Folder
- [ActiveOrders.jsx](frontend/app/_components/PatientDashboard/ActiveOrders.jsx)
- [StatusSummary.jsx](frontend/app/_components/PatientDashboard/StatusSummary.jsx)
- [RecentResults.jsx](frontend/app/_components/PatientDashboard/RecentResults.jsx)
- [UpcomingVisit.jsx](frontend/app/_components/PatientDashboard/UpcomingVisit.jsx)
- [OrderProgress.jsx](frontend/app/_components/PatientDashboard/OrderProgress.jsx)
- [WelcomeCard.jsx](frontend/app/_components/PatientDashboard/WelcomeCard.jsx)

### ⚠️ What's Missing for Backend Integration
1. **No API calls** - All data is hardcoded in components
2. **No useState/useEffect** - Components don't fetch real data
3. **Missing patient context** - No way to identify current patient
4. **Status summary not dynamic** - Should count orders by status from backend
5. **Recent results not dynamic** - Should fetch from lab results API
6. **No error handling** - No loading states or error messages

---

## 2. PATIENT ORDERS PAGE

### Locations
Two separate implementations:

#### A. Empty Placeholder
- **File:** [frontend/app/(patient)/orders/page.jsx](frontend/app/%28patient%29/orders/page.jsx)
- **Route:** `/(patient)/orders`
- **Status:** Shows "هنوز سفارشی ثبت نشده است" (No orders yet)
- **Content:** Empty - just a placeholder message

#### B. Functional Orders Page  
- **File:** [frontend/app/laborders/page.jsx](frontend/app/laborders/page.jsx)
- **Route:** `/laborders`
- **Status:** Working implementation with API integration
- **Components:** Uses `OrderCard` component from `./_components/`

### Current Implementation (Lab Orders)
```javascript
- Fetches orders via getOrders() from API
- Maps orders to OrderCard components
- Uses useEffect for data loading
- Simple loading message
```

### ⚠️ What's Missing
1. **Path inconsistency** - Two different order pages for patients
2. **Placeholder page not connected** - `/(patient)/orders` is empty
3. **Authentication not checked** - Doesn't verify user owns these orders

---

## 3. TEST WIZARD PAGE

### Location
- **File:** [frontend/app/test-wizard/page.jsx](frontend/app/test-wizard/page.jsx)
- **Route:** `/test-wizard`

### Wizard Steps (5 total)

**Step 1: Select Gender**
- Buttons: "مرد" (Male) / "زن" (Female)
- Saves to: `form.gender`

**Step 2: Enter Age**
- Input field for numeric age
- Continues only if age is provided
- Saves to: `form.age`

**Step 3: Select Tests**
- Fetches all available tests from `/lab-tests` API endpoint
- Checkbox list with test names and prices (in Iranian Rials)
- Auto-selects all tests for demo convenience
- Saves to: `selectedTests[]`
- Continue disabled if no tests selected

**Step 4: Authentication**
- Phone number input
- Password input
- Two buttons: "ورود" (Login) / "ثبت نام" (Register)
- Supports both existing and new user flows
- Calls `POST /auth/login` or `POST /auth/register`
- Stores token and user data to localStorage
- Saves to: `auth.phone`, `auth.password`

**Step 5: Confirmation**
- Shows success message: "✓ سفارش ثبت شد"
- Auto-redirects to `/patient/dashboard` after 2 seconds

### Order Creation Flow
```
Wizard Step 4 → Auth (login/register) → 
  Create order via POST /orders with:
  {
    userId: user.id,
    testIds: [selected test IDs],
    wizardData: {
      gender,
      age,
      // Can include additional fields
    }
  }
```

### API Constants
```javascript
- allTests: `${API_BASE}/lab-tests`
- createOrder: `${API_BASE}/orders`
- login: `${API_BASE}/auth/login`
- register: `${API_BASE}/auth/register`
```

### ⚠️ What's Missing
1. **Address collection** - No address/location input during wizard
2. **Payment flow** - No payment step or payment integration
3. **Personal info** - No firstName, lastName, nationalId collection (stored as defaults)
4. **Error handling** - Basic alert() for errors, no UI error messages
5. **Loading state** - loading state variable not used effectively
6. **Navigation info** - Could benefit from progress indicators

---

## 4. BACKEND API ENDPOINTS

### Patient Endpoints
- **Base URL:** `POST /patients`
- **Create Patient:**
  ```
  POST /patients
  Body: {
    userId: string,
    firstName: string,
    lastName: string,
    nationalId: string,
    birthDate: Date,
    gender: string,
    insuranceId?: string
  }
  ```

### ⚠️ Patient API Issues
1. **MISSING:** No GET endpoints to retrieve patient data
2. **MISSING:** No GET /patients/:id endpoint
3. **MISSING:** No GET /patients/by-user/:userId endpoint
4. **Service limitation:** [PatientsService](backend/src/patients/patients.service.ts) only has `create()` method
5. **No search/filter:** Cannot list or find patients

### Orders Endpoints
All endpoints in [OrdersController](backend/src/orders/orders.controller.ts):

#### POST /orders - Create Order
```
Request Body:
{
  // Option 1: From wizard (creates patient/address if needed)
  userId: string,
  testIds: string[],
  wizardData?: {
    gender?: string,
    age?: string,
    city?: string,
    street?: string,
    building?: string,
    latitude?: number,
    longitude?: number
  },

  // Option 2: Traditional (existing patient/address)
  patientId: string,
  addressId: string,
  testIds: string[]
}

Response includes:
- Order with all orderTests
- Address details
```

#### GET /orders/:id - Get Single Order
```
Returns:
- Order details
- orderTests with labTest details and results
- Address information
```

#### GET /orders/by-patient/:patientId - Get Patient's Orders
```
Returns:
- All orders for a patient (newest first)
- Each order includes orderTests with labTest and results
- Address information
```

### Lab Tests Endpoints
[LabTestsController](backend/src/lab-tests/lab-tests.controller.ts):

#### GET /lab-tests
```
Returns array of all available lab tests with:
- id
- name
- price (optional)
- Other test metadata
```

#### POST /lab-tests
```
Creates new test (admin only - not protected)
```

#### GET /lab-tests/:id
```
Gets single test details
```

### API Helper Function
[Frontend API lib](frontend/lib/api.js) provides:
```javascript
- getOrders() → GET /orders
- getLabTests() → GET /lab-tests
- createOrder(data) → POST /orders
- getPatients() → GET /patients
```

---

## 5. PAYMENT-RELATED CODE

### Status: ❌ NOT IMPLEMENTED

**Search Results:**
- Zero mentions of "stripe"
- Zero mentions of "payment"
- Zero mentions of "billing"
- Zero mentions of "checkout"
- Zero mentions of "charge"
- Zero mentions of "transaction"

### Implications
1. **No payment gateway integration** - Stripe, PayPal, Razorpay, etc. not set up
2. **No billing schema** - Prisma doesn't have Payment/Invoice models
3. **No price enforcement** - Tests have prices but no payment capture
4. **No order validation** - Orders created without payment confirmation
5. **No payment UI** - No checkout page or payment form

---

## 6. DATABASE SCHEMA (Prisma)

Key models relevant to patient flow:

```prisma
model User {
  id: String @id @default(uuid())
  phone: String @unique  
  email: String? @unique
  password: String
  role: UserRole (PATIENT|SAMPLER|LAB_ADMIN|SUPER_ADMIN)
}

model Patient {
  id: String @id @default(uuid())
  userId: String @unique
  firstName: String
  lastName: String
  nationalId: String @unique
  birthDate: DateTime
  gender: String
  insuranceId: String?
  orders: Order[]
  addresses: Address[]
}

model Order {
  id: String @id @default(uuid())
  patientId: String
  addressId: String
  status: OrderStatus (CREATED|SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED)
  createdAt: DateTime
  orderTests: OrderTest[]
  address: Address
}

model OrderTest {
  orderId: String
  testId: String
  labTest: LabTest
  result: LabResult?
}

model LabTest {
  id: String
  name: String
  price: Float?
}

model LabResult {
  id: String
  orderTestId: String
  // result data fields
}
```

---

## 7. SUMMARY: WHAT'S MISSING FOR FULL BACKEND INTEGRATION

### Critical Backend Gaps
| Feature | Status | Impact |
|---------|--------|--------|
| GET /patients/:id | ❌ Missing | Dashboard can't load patient profile |
| GET /patients/user/:userId | ❌ Missing | Patients can't find their own record |
| GET /orders (filtered by auth user) | ⚠️ Partial | No auth/permission checks |
| Lab Results API | ❌ Missing | Recent results component broken |
| Payment system | ❌ Missing | Orders created without payment |
| Order status filtering | ✅ Works | Can get by-patient with includes |

### Critical Frontend Gaps
| Feature | Status | Impact |
|---------|--------|--------|
| Dashboard data binding | ❌ Hardcoded | Shows fake data only |
| Auth context | ⚠️ Basic | localStorage only, no protected pages |
| Patient profile loading | ❌ Missing | Profile page shows localStorage data only |
| Order detail pages | ⚠️ Partial | Link exists but page may not fetch data |
| Test selection UI | ✅ Works | Test wizard fetches real tests |

### What Works End-to-End
1. ✅ Test Wizard → Auth → Order Creation
2. ✅ Fetching all lab tests
3. ✅ Creating orders with test selection
4. ✅ Auto-creating patient/address from wizard

### What Needs Backend Work
1. ❌ Patient GET endpoints
2. ❌ Lab Results endpoints
3. ❌ Order status summaries/filtering
4. ❌ Payment system
5. ❌ Permission/authorization checks on order retrieval

---

## 8. RECOMMENDED NEXT STEPS

### Phase 1: Backend (High Priority)
1. Add GET /patients/:id and GET /patients/user/:userId endpoints
2. Add lab results fetching endpoint
3. Add order status summary/filtering endpoint
4. Implement auth guards on GET endpoints

### Phase 2: Frontend Integration
1. Update dashboard components to fetch real data
2. Connect profile page to patient API
3. Add loading/error states to all components
4. Implement real-time order status updates

### Phase 3: Payment Integration
1. Choose payment provider (Stripe, Razorpay, etc.)
2. Add payment flow to test wizard (between auth and order)
3. Add payment success/failure handling
4. Store payment info and transactions

### Phase 4: Enhancements
1. Better address collection in wizard
2. Order tracking/timeline UI
3. Lab result notifications
4. Multiple addresses support


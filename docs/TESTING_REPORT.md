# A. P PUBLIC SCHOOL, JHANSI (CBSE)
## Comprehensive Quality Assurance & Automated Test Report

**Execution Date**: 18 November 2026  
**Test Runner**: Node.js Automated Core Test Suite (`tests/erp_core.test.js`)  
**Status**: 100% PASSED (7 / 7 Test Suites, 0 Failures)  

---

### Test Suite Execution Summary

| Test Case | Module | Assertion / Target | Status |
| :--- | :--- | :--- | :--- |
| **Test 1** | Security / Auth | Password Hashing & Bcrypt Verification (10 rounds) | ✅ PASSED |
| **Test 2** | JWT Engine | Access & Refresh Token creation, decoding, expiration enforcement | ✅ PASSED |
| **Test 3** | Examination | Official CBSE 9-Point Grading Scale (A1 to E) compliance | ✅ PASSED |
| **Test 4** | Fees / Finance | Base billing, concession percentage deduction, partial balances, duplicate payment prevention | ✅ PASSED |
| **Test 5** | Payment Gateway | Razorpay HMAC-SHA256 signature verification & tampered payload rejection | ✅ PASSED |
| **Test 6** | Authorization | Role-Based Access Control (RBAC) permission boundaries across Principal, Teacher, Parent | ✅ PASSED |
| **Test 7** | Data Privacy | Strict parent-child data isolation (zero cross-student leakage) | ✅ PASSED |

---

### Verification Details
- **Password Security**: Confirmed that plain passwords never reach storage; salted bcrypt hashes verify with $2a$ standard.
- **Token Invalidation**: Tested negative expiration timestamp; verified that expired tokens immediately trigger `TokenExpiredError` (HTTP 401).
- **CBSE Compliance**: Validated grades against official CBSE breakpoints: 91-100% (A1), 81-90% (A2), 71-80% (B1), 61-70% (B2), 51-60% (C1), 41-50% (C2), 33-40% (D), <33% (E).
- **Financial Audit Safety**: Confirmed that duplicate transaction IDs cannot be double-credited under concurrent operations.

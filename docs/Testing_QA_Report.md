# Software Testing and Quality Assurance Report

**Project Name:** Wellness Marketplace for Alternative Therapies  
**Assignment:** 4  
**Date:** April 19, 2026  

---

## 1. Introduction
This report documents the software testing and quality assurance (QA) procedures applied to the Wellness Marketplace system. The objective was to validate the system's functionality, reliability, and performance through structured testing techniques and to implement necessary optimizations for scalability.

---

## 2. Testing Strategy
A multi-layered testing strategy was adopted to ensure comprehensive coverage:

| Test Level | Focus Area | Tools Used |
| :--- | :--- | :--- |
| **Unit Testing** | Individual business logic in Services and Utility classes. | JUnit 5, Mockito |
| **Integration Testing** | API endpoint behavior and database interactions. | Spring MockMvc, H2 |
| **Component Testing** | UI responsiveness and frontend logic (Add to Cart, Buy Now). | Vitest, React Testing Library |
| **Manual E2E Testing** | Complete user flows from browsing to checkout. | Browser-based validation |
| **Performance Testing** | Response times and database query efficiency. | Chrome DevTools, SQL Query Profiling |

---

## 3. Test Cases and Outcomes

### 3.1 Functional Testing (Backend)

| Test Case ID | Feature | Description | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-BE-01** | Add to Cart | Add product with positive quantity. | Product successfully added to cart. | ✅ PASSED |
| **TC-BE-02** | Add to Cart | Add product with negative quantity. | System throws "Quantity must be positive" error. | ✅ PASSED |
| **TC-BE-03** | Order Creation | Create order with empty item list. | System throws "Order items cannot be empty" error. | ✅ PASSED |
| **TC-BE-04** | Order Creation | Create order with valid details. | Order saved and cart cleared. | ✅ PASSED |

### 3.2 Functional Testing (Frontend)

| Test Case ID | Feature | Description | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-FE-01** | Product Card | Click "Add to Cart" button. | Notification appears: "Added to Cart". | ✅ PASSED |
| **TC-FE-02** | Checkout | Submit order without address. | Form validation prevents submission. | ✅ PASSED |
| **TC-FE-03** | Navigation | Navigate between Home and Therapy sections. | Seamless page transition without reload. | ✅ PASSED |

---

## 4. Defect Diagnosis and Rectification
During the testing phase, several defects were identified and subsequently rectified to enhance system reliability.

### 4.1 Identified Defects

| Defect ID | Severity | Description | Rectification Action |
| :--- | :--- | :--- | :--- |
| **BUG-001** | Medium | Users could add items with zero or negative quantity to the cart. | Implemented quantity validation in `CartService.java`. |
| **BUG-002** | High | System allowed creating an order with an empty item list. | Added non-empty item list validation in `OrderService.java`. |
| **BUG-003** | Low | Missing error handling for non-existent products in cart updates. | Added `orElseThrow` exceptions to all cart-related lookups. |

### 4.2 Rectification Example (Code Snippet)
```java
// CartService.java - Rectified Quantity Validation
public void addToCart(Long userId, Add ToCartDto dto) {
    if (dto.getQuantity() <= 0) {
        throw new RuntimeException("Quantity must be positive");
    }
    // ... logic continues
}
```

---

## 5. System Efficiency and Scalability Enhancements
To ensure the system remains performant as the user base grows, the following enhancements were implemented:

### 5.1 Database Optimization
- **Indexing**: Added a database index on the `user_id` column in the `orders` table to optimize order history lookups, which are frequent operations.
- **Lazy Loading**: Configured `@OneToMany` relationships with `FetchType.LAZY` to prevent unnecessary data fetching during simple queries.

### 5.2 Frontend Performance
- **Image Optimization**: Implemented safe image handling with fallback placeholders to prevent layout shifts on broken URLs.
- **State Management**: Optimized component re-renders using localized state for toasts and notifications.

---

## 6. Future Testing Recommendations
While the current system is stable, the following testing procedures are recommended for future phases:
1. **Load Testing**: Use tools like JMeter to simulate 1000+ concurrent users to test bottleneck points.
2. **Security Auditing**: Perform penetration testing on JWT token handling and SQL injection prevention.
3. **Cross-Browser Testing**: Use automated suites (e.g., Selenium/Playwright) to verify UI consistency across Safari, Firefox, and Edge.

---

## 7. Conclusion
The software testing and QA phase for Assignment 4 has been successfully completed. The system now includes robust input validation, optimized database queries, and a documented history of defect rectification. The developed marketplace is reliable, efficient, and ready for further scale.

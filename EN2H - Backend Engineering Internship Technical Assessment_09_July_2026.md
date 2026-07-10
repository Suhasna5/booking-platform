# EN2H Software Engineer Intern (NestJS) - Technical Assignment

## Welcome

Thank you for applying for the **Software Engineer Intern (NestJS)** position at **EN2H**.

This assignment is designed to evaluate your backend engineering skills, coding practices, problem-solving ability, and software architecture knowledge. We are more interested in **how you think and structure your solution** than building a perfect application.

## Assignment Duration

**48-72 Hours**

Please submit your solution before the deadline provided in your email.

## Assignment Scenario

Imagine you're joining the EN2H engineering team.

Your first task is to build a **Booking Platform REST API** that allows users to manage services and customer bookings.

The project should be built using **NestJS**.

## Technical Requirements

### Framework

- NestJS
- TypeScript

### Database

Choose one:

- PostgreSQL (Preferred)
- SQLite

## Functional Requirements

### 1. Authentication

Implement JWT Authentication.

#### Required APIs

- Register
- Login

### 2. Service Management

Authenticated users should be able to:

- Create Service
- Update Service
- Delete Service
- Get All Services
- Get Service by ID

#### Service Model

```text
title
description
duration
price
isActive
```

### 3. Booking Management

Implement the following APIs:

- Create Booking
- Get All Bookings
- Get Booking by ID
- Update Booking Status
- Cancel Booking

#### Booking Model

```text
customerName
customerEmail
customerPhone
serviceId
bookingDate
bookingTime
status
notes
```

#### Booking Status

Use an enum.

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

## Business Rules

- A booking must belong to an existing service.
- Booking dates cannot be in the past.
- Cancelled bookings cannot be marked as completed.
- Only authenticated users can manage services.
- Customers can create bookings without authentication.

## Bonus Features (Optional)

You are encouraged to implement any of the following:

- Pagination
- Search bookings
- Filter by status
- Swagger documentation
- Docker support
- Validation
- Global Exception Handling
- Refresh Token
- Unit Testing
- Prevent duplicate bookings for the same service, date, and time

## Project Structure

Organize your project using NestJS best practices.

Use a clean folder structure and maintainable architecture.

## API Documentation

Provide API documentation using one of the following:

- Swagger
- Postman Collection

## Submission Requirements

Please submit the following:

- GitHub Repository (Public or Private with access granted)
- README.md
- API Documentation
- Database Migration Files
- .env.example
- Installation Instructions
- Screenshots (Optional)

### README Should Include

- Project Overview
- Installation Steps
- Environment Variables
- Database Setup
- Running the Application
- Running Migrations
- API Documentation
- Assumptions Made
- Future Improvements

## Evaluation Criteria

| Criteria | Marks |
| --- | ---: |
| Project Structure | 15 |
| NestJS Best Practices | 15 |
| Authentication | 15 |
| Database Design | 15 |
| API Design | 15 |
| Validation & Error Handling | 10 |
| Code Quality & Maintainability | 10 |
| Documentation | 5 |
| Bonus Features | 10 |
| **Total** | **100** |

## Important Notes

- Write clean, readable, and maintainable code.
- Follow REST API best practices.
- Use meaningful commit messages.
- Avoid committing the `node_modules` folder or sensitive credentials.
- You may use third-party libraries where appropriate.

## Submission

Please submit your assignment by sharing the following with us:

- GitHub Repository Link
- Live API URL (Optional)
- Postman Collection or Swagger URL
- Any additional notes you'd like us to know

## Good Luck!

We're excited to review your work. This assignment is an opportunity to demonstrate your engineering approach, problem-solving skills, and code quality. Focus on writing clean, maintainable solutions rather than trying to implement every possible feature.

If you have any questions or need further clarification, simply reply to this email; we're happy to help.

Email: [careers@entwoh.com](mailto:careers@entwoh.com)

---

Source: EN2H Technical Assessment, dated 09 July 2026.

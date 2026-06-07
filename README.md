# Connectify

Connectify is a social networking platform built to explore real-world backend engineering concepts at scale.

The project intentionally focuses on engineering challenges rather than feature complexity. It serves as a hands-on laboratory for learning distributed systems, event-driven architecture, caching strategies, real-time communication, cloud deployment, and production-grade software development practices.

---

## Objectives

This project is designed to provide practical experience with:

* Scalable backend architecture
* Authentication and authorization
* Database design and optimization
* Caching with Redis
* Event-driven systems using Kafka
* Real-time communication with WebSockets
* CI/CD pipelines
* Docker and containerization
* Infrastructure as Code with Terraform
* AWS deployment and monitoring

---

## MVP Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Refresh Tokens

### Social Features

* User Profiles
* Follow / Unfollow Users
* Create Posts
* View Feed
* Like Posts
* Comment on Posts

### Communication

* Private Chat
* Real-time Notifications

---

## Technology Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* Spring Data JPA
* Hibernate

### Database

* MySQL
* Flyway

### Caching

* Redis

### Messaging

* Kafka

### Real-Time Communication

* WebSocket

### Cloud & Infrastructure

* AWS EC2
* AWS S3
* Docker
* Docker Compose
* Terraform

### Testing

* JUnit 5
* Mockito
* Testcontainers

---

## Architecture

Current architecture follows a modular monolith approach.

```text
backend
│
├── auth
├── user
├── follow
├── post
├── comment
├── like
├── chat
├── notification
│
├── common
└── config
```

The architecture is intentionally designed to evolve toward distributed services as scaling requirements increase.

---

## Engineering Principles

* Clean Architecture
* Domain-Oriented Design
* API-First Development
* Test-Driven Thinking
* Observability and Monitoring
* Security by Default
* Infrastructure as Code

---

## Development Workflow

Every change follows:

```text
Issue
→ Branch
→ Pull Request
→ Review
→ Merge
```

All features include:

* Controller Layer
* Service Layer
* Repository Layer
* DTOs
* Validation
* Exception Handling
* Logging
* Unit Tests

---

## Learning Goals

### Spring Internals

* IoC Container
* Bean Lifecycle
* AOP
* Transactions
* Filters
* Interceptors

### Database Engineering

* Indexing
* Query Optimization
* Pagination
* N+1 Problems
* Locking Strategies

### Distributed Systems

* Caching
* Eventual Consistency
* Rate Limiting
* Idempotency
* Kafka Event Processing

### DevOps

* Docker
* CI/CD
* Terraform
* AWS
* Monitoring and Observability

---

## Project Status

Current Phase:

```text
Milestone 1 — Authentication System
```

Planned Progression:

```text
Authentication
→ Social Features
→ Real-Time Chat
→ Notifications
→ Caching
→ Event-Driven Architecture
→ Cloud Deployment
→ Monitoring
```

---

## License

This project is developed for learning, experimentation, and backend engineering practice.

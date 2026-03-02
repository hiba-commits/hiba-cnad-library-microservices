# Library Microservices System

Cloud-Native Backend Architecture  
Mid-Term Project – Cloud Native Application Development  

---

## Project Overview

This project implements a small cloud-native backend system for a Library Management System.  
The system is built using a microservices architecture and focuses on handling the loan creation process in a controlled and reliable way.

Before creating a loan, the system verifies:

- The book exists  
- The member exists  
- The book is available  

The goal of the project was not only to make the system work, but also to apply cloud-native principles such as containerization, service isolation, and controlled inter-service communication.

---

## Architecture

The system is composed of three independent microservices:

- **Book Service** – manages book data  
- **Member Service** – manages member records  
- **Loan Service** – handles loan creation and validation  

An **API Gateway (Nginx)** acts as the single entry point to the system on **port 8080**.  
All client requests go through the gateway, which routes them to the appropriate service.

The services communicate internally through a private Docker network.  
Only the API Gateway is publicly exposed.

An architecture diagram is included in this repository.

---

## Technologies Used

- Node.js / Express  
- Docker  
- Docker Compose  
- Nginx (API Gateway)  
- Firebase Hosting (API documentation)  

---

## How to Run the System

Clone the repository:  ```bash

git clone <your-repository-link>
cd hiba-cnad-library-microservices

Build and start all services:

docker-compose up --build

The system will be available at:

http://localhost:8080

All routes must be accessed through port 8080.

Main API Endpoints
Book Service

GET /books

Member Service

GET /members

Loan Service

POST /loans

Health Checks

GET /health

Example Loan Request
POST http://localhost:8080/loans

Request body:

{
  "bookId": "1",
  "memberId": "1"
}

If validation succeeds → 201 Created
If validation fails → 404 Not Found or 409 Conflict

Cloud Integration

API documentation is deployed using Firebase Hosting:

https://library-api-docs.web.app

This demonstrates integration with a cloud platform while keeping backend services containerized and isolated.

AI Usage Declaration

AI tools (ChatGPT) were used as a support resource for grammar refinement, debugging assistance, and clarification of architectural concepts.

All architectural decisions, Docker configuration, and implementation logic were developed independently and fully understood.

Author

Hiba Mihraje
Second Year DUT IADT – UM6P
Academic Year 2025–2026

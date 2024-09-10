# Sales Report System

This is a **NestJS** application designed to generate daily sales reports and integrate with **MongoDB** and **RabbitMQ**. The project is containerized with **Docker** and can be easily set up and run using **Docker Compose**.

## Features

- Generate daily sales reports.
- Integrated with MongoDB for data persistence.
- Integrated with RabbitMQ for messaging.

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Getting Started

Follow these steps to set up and run the project.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Create the .env File

A .env file is required to store environment variables. You can copy the provided .env.example file and fill in your own values for MongoDB and RabbitMQ.

```bash
cp .env.example .env
```

### Example .env File

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sales-report
MONGO_INITDB_ROOT_USERNAME=<username>
MONGODB_PW=<password>
PORT=4000
CLOUDAMQP_URL=amqps://<username>:<password>@cow.rmq2.cloudamqp.com/<vhost>
```

Replace the placeholders (`<username>`, `<password>`, `<vhost>`) with your actual credentials for MongoDB and RabbitMQ.

### 3. Build and Run with Docker Compose

Once the .env file is configured, build and run the application using Docker Compose.

```bash
docker-compose up --build
```

Docker Compose will:

- Build the Docker images for the application.
- Set up and run the MongoDB and RabbitMQ services.
- Run the NestJS application, exposing it on the port defined in the .env file (default is 4000).

### 4. Access the Application

Once everything is up and running, you can access the following services:

- NestJS Application: [http://localhost:4000](http://localhost:4000)
- MongoDB: Running at `mongodb://localhost:27017`
- RabbitMQ Management UI: [http://localhost:15672](http://localhost:15672) (use `guest/guest` to log in)

### 5. Stop the Application

To stop and remove the running containers, execute the following command:

```bash
docker-compose down
```

This will stop the running containers, but any data stored in MongoDB will persist thanks to Docker volumes.

## Running Without Docker

If you prefer to run the project without Docker (e.g., for local development), follow these steps:

### 1. Install Dependencies

Ensure you have Node.js installed, then run:

```bash
npm install
```

### 2. Set Up MongoDB and RabbitMQ

You will need to set up MongoDB and RabbitMQ on your machine or use hosted services (e.g., MongoDB Atlas and CloudAMQP).
Ensure the .env file is configured with the appropriate connection strings.

### 3. Run the Application

Once everything is set up, run the application in development mode:

```bash
npm run start:dev
```

The application will be accessible at [http://localhost:4000](http://localhost:4000) by default, but you can change the port in the .env file.

---

## Environment Variables

The following environment variables are required to run the application:

| Variable                   | Description                                     |
| -------------------------- | ----------------------------------------------- |
| MONGODB_URI                | MongoDB connection string                       |
| MONGO_INITDB_ROOT_USERNAME | MongoDB root username                           |
| MONGODB_PW                 | MongoDB root password                           |
| PORT                       | Port for the NestJS application (default: 4000) |
| CLOUDAMQP_URL              | RabbitMQ connection string                      |

---

## Troubleshooting

If the application fails to start, check the Docker logs using `docker-compose logs` to diagnose the issue.
Ensure that your .env file is correctly set up with the appropriate MongoDB and RabbitMQ credentials.

## License

This project is licensed under the MIT License.

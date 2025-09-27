# MERN Docker Application

This project is a MERN stack application that utilizes Docker for containerization. It consists of a server built with Node.js and Express, and a client built with React. The application is designed to be easily deployed and managed using Docker and Docker Compose.


### Setup



1. Clone the repository:
   ```
   git clone <repository-url>
   cd mern-docker-app
   ```


2. Copy the environment variable templates:
   ```
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   cp .env.example .env
   ```

3. Fill in the `.env` files with the necessary environment variables.

### Running the Application

To build and run the application, use Docker Compose:

```
docker-compose up --build
```

This command will build the Docker images for both the server and client, and start the containers.

### Accessing the Application

- The server will be available at `http://localhost:5000`
- The client will be available at `http://localhost:3000`
- The database 

### Stopping the Application

Can either use Ctrl C in the terminal or use docker compose down in a sepaerate one
using docker compose down has worked best for me when using ctrl c the terminal hangs

```
docker compose down
```


### Request flow (client -> server -> DB)

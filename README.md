
# BlinkTalk : Realtime Chat Application

This is a realtime chat application built using both a frontend and backend. The application allows users to send and receive messages in real-time over WebSocket. The project includes two main components: the chat client (frontend) and chat server (backend).
## Features


- **Real-time messaging**: Send and receive messages instantly.
- **User-friendly interface**: Simple, intuitive UI for chatting.
- **WebSocket connection**: Uses WebSockets for real-time communication.
## Tech Stack

### Frontend
- **React**: The chat client is built using React.js for an interactive and dynamic user interface.
- **HTML/CSS**: For styling and layout.
- **JavaScript**: For frontend logic.

### Backend
- **Spring Boot**: The chat server is built with Spring Boot, providing the backend RESTful services and WebSocket handling.
- **Java**: For backend programming and WebSocket handling.


### Communication
- **WebSocket**: For real-time, full-duplex communication between the client and server.

## Installation 

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (for frontend)
- [Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) (for backend)
- [Maven](https://maven.apache.org/) (for building the backend)
- [Spring Boot](https://spring.io/projects/spring-boot)

### Setting up Frontend
1. Navigate to the `chatclient` directory:
   ```bash
   cd chatclient

2. Install the required npm dependencies:
    ```bash
    npm install
3. Start the development server:
    ```bash
    npm start
The frontend should now be running at http://localhost:3000.

### Setting up Backend
1. Navigate to the chatserver directory:
    ```bash
    cd chatserver
2. Build the Spring Boot application using Maven:
    ```bash
    mvn clean install
3. Run the backend application:
    ```bash
    mvn spring-boot:run

The backend server should now be running at http://localhost:8080.



## Usage

* Open the frontend application in your browser (http://localhost:3000).
* The chat interface will allow you to send and receive messages in real-time once the WebSocket connection to the backend is established.
## Image/Screenshot

![image -chat](https://github.com/user-attachments/assets/f526db3e-2cfa-4e24-b604-242b37d02492)
## Contributing

1. Fork the repository.
2. Create a new branch ```  git checkout -b feature/your-feature.```

3. Make changes and commit them ``` git commit -am 'Add new feature'```
4. Push to the branch ```git push origin feature/your-feature```
5. Create a new Pull Request.

## Contact

For any queries or feedback, please reach out:

* Amit Kumar

* LinkedIn: https://www.linkedin.com/in/kumaramit02/

* Email: amitk1602info@gmail.com

⭐ **If you like this project, give it a star!** ⭐

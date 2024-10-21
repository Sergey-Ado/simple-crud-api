# Simple CRUD API - Instructions

### Installation

To install the application, complete the following commands in order

```
git clone https://github.com/Sergey-Ado/simple-crud-api.git
```

```
cd simple-crud-api
```

```
git checkout dev
```

```
npm install
```

### Launch

Based on the `.env.example` file, create a `.env` file and change the PORT if necessary (by default the application runs on port 3000)

##### To run the application use the following commands:

Application without a cluster in development mode

```
npm run start:dev
```

Application without a cluster in production mode

```
npm run start:prod
```

Application with a cluster in development mode

```
npm run start:multi:dev
```

Application with a cluster in production mode

```
npm run start:multi
```

##### Once the server, database and all workers have loaded (corresponding messages will be displayed in the console), you can send requests to the server

##### Tests are launched via a separate terminal with the command

```
npm run test
```

### Usage

1. The client communicates with the server via the port specified in `.env` file
2. The client can be Postman or other similar applications
3. The server processes GET, POST, PUT and DELETE requests
4. The application allows repeated slashes in the endpoint and treats them as single
5. The data in POST and PUT requests to the server must be sent in JSON format. Data must contain the required fields username (string), age (number) and hobbies (array of strings or empty array). The data must not contain any other fields
6. Data from the server response is returned in JSON format
7. Terminate the process via `ctrl+C`

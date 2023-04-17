# Alumni-managemnet-app-server

This is a Node.js and MongoDB backend application that provides API endpoints for retrieving data from MongoDB.

The application is built using the Express.js framework and uses the cors and dotenv packages for middleware configuration.

The MongoDB driver is used for connecting and querying the database, and it is imported in the code using destructuring assignment.

The application listens on the port specified in the process environment variables or port 8000 by default.

After importing the necessary packages, the middleware configuration is done using app.use(). The cors() middleware allows cross-origin requests, while express.json() middleware parses incoming JSON payloads.

The connection string for MongoDB is stored in the uri variable, which is constructed using environment variables defined in the .env file.

The run() function is an asynchronous function that connects to the database and defines MongoDB collections for each data type.

The application defines several API endpoints, which are described below:

## the site is hosted in https://alumni-managemnet-app-server.vercel.app/

* /galleryCategories GET endpoint that returns all gallery categories data
* /galleryCategories/:id GET endpoint that returns a single gallery category data based on the id parameter
* /galleries GET endpoint that returns all gallery data
* /galleries/batch/:batchNumber GET endpoint that returns gallery data based on batch number
* /galleries/featured GET endpoint that returns gallery data based on featured photos
* /galleries/trending GET endpoint that returns gallery data based on trending photos
* /galleries/:id GET endpoint that returns gallery data based on category ID
* /events GET endpoint that returns all event data
* /eventCategories GET endpoint that returns all event categories data
* /events/category/:id GET endpoint that returns event data based on category ID
* /events/:id GET endpoint that returns a single event data based on the id parameter
* /allUniversityName GET endpoint that returns all university name data
* /allBatchesName GET endpoint that returns all batches name data
* /alumni GET endpoint that returns all alumni data
  Each API endpoint uses the appropriate MongoDB collection to retrieve data based on the endpoint's requirements. The retrieved data is then sent to the client in the response body.

The code is organized using asynchronous functions, which allows the application to handle multiple requests concurrently. The try...catch block is used to catch and handle any errors that occur during the execution of the application.

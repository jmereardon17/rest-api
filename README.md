# FSJS Techdegree Project 9

For this project I had to create a REST API using Express. This API provides a way to administer a school database containing information about users and courses. Users can interact with the database to create new courses, retrieve information on existing courses, and update or delete existing courses. To make changes to the database, users will be required to log in so the API will also allow users to create a new account or retrieve information on an existing account.

To complete this project, I had to use my knowledge of Node.js, Express, REST APIS, and Sequelize.

To further develop the project to recieve an Exceeds Expectations grading, I had to:

- Ensure User Email Address is Valid and Unique
- Update the User Routes - Filter out the `password`, `createdAt`, and `updatedAt` properties from the response. Update the `POST` route so that if a unique constraint error (`SequelizeUniqueConstraintError`) is thrown, a `400` HTTP status code and an error message is returned
- Update the Course Routes - Filter out the `createdAt` and `updatedAt` properties from the response. Update the `PUT` and `DELETE` routes to ensure that the currently authenticated user is the owner of the requested course. If the currently authenticated user is not the owner of the requested course, a `403` HTTP status code should be returned.

Grade: Exceeds Expectations

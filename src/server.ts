import * as express from 'express';
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as compression from "compression";

const app = express();
// Log all requests
app.use(logger("dev"));
// compress responses 
app.use(compression())
app.get('/', (req, res) => res.send('Hello from Express'));

// Disable in prodcution
app.use(errorHandler());

const server = app.listen(8000, "localhost", () => {
   const {address, port} = server.address();
   console.log('Listening on http://localhost:' + port);
});

module.exports = app;
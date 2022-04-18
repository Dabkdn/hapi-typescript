import * as hapi from "@hapi/hapi";
import Router from "./router";
import * as dotenv from "dotenv";
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";
import mongoose from "mongoose";

dotenv.config();
const swaggerOptions = {
  info: {
    title: "Test API Documentation",
    version: "1.0.0",
  },
  grouping: "tags",
  sortEndpoints: "ordered",
  security: [{ API_KEY: [] }],
  securityDefinitions: {
    API_KEY: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      "x-keyPrefix": "Bearer",
    },
  },
};

const plugins: Array<hapi.ServerRegisterPluginObject<any>> = [
  {
    plugin: Inert,
  },
  {
    plugin: Vision,
  },
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
];
// Create a server to listen for `8000'goods on `localhost'.
const server: hapi.Server = new hapi.Server({
  host: process.env.HOST,
  port: process.env.PORT,
});

// // Adding routing
// server.route({
//   method: "GET",
//   path: "/hello",
//   handler: function (request: any, h: any) {
//     return "Hello! TypeScript!";
//   },
// });

// Start up service
export const databaseConnection = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
export const connectDatabase = async () => {
  console.log(databaseConnection);
  await mongoose.connect(databaseConnection);
};
async function start() {
  try {
    await connectDatabase();
    await server.validator(require("@hapi/joi"));
    await server.register(plugins);
    await Router.loadRoutes(server);
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
}

// Don't forget to start the service
start();

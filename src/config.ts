export const databaseConfig = {
  client: "mysql",
  connection: {
    host: process.env.DATABASE_HOSTNAME,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
  },
  migrations: {
    tableName: "migrations",
  },
};

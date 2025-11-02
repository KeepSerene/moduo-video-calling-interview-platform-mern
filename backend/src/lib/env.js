const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ?? 3000,
  DB_URL: process.env.DB_URL ?? "",
};

export default ENV;

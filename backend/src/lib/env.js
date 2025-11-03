const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ?? 3000,
  DB_URL: process.env.DB_URL ?? "",
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ?? "",
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY ?? "",
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY ?? "",
  STREAM_ACCESS_KEY: process.env.STREAM_ACCESS_KEY ?? "",
  STREAM_ACCESS_SECRET: process.env.STREAM_ACCESS_SECRET ?? "",
};

export default ENV;

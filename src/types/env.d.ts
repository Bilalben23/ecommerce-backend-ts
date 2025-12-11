declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        PORT: string;
        NODE_ENV: "development" | "production",
        JWT_ACCESS_SECRET: string,
        JWT_REFRESH_SECRET: string
    }
}
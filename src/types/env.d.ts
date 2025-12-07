declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        PORT: string;
        NODE_ENV: "development" | "production"
    }
}
declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: "production" | "development" | "testing";

        PORT: number;

        DB_HOST: string;
        DB_USER: string;
        DB_PASS: string;
        DB_NAME: string;
    }
}
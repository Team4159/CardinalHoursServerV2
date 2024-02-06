declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: "production" | "development" | "testing";

        PORT: number;

        DB_HOST: string;
        DB_USER: string;
        DB_PASS: string;
        DB_NAME: string;

        TEST_DB_HOST: string;
        TEST_DB_USER: string;
        TEST_DB_PASS: string;
        TEST_DB_NAME: string;
    }
}
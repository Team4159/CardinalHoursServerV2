declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: "production" | "development" | "testing";

        PORT: number;
        
        DEFAULT_EXP_BACKOFF_MAX_ATTEMPTS: number;

        HOURS_SPREADSHEET_ID: string;

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
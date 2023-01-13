export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbPort: +process.env.DB_PORT,
})
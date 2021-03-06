"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEQUELIZE_POSTGRES_CONFIG = exports.GOOGLE_CALLBACK_URL = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.FACEBOOK_CALLBACK_URL = exports.FACEBOOK_CLIENT_SECRET = exports.FACEBOOK_CLIENT_ID = exports.GITHUB_CALLBACK_URL = exports.GITHUB_CLIENT_SECRET = exports.GITHUB_CLIENT_ID = exports.ELASTIC_SEARCH_PASSWORD = exports.ELASTIC_SEARCH_USERNAME = exports.ELASTIC_SEARCH_HOST = exports.REFRESH_TOKEN_SALT_SECRET_2 = exports.REFRESH_TOKEN_SALT_SECRET_1 = exports.REFRESH_TOKEN_SALT_ROUNDS = exports.PASSWORD_SALT_SECRET_2 = exports.PASSWORD_SALT_SECRET_1 = exports.PASSWORD_SALT_ROUNDS = exports.JWT_REFRESH_EXPIRATION_TIME = exports.JWT_SECRET_REFRESH = exports.JWT_ACCESS_EXPIRATION_TIME = exports.JWT_SECRET_ACCESS = void 0;
exports.JWT_SECRET_ACCESS = 'JWT_SECRET_ACCESS';
exports.JWT_ACCESS_EXPIRATION_TIME = 60 * 1000;
exports.JWT_SECRET_REFRESH = 'JWT_SECRET_REFRESH';
exports.JWT_REFRESH_EXPIRATION_TIME = 24 * 60 * 60 * 1000;
exports.PASSWORD_SALT_ROUNDS = 10;
exports.PASSWORD_SALT_SECRET_1 = 'pass';
exports.PASSWORD_SALT_SECRET_2 = 'word';
exports.REFRESH_TOKEN_SALT_ROUNDS = 10;
exports.REFRESH_TOKEN_SALT_SECRET_1 = 'I7S56';
exports.REFRESH_TOKEN_SALT_SECRET_2 = 'NJ893';
exports.ELASTIC_SEARCH_HOST = process.env.ELASTIC_SEARCH_HOST || 'http://localhost:9200';
exports.ELASTIC_SEARCH_USERNAME = process.env.ELASTIC_SEARCH_USERNAME || 'elastic';
exports.ELASTIC_SEARCH_PASSWORD = process.env.ELASTIC_SEARCH_PASSWORD || 'changeme';
exports.GITHUB_CLIENT_ID = 'fa3f7124fe705f856d73';
exports.GITHUB_CLIENT_SECRET = '8f327ca7f4193b02906d881a35400cba232a8dc1';
exports.GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3039/auth/api/github/callback';
exports.FACEBOOK_CLIENT_ID = '415983733528264';
exports.FACEBOOK_CLIENT_SECRET = '09ebbd8117b6c476ecda0a88f6a8515b';
exports.FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3039/auth/api/facebook/callback';
exports.GOOGLE_CLIENT_ID = '341813737788-6b4k473h2nf4tkd2e32kk33ti2ojv4hu.apps.googleusercontent.com';
exports.GOOGLE_CLIENT_SECRET = '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';
exports.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3039/auth/api/google/callback';
let postgres_Config;
if (process.env.DATABASE_URL) {
    let match = (process.env.DATABASE_URL || '').match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    match = match || [];
    let dbname = match[5];
    let username = match[1];
    let password = match[2];
    let host = match[3];
    let port = match[4];
    postgres_Config = {
        host: host,
        port: port,
        username: username,
        password: password,
        database: dbname,
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        autoLoadModels: true
    };
}
else {
    postgres_Config = {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'course',
        autoLoadModels: true
    };
}
exports.SEQUELIZE_POSTGRES_CONFIG = postgres_Config;
//# sourceMappingURL=config.js.map
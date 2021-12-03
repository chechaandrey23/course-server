"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEQUELIZE_POSTGRES_CONFIG = exports.SEQUELIZE_POSTGRES_DATABASE_URL = exports.GITHUB_CALLBACK_URL = exports.GITHUB_CLIENT_SECRET = exports.GITHUB_CLIENT_ID = exports.REFRESH_TOKEN_SALT_SECRET_2 = exports.REFRESH_TOKEN_SALT_SECRET_1 = exports.REFRESH_TOKEN_SALT_ROUNDS = exports.PASSWORD_SALT_SECRET_2 = exports.PASSWORD_SALT_SECRET_1 = exports.PASSWORD_SALT_ROUNDS = exports.JWT_REFRESH_EXPIRATION_TIME = exports.JWT_SECRET_REFRESH = exports.JWT_ACCESS_EXPIRATION_TIME = exports.JWT_SECRET_ACCESS = void 0;
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
exports.GITHUB_CLIENT_ID = 'fa3f7124fe705f856d73';
exports.GITHUB_CLIENT_SECRET = '8f327ca7f4193b02906d881a35400cba232a8dc1';
exports.GITHUB_CALLBACK_URL = 'http://localhost:3039/auth/api/github/callback';
exports.SEQUELIZE_POSTGRES_DATABASE_URL = process.env.DATABASE_URL;
let match = (process.env.DATABASE_URL || '').match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
match = match || [];
let dbname = match[5];
let username = match[1];
let password = match[2];
let host = match[3];
let port = match[4];
exports.SEQUELIZE_POSTGRES_CONFIG = {
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
//# sourceMappingURL=config.js.map
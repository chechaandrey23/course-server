export const JWT_SECRET_ACCESS = 'JWT_SECRET_ACCESS';
export const JWT_ACCESS_EXPIRATION_TIME = 60*1000;
export const JWT_SECRET_REFRESH = 'JWT_SECRET_REFRESH';
export const JWT_REFRESH_EXPIRATION_TIME = 24*60*60*1000;

export const PASSWORD_SALT_ROUNDS = 10;
export const PASSWORD_SALT_SECRET_1 = 'pass';
export const PASSWORD_SALT_SECRET_2 = 'word';

export const REFRESH_TOKEN_SALT_ROUNDS = 10;
export const REFRESH_TOKEN_SALT_SECRET_1 = 'I7S56';
export const REFRESH_TOKEN_SALT_SECRET_2 = 'NJ893';

export const GITHUB_CLIENT_ID = 'fa3f7124fe705f856d73';
export const GITHUB_CLIENT_SECRET = '8f327ca7f4193b02906d881a35400cba232a8dc1';
export const GITHUB_CALLBACK_URL = 'http://localhost:3039/auth/api/github/callback';

/*
//SequelizeModuleOptions
export const SEQUELIZE_POSTGRES_DATABASE_URL = process.env.DATABASE_URL;

let match = (process.env.DATABASE_URL || '').match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
match = match || [];
let dbname = match[5];
let username = match[1];
let password = match[2];
let host = match[3];
let port = match[4];

export const SEQUELIZE_POSTGRES_CONFIG: any = {
	host: host,
	port: port,
	username: username,
	password: password,
	database: dbname,

	dialect: 'postgres',
	protocol: 'postgres',
	dialectOptions: {
		//ssl: true
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	},
	autoLoadModels: true
};
*/
export const SEQUELIZE_POSTGRES_CONFIG: any = {
	dialect: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'password',
	database: 'course',
	autoLoadModels: true
};

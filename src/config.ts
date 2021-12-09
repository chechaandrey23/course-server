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

export const ELASTIC_SEARCH_HOST = process.env.ELASTIC_SEARCH_HOST || 'http://localhost:9200';// 'https://test-search-course.es.us-central1.gcp.cloud.es.io:9243';// 
export const ELASTIC_SEARCH_USERNAME = process.env.ELASTIC_SEARCH_USERNAME || 'elastic';
export const ELASTIC_SEARCH_PASSWORD = process.env.ELASTIC_SEARCH_PASSWORD || 'changeme';// '06erfmbEckCP8IoPPKUmkp1J';

export const GITHUB_CLIENT_ID = 'fa3f7124fe705f856d73';
export const GITHUB_CLIENT_SECRET = '8f327ca7f4193b02906d881a35400cba232a8dc1';
export const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3039/auth/api/github/callback';

export const FACEBOOK_CLIENT_ID = '415983733528264';
export const FACEBOOK_CLIENT_SECRET = '09ebbd8117b6c476ecda0a88f6a8515b';
export const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3039/auth/api/facebook/callback';

export const GOOGLE_CLIENT_ID = '341813737788-6b4k473h2nf4tkd2e32kk33ti2ojv4hu.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = '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';
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3039/auth/api/google/callback';



let postgres_Config: any;
if(process.env.DATABASE_URL) {
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
			//ssl: true
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		},
		autoLoadModels: true
	};
} else {
	postgres_Config ={
		dialect: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'password',
		database: 'course',
		autoLoadModels: true
	};
}

export const SEQUELIZE_POSTGRES_CONFIG: any = postgres_Config;

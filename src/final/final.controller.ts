import {Body, Controller, Get, Post, Param, Query, StreamableFile} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class FinalController {
	constructor() {}
	
	@Get('/admin*')
	public async finalAdmin() {
		return fs.readFileSync(path.resolve()+'/../admin/dist/admin/index.html', 'utf8');
	}
	
	@Get('/*')
	public async finalClient() {
		return fs.readFileSync(path.resolve()+'/../client/build/index.html', 'utf8')
	}
}

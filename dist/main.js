"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.use('/admin', express.static(path.resolve() + '/../admin/dist/admin'));
    httpAdapter.use('/', express.static(path.resolve() + '/../client/build'));
    httpAdapter.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT || 3039);
}
bootstrap();
//# sourceMappingURL=main.js.map
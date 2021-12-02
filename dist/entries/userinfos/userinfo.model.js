"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("../users/user.model");
const theme_model_1 = require("../themes/theme.model");
const lang_model_1 = require("../langs/lang.model");
let UserInfo = class UserInfo extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], UserInfo.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], UserInfo.prototype, "first_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], UserInfo.prototype, "last_name", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => theme_model_1.Theme),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], UserInfo.prototype, "themeId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => theme_model_1.Theme),
    __metadata("design:type", theme_model_1.Theme)
], UserInfo.prototype, "theme", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => lang_model_1.Lang),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], UserInfo.prototype, "langId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => lang_model_1.Lang),
    __metadata("design:type", lang_model_1.Lang)
], UserInfo.prototype, "lang", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], UserInfo.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], UserInfo.prototype, "user", void 0);
UserInfo = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'userinfos', timestamps: true, paranoid: true, deletedAt: true })
], UserInfo);
exports.UserInfo = UserInfo;
//# sourceMappingURL=userinfo.model.js.map
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
exports.TitleGroups = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const title_model_1 = require("./title.model");
const group_model_1 = require("../groups/group.model");
let TitleGroups = class TitleGroups extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], TitleGroups.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => group_model_1.Group),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], TitleGroups.prototype, "groupId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => title_model_1.Title),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], TitleGroups.prototype, "titleId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => title_model_1.Title),
    __metadata("design:type", title_model_1.Title)
], TitleGroups.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => group_model_1.Group),
    __metadata("design:type", group_model_1.Group)
], TitleGroups.prototype, "group", void 0);
TitleGroups = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'title_groups', createdAt: false, updatedAt: false })
], TitleGroups);
exports.TitleGroups = TitleGroups;
//# sourceMappingURL=title.groups.model.js.map
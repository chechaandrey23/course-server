"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitlesModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const groups_module_1 = require("../groups/groups.module");
const titles_service_1 = require("./titles.service");
const title_model_1 = require("./title.model");
const title_groups_model_1 = require("./title.groups.model");
const group_model_1 = require("../groups/group.model");
let TitlesModule = class TitlesModule {
};
TitlesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([title_model_1.Title, title_groups_model_1.TitleGroups, group_model_1.Group]),
            groups_module_1.GroupsModule
        ],
        controllers: [],
        providers: [
            titles_service_1.TitlesService
        ],
        exports: [
            titles_service_1.TitlesService,
            groups_module_1.GroupsModule
        ]
    })
], TitlesModule);
exports.TitlesModule = TitlesModule;
//# sourceMappingURL=titles.module.js.map
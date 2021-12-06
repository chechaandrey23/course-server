"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const users_module_1 = require("../entries/users/users.module");
const roles_module_1 = require("../entries/roles/roles.module");
const groups_module_1 = require("../entries/groups/groups.module");
const titles_module_1 = require("../entries/titles/titles.module");
const langs_module_1 = require("../entries/langs/langs.module");
const themes_module_1 = require("../entries/themes/themes.module");
const userinfos_module_1 = require("../entries/userinfos/userinfos.module");
const images_module_1 = require("../entries/images/images.module");
const tags_module_1 = require("../entries/tags/tags.module");
const reviews_module_1 = require("../entries/reviews/reviews.module");
const ratings_module_1 = require("../entries/ratings/ratings.module");
const likes_module_1 = require("../entries/likes/likes.module");
const comments_module_1 = require("../entries/comments/comments.module");
const refresh_token_module_1 = require("../entries/refreshtoken/refresh.token.module");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            refresh_token_module_1.RefreshTokenModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            reviews_module_1.ReviewsModule,
            groups_module_1.GroupsModule,
            titles_module_1.TitlesModule,
            langs_module_1.LangsModule,
            themes_module_1.ThemesModule,
            userinfos_module_1.UserInfosModule,
            images_module_1.ImagesModule,
            tags_module_1.TagsModule,
            ratings_module_1.RatingsModule,
            likes_module_1.LikesModule,
            comments_module_1.CommentsModule
        ],
        controllers: [
            admin_controller_1.AdminController
        ],
        providers: []
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map
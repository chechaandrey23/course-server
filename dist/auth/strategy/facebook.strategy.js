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
exports.FaceBookStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_facebook_1 = require("passport-facebook");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../entries/users/users.service");
const config_1 = require("../../config");
let FaceBookStrategy = class FaceBookStrategy extends (0, passport_1.PassportStrategy)(passport_facebook_1.Strategy, 'facebook') {
    constructor(usersService) {
        super({
            clientID: config_1.FACEBOOK_CLIENT_ID,
            clientSecret: config_1.FACEBOOK_CLIENT_SECRET,
            callbackURL: config_1.FACEBOOK_CALLBACK_URL,
        });
        this.usersService = usersService;
    }
    async validate(accessToken, refreshToken, profile) {
        let user = await this.usersService.createSocialUser(profile.id, profile.provider, true, profile.displayName);
        user = user.toJSON();
        return { id: user.id, roles: user.roles.map((entry) => { return entry.role; }) };
    }
};
FaceBookStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], FaceBookStrategy);
exports.FaceBookStrategy = FaceBookStrategy;
//# sourceMappingURL=facebook.strategy.js.map
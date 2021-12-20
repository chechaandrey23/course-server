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
exports.UserEditDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const id_dto_1 = require("./id.dto");
class UserEditDTO extends id_dto_1.IdDTO {
}
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => { return !value ? '' : value; }),
    (0, class_validator_1.ValidateIf)(({ user }) => user !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UserEditDTO.prototype, "user", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => { return !value ? '' : value; }),
    (0, class_validator_1.ValidateIf)(({ social_id }) => social_id !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UserEditDTO.prototype, "social_id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => { return !value ? '' : value; }),
    (0, class_validator_1.ValidateIf)(({ email }) => email !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserEditDTO.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => { return !!value; }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserEditDTO.prototype, "blocked", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => { return !!value; }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserEditDTO.prototype, "activated", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => { return value.map((val) => { return val * 1; }); }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    (0, class_validator_1.Max)(Math.pow(2, 32) - 1, { each: true }),
    __metadata("design:type", Array)
], UserEditDTO.prototype, "roles", void 0);
exports.UserEditDTO = UserEditDTO;
//# sourceMappingURL=user.edit.dto.js.map
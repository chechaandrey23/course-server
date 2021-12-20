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
exports.ReviewsFilterDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const page_dto_1 = require("./page.dto");
class ReviewsFilterDTO extends page_dto_1.PageDTO {
}
__decorate([
    (0, class_validator_1.ValidateIf)(({ tags }) => !!tags),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => { return value.map((val) => { return val * 1; }); }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    (0, class_validator_1.Max)(Math.pow(2, 32) - 1, { each: true }),
    __metadata("design:type", Array)
], ReviewsFilterDTO.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(({ titles }) => !!titles),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => { return value.map((val) => { return val * 1; }); }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    (0, class_validator_1.Max)(Math.pow(2, 32) - 1, { each: true }),
    __metadata("design:type", Array)
], ReviewsFilterDTO.prototype, "titles", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(({ groups }) => !!groups),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => { return value.map((val) => { return val * 1; }); }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    (0, class_validator_1.Max)(Math.pow(2, 32) - 1, { each: true }),
    __metadata("design:type", Array)
], ReviewsFilterDTO.prototype, "groups", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(({ sortField }) => !!sortField),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ReviewsFilterDTO.prototype, "sortField", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(({ sortType }) => !!sortType),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["ASC", "DESC"]),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ReviewsFilterDTO.prototype, "sortType", void 0);
exports.ReviewsFilterDTO = ReviewsFilterDTO;
//# sourceMappingURL=reviews.filter.dto.js.map
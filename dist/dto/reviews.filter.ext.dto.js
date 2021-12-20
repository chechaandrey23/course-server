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
exports.ReviewsFilterExtDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const reviews_filter_dto_1 = require("./reviews.filter.dto");
class ReviewsFilterExtDTO extends reviews_filter_dto_1.ReviewsFilterDTO {
}
__decorate([
    (0, class_validator_1.ValidateIf)(({ authors }) => !!authors),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => { return value.map((val) => { return val * 1; }); }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(1, { each: true }),
    (0, class_validator_1.Max)(Math.pow(2, 32) - 1, { each: true }),
    __metadata("design:type", Array)
], ReviewsFilterExtDTO.prototype, "authors", void 0);
exports.ReviewsFilterExtDTO = ReviewsFilterExtDTO;
//# sourceMappingURL=reviews.filter.ext.dto.js.map
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
exports.CommentAddWithoutDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const reviewid_dto_1 = require("./reviewid.dto");
class CommentAddWithoutDTO extends reviewid_dto_1.ReviewIdDTO {
    constructor() {
        super(...arguments);
        this.draft = false;
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(3000),
    __metadata("design:type", String)
], CommentAddWithoutDTO.prototype, "comment", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => { return !!value; }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CommentAddWithoutDTO.prototype, "draft", void 0);
exports.CommentAddWithoutDTO = CommentAddWithoutDTO;
//# sourceMappingURL=comment.add.without.dto.js.map
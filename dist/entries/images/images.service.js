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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const handler_error_1 = require("../../helpers/handler.error");
const image_model_1 = require("./image.model");
const user_model_1 = require("../users/user.model");
const storage_1 = require("@google-cloud/storage");
const path = require("path");
const uuid_1 = require("uuid");
let ImagesService = class ImagesService {
    constructor(sequelize, images, users) {
        this.sequelize = sequelize;
        this.images = images;
        this.users = users;
        this.storageGoogleCloud = new storage_1.Storage({
            keyFilename: path.resolve() + '/test-backet-4642555c8a69.json',
            projectId: 'test-backet'
        });
        this.storageGoogleBucket = this.storageGoogleCloud.bucket('course-share-file');
    }
    async createImage(userId, images) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res0 = await this.users.findOne({ where: { id: userId }, transaction: t });
                if (!res0)
                    throw new common_1.ConflictException({ userId, reason: `User (userId: ${userId}) does not exist` });
                let newData = [];
                for (const image of images) {
                    const fileName = `${(0, uuid_1.v4)()}.${image.originalname.split('.').at(-1)}`;
                    const linkFilename = await this.upLoad(fileName, image.buffer);
                    newData.push({ userId, url: linkFilename, filename: fileName, vendor: 'google.bucket' });
                }
                let res1 = await this.images.bulkCreate(newData, { transaction: t });
                let ids = res1.map((entry) => { return entry.getDataValue('id'); });
                return await this.images.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'] }], where: { id: ids }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    async editImage(id, userId) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                await this.images.update({ userId }, { where: { id }, transaction: t });
                return await this.images.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'] }], where: { id: id }, transaction: t });
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e);
        }
    }
    upLoad(filename, buffer) {
        return new Promise((res, rej) => {
            const blob = this.storageGoogleBucket.file(filename);
            const blobStream = blob.createWriteStream({
                resumable: false,
                gzip: true
            });
            blobStream.on('error', err => {
                rej(err);
            });
            blobStream.on('finish', () => {
                res(`https://storage.googleapis.com/${this.storageGoogleBucket.name}/${blob.name}`);
            });
            blobStream.end(buffer);
        });
    }
    async removeImage(id) {
        try {
            await this.images.destroy({ where: { id } });
            return { id: id, deletedAt: (new Date()).toString() };
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async deleteImage(id) {
        try {
            return await this.sequelize.transaction({}, async (t) => {
                let res = await this.images.findOne({ where: { id }, paranoid: false, transaction: t });
                if (!res)
                    throw new common_1.ConflictException({ id, reason: `Image record id="${id}" NOT FOUND` });
                await this.storageGoogleBucket.file(res.getDataValue('filename')).delete();
                await this.images.destroy({ where: { id }, transaction: t, force: true });
                return { id: id };
            });
        }
        catch (e) {
            (0, handler_error_1.handlerError)(e, { id });
        }
    }
    async getImageAll(count, offset = 0, withDeleted = false) {
        return await this.images.findAll({ include: [{ model: user_model_1.User, attributes: ['id', 'user', 'social_id'], paranoid: !withDeleted },
            ], offset: offset, limit: count, paranoid: !withDeleted });
    }
};
ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(image_model_1.Image)),
    __param(2, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object, Object])
], ImagesService);
exports.ImagesService = ImagesService;
//# sourceMappingURL=images.service.js.map
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
exports.ReviewSearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@nestjs/elasticsearch");
let ReviewSearchService = class ReviewSearchService {
    constructor(elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
        this.index = 'reviews';
    }
    async indexReview(review) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return await this.elasticsearchService.index({
            index: this.index,
            body: {
                id: review.id,
                description: review.description || '',
                text: review.text || '',
                group: ((_b = (_a = review.groupTitle) === null || _a === void 0 ? void 0 : _a.group) === null || _b === void 0 ? void 0 : _b.group) || '',
                title: ((_d = (_c = review.groupTitle) === null || _c === void 0 ? void 0 : _c.title) === null || _d === void 0 ? void 0 : _d.title) || '',
                titleDescription: ((_f = (_e = review.groupTitle) === null || _e === void 0 ? void 0 : _e.title) === null || _f === void 0 ? void 0 : _f.description) || '',
                tags: (review.tags || []).map((entry) => entry.tag),
                authorFullName: (((_h = (_g = review.user) === null || _g === void 0 ? void 0 : _g.userInfo) === null || _h === void 0 ? void 0 : _h.first_name) || '') + ' ' + (((_k = (_j = review.user) === null || _j === void 0 ? void 0 : _j.userInfo) === null || _k === void 0 ? void 0 : _k.last_name) || ''),
                comments: (review.comments || []).map((entry) => entry.comment)
            }
        });
    }
    async searchReviews(text) {
        const { body } = await this.elasticsearchService.search({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fields: [
                            'description', 'text', 'group', 'title', 'titleDescription', 'authorFullName', 'tags', 'comments.comment'
                        ]
                    }
                }
            }
        });
        const hits = body.hits.hits;
        return hits.reduce((acc, entry) => {
            acc.ids.push(entry._source.id);
            acc.searchIds.push(entry._id);
            return acc;
        }, { ids: [], searchIds: [] });
    }
    async deleteReview(reviewId) {
        return await this.elasticsearchService.deleteByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: reviewId,
                    }
                }
            }
        });
    }
    async deleteReviewWithId(id) {
        return await this.elasticsearchService.deleteByQuery({
            index: this.index,
            body: {
                query: {
                    terms: {
                        _id: [id],
                    }
                }
            }
        });
    }
    getScriptUpdate(review) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const newBody = {
            id: review.id,
            description: review.description || '',
            text: review.text || '',
            group: ((_b = (_a = review.groupTitle) === null || _a === void 0 ? void 0 : _a.group) === null || _b === void 0 ? void 0 : _b.group) || '',
            title: ((_d = (_c = review.groupTitle) === null || _c === void 0 ? void 0 : _c.title) === null || _d === void 0 ? void 0 : _d.title) || '',
            titleDescription: ((_f = (_e = review.groupTitle) === null || _e === void 0 ? void 0 : _e.title) === null || _f === void 0 ? void 0 : _f.description) || '',
            tags: (review.tags || []).map((entry) => entry.tag),
            authorFullName: (((_h = (_g = review.user) === null || _g === void 0 ? void 0 : _g.userInfo) === null || _h === void 0 ? void 0 : _h.first_name) || '') + ' ' + (((_k = (_j = review.user) === null || _j === void 0 ? void 0 : _j.userInfo) === null || _k === void 0 ? void 0 : _k.last_name) || '')
        };
        const scriptUpdate = Object.keys(newBody).reduce((acc, key) => {
            return `${acc} ctx._source.${key}='${newBody[key]}';`;
        }, '');
        return scriptUpdate;
    }
    async updateReview(review) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: review.id,
                    }
                },
                script: {
                    inline: this.getScriptUpdate(review)
                }
            }
        });
    }
    async updateReviewWithId(id, review) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    terms: {
                        _id: [id],
                    }
                },
                script: {
                    inline: this.getScriptUpdate(review)
                }
            }
        });
    }
    async addReviewComment(reviewId, commentId, comment) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: reviewId,
                    }
                },
                script: {
                    source: "ctx._source.comments.add(params.comment)",
                    lang: "painless",
                    params: {
                        comment: {
                            id: commentId,
                            comment: comment
                        }
                    }
                }
            }
        });
    }
    async deleteReviewComment(reviewId, commentId) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: reviewId,
                    }
                },
                script: {
                    source: "ctx._source.comments.removeIf(entry -> entry.id == params.commentId);",
                    lang: "painless",
                    params: {
                        commentId: commentId
                    }
                }
            }
        });
    }
    async updateReviewComment(reviewId, commentId, comment) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: reviewId,
                    }
                },
                script: {
                    source: `for (def entry : ctx._source.comments) {if(entry.id == params.commentId) entry.comment = params.comment;}`,
                    lang: "painless",
                    params: {
                        commentId: commentId,
                        comment: comment
                    }
                }
            }
        });
    }
    async addReviewCommentWithId(id, commentId, comment) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    terms: {
                        _id: [id],
                    }
                },
                script: {
                    source: "ctx._source.comments.add(params.comment)",
                    lang: "painless",
                    params: {
                        comment: {
                            id: commentId,
                            comment: comment
                        }
                    }
                }
            }
        });
    }
    async deleteReviewCommentWithId(id, commentId) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    terms: {
                        _id: [id],
                    }
                },
                script: {
                    source: "ctx._source.comments.removeIf(entry -> entry.id == params.commentId);",
                    lang: "painless",
                    params: {
                        commentId: commentId
                    }
                }
            }
        });
    }
    async updateReviewCommentWithId(id, commentId, comment) {
        return await this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    terms: {
                        _id: [id],
                    }
                },
                script: {
                    source: `for (def entry : ctx._source.comments) {if(entry.id == params.commentId) entry.comment = params.comment;}`,
                    lang: "painless",
                    params: {
                        commentId: commentId,
                        comment: comment
                    }
                }
            }
        });
    }
};
ReviewSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elasticsearch_1.ElasticsearchService])
], ReviewSearchService);
exports.ReviewSearchService = ReviewSearchService;
//# sourceMappingURL=review.search.service.js.map
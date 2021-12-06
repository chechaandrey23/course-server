import {Injectable} from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';
//import Post from './post.entity';
//import PostSearchResult from './types/postSearchResponse.interface';
//import PostSearchBody from './types/postSearchBody.interface';

export interface ReviewSearch {
	id: number;
	description: string;
	text: string;
	groupTitle?: {
		group?: {
			group: string;
		};
		title?: {
			title: string;
			description: string;
		};
	};
	tags?: Array<{tag: string}>;
	user?: {
		userInfo?: {
			first_name: string;
			last_name: string;
		}
	};
	comments?: Array<{id: number; comment: string}>
}

export interface ReviewCommentBody {
	id: number;
	comment: string;
}

export interface ReviewSearchBody {
	id: number;
	description: string;
	text: string;
	group: string;
	title: string;
	titleDescription: string;
	tags: Array<string>;
	authorFullName: string;
	comments?: Array<ReviewCommentBody>;
}

export interface ReviewSearchResult {
	hits: {
		total: number;
		hits: Array<{
			_source: ReviewSearchBody;
			_id: string;
		}>;
	};
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// create index reviews!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

@Injectable()
export class ReviewSearchService {
	protected index = 'reviews';

	constructor(private elasticsearchService: ElasticsearchService) {}

	async indexReview(review: ReviewSearch) {
		return await this.elasticsearchService.index<ReviewSearchBody>({
			index: this.index,
			body: {
				id: review.id,
				description: review.description || '',
				text: review.text || '',
				group: review.groupTitle?.group?.group || '',
				title: review.groupTitle?.title?.title || '',
				titleDescription: review.groupTitle?.title?.description || '',
				tags: (review.tags || []).map((entry) => entry.tag),
				authorFullName: (review.user?.userInfo?.first_name || '') + ' ' + (review.user?.userInfo?.last_name || ''),
				comments: (review.comments || []).map((entry) => entry.comment)
			}
		})
	}

	async searchReviews(text: string) {
		const {body} = await this.elasticsearchService.search<ReviewSearchResult>({
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
		//return hits;
		return hits.reduce((acc, entry) => {
			acc.ids.push(entry._source.id);
			acc.searchIds.push(entry._id);
			return acc;
		}, {ids: [], searchIds: []})
	}

	async deleteReview(reviewId: number) {
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

	async deleteReviewWithId(id: string) {
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

	protected getScriptUpdate(review: ReviewSearch) {
		const newBody: ReviewSearchBody = {
			id: review.id,
			description: review.description || '',
			text: review.text || '',
			group: review.groupTitle?.group?.group || '',
			title: review.groupTitle?.title?.title || '',
			titleDescription: review.groupTitle?.title?.description || '',
			tags: (review.tags || []).map((entry) => entry.tag),
			authorFullName: (review.user?.userInfo?.first_name || '') + ' ' + (review.user?.userInfo?.last_name || '')
		};

		const scriptUpdate = Object.keys(newBody).reduce((acc, key) => {
			return `${acc} ctx._source.${key}='${newBody[key]}';`;
		}, '');

		return scriptUpdate;
	}

	// with out comments
	async updateReview(review: ReviewSearch) {
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

	async updateReviewWithId(id: string, review: ReviewSearch) {
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

	async addReviewComment(reviewId: number, commentId: number, comment: string) {
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

	async deleteReviewComment(reviewId: number, commentId: number) {
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

	async updateReviewComment(reviewId: number, commentId: number, comment: string) {
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

	async addReviewCommentWithId(id: string, commentId: number, comment: string) {
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

	async deleteReviewCommentWithId(id: string,  commentId: number) {
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

	async updateReviewCommentWithId(id: string, commentId: number, comment: string) {
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
}

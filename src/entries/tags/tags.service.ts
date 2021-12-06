import {HttpException, HttpStatus, Injectable, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Tag} from './tag.model';
import {Review} from '../reviews/review.model';
import {ReviewTags} from '../reviews/review.tags.model';

export interface queryOptions {
	withDeleted?: boolean;
	limit?: number;
	offset?: number;
	transaction?: Transaction;
	order?: boolean;
	userId?: number;
}

@Injectable()
export class TagsService {
	constructor(private sequelize: Sequelize, @InjectModel(Tag) private tags: typeof Tag,
		@InjectModel(Review) private reviews: typeof Review, @InjectModel(ReviewTags) private reviewTags: typeof ReviewTags) {}

	public async createTag(tag:string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				let res = await this.tags.findOne({where: {tag}, transaction: t, paranoid: false});

				if(res) throw new ConflictException({tag, reason: `Tag "${tag}" already exists`});

				let res1 = await this.tags.create({tag}, {transaction: t});

				await this._patchReviewTag(t, res1.id);

				return await this.tags.findOne(this.buildQuery({userId: res1.getDataValue('id'), transaction: t}));
			});
		} catch(e) {
			handlerError(e);
		}
	}

	protected async _patchReviewTag(t: Transaction, tagId: number) {
		let res2 = await this.reviews.findAll({attributes: ['id'], transaction: t, paranoid: false});

		let newData = res2.map((entry) => {return {reviewId: entry.getDataValue('id'), tagId, selected: false}});

		let res3 = await this.reviewTags.bulkCreate(newData, {transaction: t});
	}

	public async editTag(id: number, tag:string) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.tags.update({tag}, {where: {id}, transaction: t});

				return await this.tags.findOne(this.buildQuery({userId: id, transaction: t}));
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async removeTag(id: number) {
		try {
			await this.tags.destroy({where: {id}});
			return {id: id, deletedAt: (new Date()).toString()}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async restoreTag(id: number) {
		try {
			await this.tags.restore({where: {id}});
			return {id: id, deletedAt: null}
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async deleteTag(id: number) {
		try {
			return await this.sequelize.transaction({}, async (t) => {
				await this.reviewTags.destroy({where: {tagId: id}, transaction: t, force: true});
				await this.tags.destroy({where: {id}, force: true});
				return {id: id};
			});
		} catch(e) {
			handlerError(e, {id});
		}
	}

	public async getTagAll(opts: queryOptions) {
		return await this.tags.findAll(this.buildQuery(opts));
	}

	protected buildQuery(opts: queryOptions): any {
		let paranoid = !opts.withDeleted;
		let transaction = opts.transaction;

		let query = {raw: true, includeIgnoreAttributes: false, subQuery:false, paranoid,
			attributes: {include: [[Sequelize.fn('COUNT', Sequelize.col('reviews.id')), 'countReview']],},
			include: [{model: Review, required: false, attributes: [], through: { where: { selected: true } }, paranoid},],
			where: {}, group: ['Tag.id'], transaction
		};

		let otherQuery: any = {};

		if(opts.limit !== undefined) {
			otherQuery.limit = opts.limit;
			otherQuery.offset = opts.offset;
		}

		if(opts.userId) {
			query.where = {...query.where, id: opts.userId}
		}

		if(opts.order) otherQuery.order = [[Sequelize.col('countReview'), 'DESC NULLS LAST']];

		return {...query, ...otherQuery};
	}

	public async getPartTagAll(count: number, offset: number = 0, query: string) {
		return await this.tags.findAll({attributes: ['id', 'tag'], offset: offset, limit: count, where: {tag: {
			[Op.substring]: query
		}}});
	}

	public async getShortTagAll() {
		return await this.tags.findAll({});
	}
}

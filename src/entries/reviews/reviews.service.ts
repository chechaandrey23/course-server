import {HttpException, HttpStatus, Injectable, ConflictException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Review} from './review.model';
import {ReviewTags} from './review.tags.model';
import {User} from '../users/user.model';
import {Title} from '../titles/title.model';
import {Group} from '../groups/group.model';
import {TitleGroups} from '../titles/title.groups.model';
import {UserInfo} from '../userinfos/userinfo.model';
import {Tag} from '../tags/tag.model';
import {Rating} from '../ratings/rating.model';
import {Like} from '../likes/like.model';
import {Comment} from '../comments/comment.model';
import {Role} from '../roles/role.model';

export interface queryOptions {
	withDeleted?: boolean;
	limit?: number;
	offset?: number;
	transaction?: Transaction;
	reviewId?: number;
	order?: "AR"|"UR"|"CA";
	tag?: string;
	full?: boolean;
	release?: boolean;
	forUserId?: number;
	countComments?: boolean;
}

export interface CreateReview {
	description: string;
	text: string;
	authorRating: number;
	userId: number;
	titleId: number;
	groupId: number;
	draft: boolean;
	tags: number[];
	blocked?: boolean;
	transaction?: Transaction;
}

export interface UpdateReview extends CreateReview {
	id: number;
	blocked?: boolean;
	superEdit?: boolean;
}

export interface DeleteReview {
	id: number;
	transaction?: Transaction;
	userId?: number;
	superEdit?: boolean;
}

export interface RemoveReview extends DeleteReview {}

export interface RestoreReview extends DeleteReview {}

@Injectable()
export class ReviewsService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(Review) private reviews: typeof Review,
		@InjectModel(Tag) private tags: typeof Tag,
		@InjectModel(ReviewTags) private reviewTags: typeof ReviewTags,
		@InjectModel(TitleGroups) private titleGroups: typeof TitleGroups
	) {}

	public async createReview(opts: CreateReview, createWithOutGroupTitle: boolean = false) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				const titleId = opts.titleId, groupId = opts.groupId;
				let titleGroupId = 0;

				let res0 = await this.titleGroups.findOne({where: {titleId, groupId}, transaction: t, paranoid: false});

				if(!res0) {
					if(createWithOutGroupTitle) {
						let res00 = await this.titleGroups.findOne({transaction: t, paranoid: false});
						if(!res00) {
							throw new ConflictException({reason: `Before supplements review it is necessary that at least one title exists`});
						}
						titleGroupId = res00.getDataValue('id');
					} else {
						throw new ConflictException({titleId, groupId, reason: `group/title "${groupId}/${titleId}" NOT FOUND`});
					}
				}

				let res = await this.reviews.create({
					description: opts.description,
					blocked: !!opts.blocked,
					text: opts.text,
					authorRating: opts.authorRating,
					userId: opts.userId,
					titleGroupId: titleGroupId || res0.getDataValue('id'),
					draft: !!opts.draft
				}, {transaction: t});

				//await this._createReviewOther(t, tags, res.getDataValue('id'));
				await this._patchReviewTag(t, res.getDataValue('id'), opts.tags);

				return await this.reviews.findOne(this.buildQueryOne({reviewId: res.getDataValue('id'), transaction: t}));
			});
		} catch(e) {
			handlerError(e);
		}
	}

	protected async _patchReviewTag(t: Transaction, reviewId: number, tags: number[]) {
		let res2 = await this.tags.findAll({attributes: ['id'], transaction: t, paranoid: false});

		let newData = res2.map((entry) => {return {
			tagId: entry.getDataValue('id'),
			reviewId: reviewId,
			selected: !!~tags.indexOf(entry.getDataValue('id'))
		}});

		let res3 = await this.reviewTags.bulkCreate(newData, {transaction: t});
	}

	protected async _updateReviewTag(t: Transaction, reviewId: number, tags: number[]) {
		await this.reviewTags.update({selected: false}, {where: {reviewId: reviewId}, transaction: t});
		await this.reviewTags.update({selected: true}, {where: {reviewId: reviewId, tagId: {[Op.in]: tags}}, transaction: t});
	}

	public async editReview(opts: UpdateReview) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				const id = opts.id, titleId = opts.titleId, groupId = opts.groupId;

				let res0 = await this.titleGroups.findOne({where: {titleId, groupId}, transaction: t, paranoid: false});

				if(!res0) throw new ConflictException({titleId, groupId, reason: `group/title "${groupId}/${titleId}" NOT FOUND`});

				if(!opts.superEdit) {
					let res = await this.reviews.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`EDIT: User "${opts.userId}" cannot edit content that is not the creator`);
				}

				await this.reviews.update({
					description: opts.description,
					//blocked: !!opts.blocked,
					text: opts.text,
					authorRating: opts.authorRating,
					titleGroupId: res0.getDataValue('id'),
					draft: !!opts.draft,
					//userId: opts.userId,
					...(opts.superEdit?{userId: opts.userId, blocked: !!opts.blocked}:{})
				}, {where: {id, ...(opts.superEdit?{}:{userId: opts.userId})}, transaction: t});

				//await this._createReviewOther(t, tags, id);
				await this._updateReviewTag(t, id, opts.tags);

				return await this.reviews.findOne(this.buildQueryOne({reviewId: id, transaction: t}));
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async _createReviewOther(t: Transaction, tags: number[], reviewId: number) {
		await this.reviewTags.destroy({where: {reviewId: reviewId, tagId: tags}, transaction: t});

		let newData: any[] = tags.map((entry) => {return {
			tagId: entry,
			reviewId
		}});

		await this.reviewTags.bulkCreate(newData, {transaction: t});
	}

	public async removeReview(opts: RemoveReview) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.reviews.destroy({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.reviews.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`REMOVE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.reviews.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: (new Date()).toString()}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async restoreReview(opts: RestoreReview) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				if(opts.superEdit) {
					await this.reviews.restore({where: {id: opts.id}, transaction: t});
				} else {
					let res = await this.reviews.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`RESTORE: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.reviews.restore({where: {id: opts.id, userId: opts.userId}, transaction: t});
				}
				return {id: opts.id, deletedAt: null}
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async deleteReview(opts: DeleteReview) {
		try {
			const transaction = opts.transaction;
			return await this.sequelize.transaction({...(transaction?{transaction}:{})}, async (t) => {
				await this.reviewTags.destroy({where: {reviewId: opts.id}, transaction: t, force: true});
				if(opts.superEdit) {
					await this.reviews.destroy({where: {id: opts.id}, transaction: t, force: true});
				} else {
					let res = await this.reviews.findOne({attributes: ['id'], where: {userId: opts.userId, id: opts.id}, transaction: t, paranoid: false});
					if(!res) throw new ConflictException(`DESTROY: User "${opts.userId}" cannot edit content that is not the creator`);
					await this.reviews.destroy({where: {id: opts.id, userId: opts.userId}, transaction: t, force: true});
				}
				return {id: opts.id};
			});
		} catch(e) {
			handlerError(e, {id: opts.id});
		}
	}

	public async getReviewAll(opts: OptionsQueryAll) {
		//return await this.reviews.findAll(this.buildQuery(opts));
		return await this.reviews.findAll(this.buildQueryAll(opts));
	}

	public async getReviewOne(opts: OptionsQueryOne) {
		//return await this.reviews.findOne(this.buildQuery(opts));
		return await this.reviews.findOne(this.buildQueryOne(opts));
	}

	public async getShortReviewAll() {
		return await this.reviews.findAll({include: [{model: TitleGroups, include: [
				{model: Title, attributes: ['id', 'title']},
				{model: Group, attributes: ['id', 'group']}
			]}], attributes: ['id'], where: {draft: false, blocked: false}});
	}

	public async getShortOtherReviewAll(groupTitleId: number) {
		return await this.reviews.findAll({include: [
			{model: TitleGroups, include: [
				{model: Title, attributes: ['id', 'title']},
				{model: Group, attributes: ['id', 'group']}
			]},
			{model: User, required: false, attributes: ['id', 'user', 'social_id'], include: [
				{model: UserInfo, required: false, attributes: ['first_name', 'last_name']}
			]}
		], attributes: ['id'], where: {titleGroupId: groupTitleId, draft: false, blocked: false}});
	}
	/*
	protected buildQuery(opts: queryOptions): any {
		let ratingTableName = Rating.tableName.toString();
		let reviewTableName = this.reviews.tableName.toString();
		let reviewModelName = this.reviews.name.toString();
		let comentTableName = Comment.tableName.toString();

		let paranoid = !opts.withDeleted;
		let transaction = opts.transaction;

		let tagQueryObject = {model: Tag, attributes: ['id', 'tag'],/* where: {},* / paranoid};

		let query = {attributes: {
			include: [
				[Sequelize.literal(`(SELECT ROUND(AVG("userRating"), 1) FROM "${ratingTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "averageUserRating"],
				[Sequelize.literal(`(SELECT ROUND(AVG("authorRating"), 1) FROM "${reviewTableName}" WHERE "titleGroupId"="${reviewModelName}"."titleGroupId")`), "averageEditorRating"],
				[Sequelize.literal(`(SELECT COUNT(*) FROM "${comentTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "countComments"]
			],
			exclude: [],
		}, include: [
			{model: User, attributes: ['id', 'user', 'social_id'], paranoid, include: [
				{model: UserInfo, attributes: ['first_name', 'last_name'], paranoid}
			]},
			{model: TitleGroups, paranoid, include: [
				{model: Title, attributes: ['id', 'title', 'description'], paranoid},
				{model: Group, attributes: ['id', 'group'], paranoid}
			]},
			tagQueryObject,
			//{model: Rating, attributes: [], paranoid}
		], where: {}, subQuery:false, paranoid, transaction}

		let otherQuery: any = {};

		if(opts.limit !== undefined) {
			otherQuery.limit = opts.limit;
			otherQuery.offset = opts.offset;
		}

		if(!opts.full) {
			query.attributes.exclude.push('text');
		}

		if(opts.order === "AR") otherQuery.order = [[Sequelize.col('averageEditorRating'), 'DESC NULLS LAST']];
		if(opts.order === "UR") otherQuery.order = [[Sequelize.col('averageUserRating'), 'DESC NULLS LAST']];
		if(opts.order === "CA") otherQuery.order = [[Sequelize.col('createdAt'), 'DESC NULLS LAST']];

		//if(opts.tag) tagQueryObject.where = {...tagQueryObject.where, tag: opts.tag};

		if(opts.reviewId) query.where = {...query.where, id: opts.reviewId};
		if(opts.release) query.where = {...query.where, draft: false};

		if(opts.forUserId) query.where = {...query.where, userId: opts.forUserId};

		return {...query, ...otherQuery};
	}
	*/

	protected buildQueryAll(opts: OptionsQueryAll) {
		let ratingTableName = Rating.tableName.toString();
		let reviewTableName = this.reviews.tableName.toString();
		let reviewModelName = this.reviews.name.toString();
		let comentTableName = Comment.tableName.toString();

		let paranoid = !opts.withDeleted;
		let transaction = opts.transaction;

		const includeTags: any = {model: Tag, attributes: ['id', 'tag'], through: { where: { selected: true } }, paranoid};
		const includeTitleGroups: any = {model: TitleGroups , paranoid, where: {}, include: [
			{model: Title, required: false, attributes: ['id', 'title', 'description'], paranoid},
			{model: Group, required: false, attributes: ['id', 'group'], paranoid}
		]};
		const includeUsers: any = {model: User, required: false, attributes: ['id', 'user', 'social_id'], paranoid, include: [
			{model: UserInfo, required: false, attributes: ['first_name', 'last_name'], paranoid}
		]};

		let query: any = {attributes: {
			include: [
				[Sequelize.literal(`(SELECT ROUND(AVG("userRating"), 1) FROM "${ratingTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "averageUserRating"],
				[Sequelize.literal(`(SELECT ROUND(AVG("authorRating"), 1) FROM "${reviewTableName}" WHERE "titleGroupId"="${reviewModelName}"."titleGroupId")`), "averageEditorRating"],
				[Sequelize.literal(`(SELECT COUNT(*) FROM "${comentTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "countComments"]
			],
			exclude: ['text'],
		}, include: [
			includeUsers,
			includeTitleGroups,
			includeTags,
			//{model: Rating, attributes: [], paranoid}
		], where: {}, /*subQuery:false, */paranoid, transaction};

		let otherQuery: any = {};

		if(opts.limit !== undefined) {
			otherQuery.limit = opts.limit;
			otherQuery.offset = opts.offset;
		}

		if(opts.forUserId) {
			query.include.push({model: Rating, required: false, paranoid, attributes: ['id', 'userRating'], where: {
				userId: opts.forUserId, reviewId: [Sequelize.col(`"${reviewModelName}"."id"`)]
			}});
			query.include.push({model: Like, required: false, paranoid, attributes: ['id', 'like'], where: {
				userId: opts.forUserId, reviewId: [Sequelize.col(`"${reviewModelName}"."id"`)]
			}});
		}

		if(opts.condUserId) query.where = {...query.where, userId: opts.condUserId};
		if(opts.condPublic !== undefined) query.where = {...query.where, draft: !opts.condPublic};
		if(opts.condBlocked !== undefined) query.where = {...query.where, blocked: !!opts.condBlocked};

		if(opts.getByIds) query.where = {...query.where, id: opts.getByIds};

		if(opts.withTags) includeTags.where = {id: opts.withTags};
		if(opts.withTitles) includeTitleGroups.where = {...includeTitleGroups.where, titleId: opts.withTitles};
		if(opts.withGroups) includeTitleGroups.where = {...includeTitleGroups.where, groupId: opts.withGroups};
		if(opts.withAuthors) {
			includeUsers.required = true;
			includeUsers.where = {id: opts.withAuthors};
			includeUsers.include.push({model: Role, through: { where: { selected: true } }, where: {role: getRoleEditorUser()}, paranoid});
		}

		if(opts.sortField) {
			otherQuery.order = [[Sequelize.col(opts.sortField), (opts.sortType==='DESC'?'DESC':'ASC')+' NULLS LAST']];
		}

		return {...query, ...otherQuery};
	}

	protected buildQueryOne(opts: OptionsQueryOne) {
		let ratingTableName = Rating.tableName.toString();
		let reviewTableName = this.reviews.tableName.toString();
		let reviewModelName = this.reviews.name.toString();
		let comentTableName = Comment.tableName.toString();

		let paranoid = !opts.withDeleted;
		let transaction = opts.transaction;

		const includeTags: any = {model: Tag, attributes: ['id', 'tag'], through: {attributes: [], where: { selected: true } }, paranoid};
		const includeTitleGroups: any = {model: TitleGroups, paranoid, where: {}, include: [
			{model: Title, required: false, attributes: ['id', 'title', 'description'], paranoid},
			{model: Group, required: false, attributes: ['id', 'group'], paranoid}
		]};
		const includeUsers: any = {model: User, required: false, attributes: ['id', 'user', 'social_id'], paranoid, include: [
			{model: UserInfo, required: false, attributes: ['first_name', 'last_name'], paranoid}
		]};

		let query: any = {attributes: {
			include: [
				[Sequelize.literal(`(SELECT ROUND(AVG("userRating"), 1) FROM "${ratingTableName}" WHERE "reviewId"="${reviewModelName}"."id")`), "averageUserRating"],
				[Sequelize.literal(`(SELECT ROUND(AVG("authorRating"), 1) FROM "${reviewTableName}" WHERE "titleGroupId"="${reviewModelName}"."titleGroupId")`), "averageEditorRating"],
			],
			exclude: [],
		}, include: [
			includeUsers,
			includeTitleGroups,
			includeTags,
		], where: {id: opts.reviewId}, subQuery:false, paranoid, transaction};

		if(opts.withCommentAll) {
			const model: any = {model: Comment, required: false, paranoid: !opts.condCommentsWithDeleted, attributes: ['id', 'comment'], where: {
				reviewId: [Sequelize.col(`"${reviewModelName}"."id"`)]
			}};
			if(opts.condCommentsPublic !== undefined) model.where = {...model.where, draft: !opts.condCommentsPublic};
			if(opts.condCommentsBlocked !== undefined) model.where = {...model.where, blocked: !!opts.condCommentsBlocked};
			query.include.push(model);
		}

		let otherQuery: any = {};

		if(opts.forUserId) {
			query.include.push({model: Rating, required: false, paranoid, attributes: ['id', 'userRating'], where: {
				userId: opts.forUserId, reviewId: [Sequelize.col(`"${reviewModelName}"."id"`)]
			}});
			query.include.push({model: Like, required: false, paranoid, attributes: ['id', 'like'], where: {
				userId: opts.forUserId, reviewId: [Sequelize.col(`"${reviewModelName}"."id"`)]
			}});
		}

		if(opts.condUserId) query.where = {...query.where, userId: opts.condUserId};
		if(opts.condPublic !== undefined) query.where = {...query.where, draft: !opts.condPublic};
		if(opts.condBlocked !== undefined) query.where = {...query.where, blocked: !!opts.condBlocked};

		return {...query, ...otherQuery};
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	public async getReviewTagAll(count: number, offset: number = 0) {
		return await this.reviewTags.findAll({include: [Tag, {model: Review, attributes: ['id'], include: [{model: TitleGroups, paranoid: false, include: [
			{model: Title, attributes: ['id', 'title'], paranoid: false},
			{model: Group, attributes: ['id', 'group'], paranoid: false}
		]}] }], offset: offset, limit: count});
	}
}

function getRoleEditorUser() {return 2;}

interface OptionsQueryAll {
	withDeleted?: boolean;
	limit?: number;
	offset?: number;
	transaction?: Transaction;
	withTags?: number[];
	withTitles?: number[];
	withGroups?: number[];
	withAuthors?: number[];
	sortField?: string;
	sortType?: "ASC"|"DESC";
	condUserId?: number;
	condPublic?: boolean;
	forUserId?: number;
	getByIds?: number[];
	condBlocked?: boolean;
}

interface OptionsQueryOne {
	reviewId: number;
	withDeleted?: boolean;
	transaction?: Transaction;
	condUserId?: number;
	condPublic?: boolean;
	forUserId?: number;
	withCommentAll?: boolean;
	condBlocked?: boolean;
	condCommentsPublic?: boolean;
	condCommentsBlocked?: boolean;
	condCommentsWithDeleted?: boolean;
}

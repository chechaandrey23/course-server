import {Module} from '@nestjs/common';

import {GuestController} from './guest.controller';

import {UsersModule} from '../entries/users/users.module';
import {RolesModule} from '../entries/roles/roles.module';
import {GroupsModule} from '../entries/groups/groups.module';
import {TitlesModule} from '../entries/titles/titles.module';
import {LangsModule} from '../entries/langs/langs.module';
import {ThemesModule} from '../entries/themes/themes.module';
import {UserInfosModule} from '../entries/userinfos/userinfos.module';
import {ImagesModule} from '../entries/images/images.module';
import {TagsModule} from '../entries/tags/tags.module';
import {ReviewsModule} from '../entries/reviews/reviews.module';
import {RatingsModule} from '../entries/ratings/ratings.module';
import {LikesModule} from '../entries/likes/likes.module';
import {CommentsModule} from '../entries/comments/comments.module';

@Module({
	imports: [
		UsersModule,
		RolesModule,
		ReviewsModule,
		GroupsModule,
		TitlesModule,
		LangsModule,
		ThemesModule,
		UserInfosModule,
		ImagesModule,
		TagsModule,
		RatingsModule,
		LikesModule,
		CommentsModule
	],
	controllers: [
		GuestController
	],
	providers: [
		
	]
})
export class GuestModule {}

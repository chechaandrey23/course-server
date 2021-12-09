import {Module} from '@nestjs/common';
import {ElasticsearchModule} from '@nestjs/elasticsearch';

import {ReviewElasticSearchService} from './review.elastic.search.service';

import {ELASTIC_SEARCH_HOST, ELASTIC_SEARCH_USERNAME, ELASTIC_SEARCH_PASSWORD} from '../../config';

@Module({
	imports: [
		ElasticsearchModule.register({
			node: ELASTIC_SEARCH_HOST,
			auth: {
				username: ELASTIC_SEARCH_USERNAME,
				password: ELASTIC_SEARCH_PASSWORD
			}
		})
	],
	controllers: [],
	providers: [
		ReviewElasticSearchService
	],
	exports: [
		ElasticsearchModule,
		ReviewElasticSearchService
	]
})
export class ReviewElasticSearchModule {}

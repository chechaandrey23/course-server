import {Module} from '@nestjs/common';
import {ElasticsearchModule} from '@nestjs/elasticsearch';

import {ReviewSearchService} from './review.search.service';

@Module({
	imports: [
		ElasticsearchModule.register({
			node: 'http://localhost:9200',
			auth: {
				username: 'elastic',
				password: 'changeme'
			}
		})
	],
	controllers: [],
	providers: [
		ReviewSearchService
	],
	exports: [
		ElasticsearchModule,
		ReviewSearchService
	]
})
export class ReviewSearchModule {}

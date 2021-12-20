import { PageDTO } from './page.dto';
export declare class ReviewsFilterDTO extends PageDTO {
    tags: number[];
    titles: number[];
    groups: number[];
    sortField: string;
    sortType: "ASC" | "DESC";
}

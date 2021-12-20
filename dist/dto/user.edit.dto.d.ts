import { IdDTO } from './id.dto';
export declare class UserEditDTO extends IdDTO {
    user: string;
    social_id: string;
    email: string;
    blocked: boolean;
    activated: boolean;
    roles: number[];
}

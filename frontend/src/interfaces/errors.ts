export interface ErrorDetailInterface {
    detail: string;
    key?: string;
}

export interface ErrorInterface {
    errors: ErrorDetailInterface[];
}
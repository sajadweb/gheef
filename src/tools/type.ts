import { ObjectID } from "bson";

export enum Offset {
    Five = 5,
    Ten = 10,
    Fifteen = 15,
    Twenty = 20,
    TwentyFive = 25,
    Fifty = 50,
    Hundred = 100
}

export interface Pages {
    limit?: Number;
    offset?: Offset;
}

export enum Permission {
    ADMIN = "ADMIN",
    USER = "USER",
    PROVIDER = "PROVIDER"
}

export enum TypeCategory {
    Parent = "Parent",
    Children = "Children"
}

export interface ProductsInputType {
    count?: Offset,
    page?: Number,
    search?: String
}

export interface CategoryInputType {
    type?: TypeCategory,
    parent?: ObjectID,
}

export interface CategorySaveInputType {
    title: String,
    parent?: ObjectID | null
}

export interface CategoryUpdateInputType extends CategorySaveInputType{
    id: ObjectID,
}

export interface AdvertiseInputType {
    title: String,
    photo: String
    link?: String
    status?: String
}

export interface AdvertiseUpdateInputType extends AdvertiseInputType{
    id: ObjectID,
}
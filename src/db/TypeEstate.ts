import { prop, Typegoose, arrayProp, Ref } from "typegoose";

class TypeEstate extends Typegoose {
    @prop()
    title: string;
}

export { TypeEstate };
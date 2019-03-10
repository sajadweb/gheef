import { prop, Typegoose, Ref } from "typegoose";


class Category extends Typegoose {

    @prop()
    title: string;

    @prop({ ref: Category })
    parent?: Ref<Category>;

    @prop()
    deleted_at?: String;

}

export default Category;
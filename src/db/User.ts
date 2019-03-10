import { prop, Typegoose, arrayProp, Ref } from "typegoose";
import Category from "./Category";
import Profile from "./Profile";

class User extends Typegoose {
    @prop()
    mobile: string;

    @prop({ default: 0 })
    role?: string;

    @prop({ default: 0 })
    status?: string;

    @prop()
    sms_code: string;

    @prop()
    permission?: [string];

    @prop()
    firstName?: string;

    @prop()
    lastName?: string;

    @arrayProp({ itemsRef: Category })
    categories?: Ref<Category>[];

    @prop()
    profile?: Profile;

}

export default User;
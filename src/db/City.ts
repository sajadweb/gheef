import { prop, Typegoose, arrayProp, Ref } from "typegoose";
import Province from "./Province";

class City extends Typegoose {

    @prop({ ref: Province })
    province?: Ref<Province>;

    @prop()
    name: string;
    
    @prop()
    deleted_at?: Date;
}

export default City;
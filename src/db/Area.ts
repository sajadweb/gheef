import { prop, Typegoose, arrayProp, Ref } from "typegoose";
import City from "./City";
import Province from "./Province";

class Area extends Typegoose {
    @prop({ ref: City })
    city?: Ref<City>;

    @prop({ ref: Province })
    province: Ref<Province>;

    @prop()
    name: string;

    @prop()
    deleted_at?: Date;
}

export default Area;
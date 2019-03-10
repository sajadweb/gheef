import { prop, Typegoose, Ref } from "typegoose";
import Area from "./Area";
import City from "./City";
import Province from "./Province";
import { TypeEstate } from "./TypeEstate";
import { Double } from "bson";
export class Location extends Typegoose{
    @prop()
    lat?: Double;
    @prop()
    long?: Double;
}


class Profile extends Typegoose {

    @prop()
    shaba?: string;

    @prop()
    shop_name?: string;

    @prop()
    mali?: string;

    @prop()
    phone?: string;

    @prop({ ref: TypeEstate })
    type_estate?: Ref<TypeEstate>;

    @prop()
    address?: string;

    @prop({ ref: Province })
    province?: Ref<Province>;

    @prop({ ref: City })
    city?: Ref<City>;

    @prop({ ref: Area })
    area?: Ref<Area>;

    @prop()
    postal_code?: string;
    
    @prop()
    location?: Location;

}

export default Profile;
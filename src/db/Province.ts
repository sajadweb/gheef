import { prop, Typegoose, Ref } from "typegoose";


class Province extends Typegoose {

    @prop()
    name: string;
    
    @prop()
    deleted_at?: Date;
}

export default Province;
import { prop, Typegoose, arrayProp, Ref, pre } from "typegoose";
import { Int32 } from "bson";

@pre<Advertise>('save', function (next) {
   
    if (!this.created_at) {
        this.created_at = new Date();
       
    } else {
        this.updated_at = new Date();
    }
    next();
})
class Advertise extends Typegoose {

    @prop()
    title: string;

    @prop()
    path: string;

    @prop()
    link: string;

    @prop()
    status: Int32;

    @prop()
    created_at?: Date;

    @prop()
    updated_at?: Date;
    @prop()
    deleted_at?: Date;
}

export default Advertise;
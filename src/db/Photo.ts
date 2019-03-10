import { prop, Typegoose, Ref, pre } from "typegoose";
import User from "./User";
import { Int32 } from "bson";
@pre<Photo>('save', function (next) {
    if (!this.created_at) {
        this.created_at =  new Date();
    }
    if (!this.state) {
        this.state = 0;
    }
    next();
})

class Photo extends Typegoose {
    @prop()
    path: String;
    
    @prop()
    state: Int32;

    @prop()
    created_at: Date;

    @prop({ ref: User })
    user: Ref<User>;
}

export default Photo;
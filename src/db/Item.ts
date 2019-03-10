import { prop, Typegoose, Ref } from "typegoose";
import Product from "./Product";
import Price from "./Price";
class Item extends Typegoose {
    @prop()
    counter: Int16Array;

    @prop({ ref: Product })
    product?: Ref<Product>;
    
    @prop({ ref: Price })
    price?: Ref<Price>;
}

export default Item;
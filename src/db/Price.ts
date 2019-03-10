import { prop, Typegoose, Ref, pre, post } from "typegoose";
import User from "./User";
import { Int32 } from "bson"; 
class Product extends Typegoose { }

@pre<Price>('save', function (next) {
    if (!this.created_at) {
        this.created_at = `${new Date()}`;
    }
    next();
})


// @post<Price>('find', async function (doc) {
//     let prices;
//     concat(doc, function (item, callback) {
//         console.log(Date.now(),`"item${item.id}"`)
//         if (item.created_at) {
//             const d = new Date(`${item.created_at}`);
//             item.created_at = `${moment(d).locale('fa').format('YYYY/M/D H:m:s')}`;
//         }
//         callback(null, [item]);
//     }, function (err, items) {
//         prices = items;
//     })
//     return await prices;
// })
// recSchema.pre('find', function(next) {
//     console.log("Pre Find");
//     next();
//   });
//   recSchema.pre('findOne', function(next) {
//     console.log("Pre Find One");
//     next();
//   });
//   recSchema.post('find', function(doc) {
//     console.log("Post Find");
//   });
//   recSchema.post('findOne', function(doc) {
//     console.log("Post Find One");
//   });
class Price extends Typegoose {

    @prop({ ref: User })
    provider?: Ref<User>;

    @prop()
    price: Int32;

    @prop()
    created_at?: String;

    @prop({ ref: Product })
    product: Ref<Product>;
}

export default Price;
import { prop, Typegoose, arrayProp, Ref, pre, post } from "typegoose";
import User from "./User";
import SubOrder from "./SubOrder";
import { concat } from "async";
import * as moment from "jalali-moment";

@pre<Order>('save', function (next) {
    if (!this.created_at) {
        this.created_at = `${new Date()}`;
    } else {
        this.updated_at = `${new Date()}`;
    }
    next();
})
// @post<Order>('find', async function (doc) {
//     let products;
//     if (doc) {
//         concat(doc, function (item, callback) {
//             if (item) {
//                 if (item.created_at) {
//                     const d = new Date(`${item.created_at}`);
//                     item.created_at = `${moment(d).locale('fa').format('YYYY/M/D H:m:s')}`;
//                 }
//                 if (item.updated_at) {
//                     const u = new Date(`${item.updated_at}`);
//                     item.updated_at = `${moment(u).locale('fa').format('YYYY/M/D H:m:s')}`;
//                 }
//             }
//             callback(null, [item]);
//         }, function (err, items) {
//             products = items;
//         })
//     } else {
//         return doc;
//     }
//     return await products;
// })
// @post<Order>('findOne', function (item) {
//     console.log('item', item);
//     if (item) {
//         if (item.created_at) {
//             const d = new Date(`${item.created_at}`);
//             item.created_at = `${moment(d).locale('fa').format('YYYY/M/D H:m:s')}`;
//         }
//         if (item.updated_at) {
//             const u = new Date(`${item.updated_at}`);
//             item.updated_at = `${moment(u).locale('fa').format('YYYY/M/D H:m:s')}`;
//         }
//     }
//     return item;
// })
// class SubOrder extends Typegoose { }
class Order extends Typegoose {
    @prop({ ref: User })
    shop?: Ref<User>;

    @prop()
    priceAll: Int32Array;

    @prop()
    discount: Int16Array;

    @prop()
    status: Int16Array;

    @arrayProp({ itemsRef: SubOrder })
    details: Ref<SubOrder>[];


    @prop()
    created_at?: String;

    @prop()
    updated_at?: String;

    @prop()
    deleted_at?: String;
}

export default Order;
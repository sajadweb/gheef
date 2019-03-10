import { prop, Typegoose, Ref, post, pre } from "typegoose";
import User from "./User";
import Item from "./Item";
class Order extends Typegoose { }

@pre<SubOrder>('save', function (next) {
    if (!this.created_at) {
        this.created_at = `${new Date()}`;
    } else {
        this.updated_at = `${new Date()}`;
    }
    next();
})
// @post<SubOrder>('find', async function (doc) {

//     if (doc) {
//         let products;
//         concat(doc, function (item, callback) {
//             console.log(Date.now(), `"Order ${item.id}"`)
//             if (item.created_at) {
//                 const d = new Date(`${item.created_at}`);
//                 item.created_at = `${moment(d).locale('fa').format('YYYY/M/D H:m:s')}`;
//             }
//             if (item.updated_at) {
//                 const u = new Date(`${item.updated_at}`);
//                 item.updated_at = `${moment(u).locale('fa').format('YYYY/M/D H:m:s')}`;
//             }
//             callback(null, [item]);
//         }, function (err, items) {
//             products = items;
//         })
//         return await products;
//     } else {
//         return doc;
//     }
// })
// @post<SubOrder>('findOne', function (item) {
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
class SubOrder extends Typegoose {
    @prop()
    items: Item[];

    @prop({ ref: User })
    provider?: Ref<User>;

    @prop({ ref: Order })
    order?: Ref<Order>;

    @prop()
    created_at?: String;

    @prop()
    updated_at?: String;

    @prop()
    deleted_at?: String;
}

export default SubOrder;
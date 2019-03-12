import { prop, Typegoose, arrayProp, Ref, pre, post } from "typegoose";
import Category from "./Category";
import Price from "./Price";


@pre<Product>('save', function (next) {
    if (!this.created_at) {
        this.created_at = `${new Date()}`;
    } else {
        this.updated_at = `${new Date()}`;
    }
    next();
})

// @post<Product>('find', async function (doc) {
//     let products;
//     concat(doc, function (item, callback) {
//         if (item.created_at) {
//             const d = new Date(`${item.created_at}`);
//             item.created_at = `${moment(d).locale('fa').format('YYYY/M/D H:m:s')}`;
//         }
//         if (item.updated_at) {
//             const u = new Date(`${item.updated_at}`);
//             item.updated_at =   `${moment(u).locale('fa').format('YYYY/M/D H:m:s')}`;
//         }
//         callback(null, [item]);
//     }, function (err, items) {
//         products = items;
//     })
//     return await products;
// })
// @post<Product>('findOne', function (item) {
//     console.log(Date.now(), `"products ${item.id}"`)
//     if (item.created_at) {
//         const d = new Date(`${item.created_at}`);
//         item.created_at = `${moment(d).locale('fa').format('YYYY/M/D H:m:s')}`;
//     }
//     if (item.updated_at) {
//         const u = new Date(`${item.updated_at}`);
//         item.updated_at =   `${moment(u).locale('fa').format('YYYY/M/D H:m:s')}`;
//     }
//     return item;
// })

class Product extends Typegoose {
    @prop()
    name: string;

    @prop()
    commission: string;

    @prop()
    publish: boolean;

    @prop()
    photo?: [string];

    @prop()
    description?: string;

    @arrayProp({ itemsRef: Category })
    categories?: Ref<Category>[];

    @arrayProp({ itemsRef: Price })
    prices?: Ref<Price>[];

    @prop()
    created_at?: String;

    @prop()
    updated_at?: String;

    @prop({default:null})
    deleted_at: String;
}

export default Product;
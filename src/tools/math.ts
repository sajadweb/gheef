import { Log } from "./log";
import { Int32 } from "bson";

export const priceInt = (price, priceAll, count) => {

    const all = parseInt(priceAll ? priceAll : 0) + (parseInt(price) * count)
    console.log(`price(${price}) * count(${count})+  priceAll(${priceAll})===${all}`)
    return all;
}

export const addNewPriceInOrder = async (Order, SubOrder, Item, userId, product, price, count) => {
    let sub = new SubOrder();
    let item = new Item();
    item.product = product.id;
    item.price = price.id;
    item.counter = count;
    sub.items = [item];
    sub.provider = price.provider;

    await sub.save();

    let order = new Order();
    order.shop = userId;
    let det = [];
    det.push(sub.id)
    order.details = det;
    order.discount = 0;
    order.status = 0;
    order.priceAll = priceInt(price.price, 0, count);
    await order.save();
    sub.order = order.id;
    await sub.save();
    return true;
}

export const positiveOrder = async (Order, SubOrder, Item, order, price, product, count) => {
    let suborder = await SubOrder.findOne({ order: order.id, provider: price.provider });

    //find provider
    if (suborder) {
        //yes provider
        let item = await suborder.items.find((i) => i.product === product.id);
        if (item) {
            // befor add product
            let items = suborder.items.map(j => {
                if (j.product === item.product) {
                    //add count
                    j.counter = count + parseInt(j.counter)
                }
                return j;
            });
            suborder.items = items;
            suborder.order = suborder.order;
        } else {
            // new add product in provider
            let item = new Item();
            item.product = product.id;
            item.price = price.id;
            item.counter = count;
            suborder.items = [...suborder.items, item];
        }
        //update suborder
        let s = new SubOrder(suborder);
        await s.save();
    } else {
        //No provider
        //make provider in suborder
        suborder = new SubOrder();
        //new item
        let item = new Item();
        item.product = product.id;
        item.price = price.id;
        item.counter = count;
        suborder.items = [item];
        suborder.order = order.id;
        suborder.provider = price.provider;
        //update suborder
        let s = new SubOrder(suborder);
        await s.save();
        order.details = [suborder.id, ...order.details];
    }
    //calculator price
    order.priceAll = priceInt(price.price, order.priceAll, count);
    let o = new Order(order);
    await o.save();
    return true;
}

export const negativeOrder = async (Order, SubOrder, order, price, product, count) => {
    let suborder = await SubOrder.findOne({ order: order.id, provider: price.provider });

    //find provider
    if (suborder) {
        //yes provider
        let item = await suborder.items.find((i) => i.product === product.id);
        if (item) {
            // befor add product
            if (item.counter + count > 0) {
                let items = suborder.items.map(j => {
                    if (j.product === item.product) {
                        //add count
                        j.counter = count + parseInt(j.counter)
                    }
                    return j;
                });
                suborder.items = items;
                suborder.order = suborder.order;
                let s = new SubOrder(suborder);
                await s.save();
                order.priceAll = priceInt(price.price, order.priceAll, count);
                let o = new Order(order);
                await o.save();
                return true;
            } else {
                return deleteOrder(Order, SubOrder, order, price, product);
            }


        } else {
            throw Error("این محصول در لیست سفارش شما ثبت نشده");
        }

    } else {
        //No provider
        throw Error("این محصول در لیست سفارش شما ثبت نشده");

    }

}

export const deleteOrder = async (Order, SubOrder, order, price, product) => {
    let suborder = await SubOrder.findOne({ order: order.id, provider: price.provider });

    //find provider
    if (suborder) {
        //yes provider
        let item = await suborder.items.find((i) => i.product === product.id);
        if (item) {
            const count = -item.counter;
            //count product in order
            let items = suborder.items.filter(j => {
                return j.product != item.product

            });
            if (items.length > 0) {
                //item dare pass suborder not delete
                suborder.items = items;
                suborder.order = suborder.order;
                let s = new SubOrder(suborder);
                await s.save();
                order.priceAll = priceInt(price.price, order.priceAll, count);
                let o = new Order(order);
                await o.save();
                return true;
            } else {
                //count suborder
                let subItem = order.details.filter(or => {
                    return or != suborder.id
                });

                if (subItem.length > 0) {
                    //remove in suborder
                    SubOrder.findById(suborder.id).remove().exec();
                    //remove in order
                    order.details = subItem;
                    order.priceAll = priceInt(price.price, order.priceAll, count);
                    let o = new Order(order);
                    await o.save();
                    return true;
                } else {
                    //delete all
                    SubOrder.findById(suborder.id).remove().exec();
                    Order.findById(order.id).remove().exec();
                    return true;
                }
            }

        } else {
            throw Error("این محصول در لیست سفارش شما ثبت نشده");
        }

    } else {
        //No provider
        throw Error("این محصول در لیست سفارش شما ثبت نشده");

    }

}

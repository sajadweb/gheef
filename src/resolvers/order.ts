import { hasPermission, Offset, checkPermission, positiveOrder, negativeOrder, deleteOrder, addNewPriceInOrder } from "../tools";
import { ObjectID } from "bson";

export default {
    Query: {
        async ordersProvider(parent, args, { models, request }, info) {
            console.time("ordersProvider")
            hasPermission(request.user, ["ADMIN", "PROVIDER"]);
            const SubOrder = models.SubOrder;
            const count = args.count ? parseInt(Offset[args.count]) : 15;
            const inPage = args.page ? args.page > 0 ? parseInt(`${args.page}`) : 0 : 0;
            const page = inPage > 0 ? inPage - 1 : 0;
            let p = request.user.id;

            let options = {
                // provider: p
            };
            if (checkPermission(request.user, "PROVIDER")) {
                options['provider'] = p
            }
            const res1 = SubOrder.find(
                options, null, {
                    limit: count,
                    skip: count * page
                }
            )
                .populate("provider")
                .populate({
                    path: "order",
                    populate: { path: "shop" }
                })
                .populate({
                    path: "items.product",
                    model: 'Product'
                })
                .populate({
                    path: "items.price",
                    model: 'Price'
                })
                .exec();

            const res2 = SubOrder.countDocuments(options);
            const suborders = await res1;
            const counts = await res2;
            const totalPages = counts / count
            const floor = Math.floor(totalPages);
            console.timeEnd("ordersProvider")
            return {
                data: suborders,
                total: counts,
                totalData: suborders.length,
                totalPages: floor < totalPages ? floor + 1 : totalPages,
                limit: count,
                page: inPage,
                nextPage: ((inPage * count) < counts) ? inPage + 1 : 0,
                prevPage: inPage > 0 ? inPage - 1 : 0,
            };

        },
        async orders(parent, args, { models, request }, info) {
            console.time("orders")
            hasPermission(request.user, ["ADMIN"]);
            const SubOrder = models.SubOrder;
            const count = args.count ? parseInt(Offset[args.count]) : 15;
            const inPage = args.page ? args.page > 0 ? parseInt(`${args.page}`) : 0 : 0;
            const page = inPage > 0 ? inPage - 1 : 0;
            let p = request.user.id;

            let options = {};

            const res1 = SubOrder.find(
                options, null, {
                    limit: count,
                    skip: count * page
                }
            )
                .populate("provider")
                .populate({
                    path: "order",
                    populate: { path: "shop" }
                })
                .populate({
                    path: "items.product",
                    model: 'Product'
                })
                .populate({
                    path: "items.price",
                    model: 'Price'
                })
                .exec();

            const res2 = SubOrder.countDocuments(options);
            const suborders = await res1;
            const counts = await res2;
            const totalPages = counts / count
            const floor = Math.floor(totalPages);
            console.timeEnd("orders")
            return {
                data: suborders,
                total: counts,
                totalData: suborders.length,
                totalPages: floor < totalPages ? floor + 1 : totalPages,
                limit: count,
                page: inPage,
                nextPage: ((inPage * count) < counts) ? inPage + 1 : 0,
                prevPage: inPage > 0 ? inPage - 1 : 0,
            };

        },

        async ordersShop(parent, args, { models, request }, info) {
            console.time("ordersShop")
            hasPermission(request.user, ["SHOP"]);
            const Order = models.Order;
            const count = args.count ? parseInt(Offset[args.count]) : 15;
            const inPage = args.page ? args.page > 0 ? parseInt(`${args.page}`) : 0 : 0;
            const page = inPage > 0 ? inPage - 1 : 0;
            let options = {
                shop: request.user.id
            };
            const res1 = Order.find(
                options, null, {
                    limit: count,
                    skip: count * page
                })
                .populate("shop")
                .populate({
                    path: "details",
                    populate: [
                        { path: "provider", model: 'User' },
                        { path: "items.product", model: 'Product' },
                        { path: "items.price", model: 'Price' }
                    ]
                })
                .exec();


            const res2 = Order.countDocuments(options);
            const orders = await res1;
            const counts = await res2;
            const totalPages = counts / count
            const floor = Math.floor(totalPages);
            console.timeEnd("ordersShop")
            return {
                data: orders,
                total: counts,
                totalData: orders.length,
                totalPages: floor < totalPages ? floor + 1 : totalPages,
                limit: count,
                page: inPage,
                nextPage: ((inPage * count) < counts) ? inPage + 1 : 0,
                prevPage: inPage > 0 ? inPage - 1 : 0,
            };
        },

        async order(parent, args, { models, request }, info) {
            hasPermission(request.user, ["SHOP", "ADMIN", "PROVIDER"]);
            const Order = models.Order;
            const SubOrder = models.SubOrder;
            let options = {
                shop: request.userId,
                status: 0
            };
            const order = await Order.findOne(options)
                .populate({
                    path: "details",
                    populate: [
                        { path: "provider", model: 'User' },
                        // { path: "order", model: 'Order' },
                        { path: "items.product", model: 'Product' },
                        { path: "items.price", model: 'Price' }
                    ]
                })
                .exec();


            return order;
        },
        async oneOrder(parent, args, { models, request }, info) {
            hasPermission(request.user, ["SHOP", "ADMIN", "PROVIDER"]);
            const Order = models.Order;
            const SubOrder = models.SubOrder;
            let options = {
                id: args.id
            };
            if (checkPermission(request.user, "SHOP")) {
                options['shop'] = request.userId;
            }


            const order = await Order.findById(args.id)
                .populate("shop")
                .populate({
                    path: "details",
                    populate: [
                        { path: "provider", model: 'User' },
                        { path: "items.product", model: 'Product' },
                        { path: "items.price", model: 'Price' }
                    ]
                })
                .exec();


            return order;
        },
    },
    Mutation: {
        async  addProductInOrder(parent, args, { request, models }, info) {
            hasPermission(request.user, ["SHOP", "PROVIDER"]);

            const Product = models.Product;
            const Price = models.Price;
            const Order = models.Order;
            const Item = models.Item;
            const SubOrder = models.SubOrder;
            const product = await Product.findById(args.product);
            const price = await Price.findById(args.price);
            const count = args.count != undefined ? parseInt(args.count) : 1;
            let provider = false;
            let order;
            if (checkPermission(request.user, "PROVIDER")) {
                provider = true;
                order = await Order.findById(args.order);
                if (!order) {
                    throw Error("سفارش مورد نظر یافت نشد");
                }
            }

            if (!product || !price) {
                throw Error("محصول مورد نظر یافت نشد");
            }
            if (!provider) {
                order = await Order.findOne({ status: 0, shop: request.userId });
            }
            if (order) {

                if (count > 0) {
                    //positive
                    return await positiveOrder(Order, SubOrder, Item, order, price, product, count);

                } else if (count < 0) {
                    // negative
                    return await negativeOrder(Order, SubOrder, order, price, product, count);
                } else {
                    //delete
                    return deleteOrder(Order, SubOrder, order, price, product);
                }
            } else {
                if (args.count === 0 || args.count === -1) {
                    throw Error("این محصول در لیست سفارش شما ثبت نشده");
                }
                return await addNewPriceInOrder(Order, SubOrder, Item, request.userId, product, price, count)
            }

        },
        async  changeStatus(parent, args: { id: ObjectID, status: number }, { request, models }, info) {
            hasPermission(request.user, ["SHOP", "PROVIDER", "ADMIN"]);
            const Order = models.Order;
            const order = await Order.findById(args.id);
            if (order) {
                order.status = args.status;
                if (order.save(order)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }


        },
    }
}
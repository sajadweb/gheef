import { hasPermission, checkPermission, Offset, ProductsInputType, Auth, Log } from "../tools";
import * as async from "async";
export default {
    Query: {
        async product(parent, args, { models, request }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);

            const Product = models.Product;

            const product = await Product.findOne({
                _id: args.id,
                deleted_at: null
            })
                .populate("categories")
                .populate({
                    path: "prices",
                    populate: { path: "provider" }
                })
                .exec();
            if (!product) {
                throw Error("محصول مورد نظر یافت نشد");
            }
            return product;
        },

        async products(parent, args: ProductsInputType, { models, request }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const count = args.count ? parseInt(Offset[args.count]) : 15;
            const page = args.page ? parseInt(`${args.page}`) - 1 : 0;
            const Product = models.Product;
            let options = {
                deleted_at: null
            };
            if (checkPermission(request.user, "SHOP")) {
                options['prices'] = { $not: { $size: 0 } };
                options["categories"] = { $in: request.user.categories };
            }
            if (checkPermission(request.user, "PROVIDER")) {
                options["categories"] = { $in: request.user.categories };
            }
            if (args.search) {
                options['name'] = { $regex: args.search };
            }
            const products = await Product.find(options, null, {
                limit: count,
                skip: count * page,
                sort: { 'created_at': '-1' }
            })
                .populate("categories")
                .populate({
                    path: "prices",
                    populate: { path: "provider" }
                })
                .exec();
            return products;
        },

        async paginationProducts(parent, args: ProductsInputType, { models, request }, info) {
            console.time("paginationProducts")
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const count = args.count ? parseInt(Offset[args.count]) : 15;
            const inPage = args.page ? args.page > 0 ? parseInt(`${args.page}`) : 0 : 0;
            const page = inPage > 0 ? inPage - 1 : 0;
            const Product = models.Product;
            let options = {
                deleted_at: null
            };
            if (checkPermission(request.user, "SHOP")) {
                options['prices'] = { $not: { $size: 0 } };
                options["categories"] = { $in: request.user.categories };
            }
            if (checkPermission(request.user, "PROVIDER")) {
                options["categories"] = { $in: request.user.categories };
            }
            if (args.search) {
                options['name'] = { $regex: args.search };
            }
            const res1 = Product.find(options, null, {
                limit: count,
                skip: count * page,
                sort: { 'created_at': '-1' }
            })
                .populate("categories")
                .populate({
                    path: "prices",
                    populate: { path: "provider" }
                })
                .exec();
            let res2 = Product.countDocuments(options);
            const products = await res1;
            const counts = await res2;

            const totalPages = counts / count
            const floor = Math.floor(totalPages);
            console.timeEnd("paginationProducts")
            return {
                data: products,
                total: counts,
                totalData: products.length,
                totalPages: floor < totalPages ? floor + 1 : totalPages,
                limit: count,
                page: inPage,
                nextPage: ((inPage * count) < counts) ? inPage + 1 : 0,
                prevPage: inPage > 0 ? inPage - 1 : 0,
            };
        },


        async prices(parent, args, { models, request }, info) {
            hasPermission(request.user, ["SHOP", "PROVIDER", "ADMIN"]);
            const Price = models.Price;
            const price = await Price.find({
                product: args.id
            });
            return price;
        },
    },
    Mutation: {

        async  newProduct(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP"]);
            if (args.categories) {
                if (args.categories.length <= 0) {
                    throw new Error("کاریر گرامی دسته بندی نباید خالی باشد")
                }
            } else {
                throw new Error("کاریر گرامی دسته بندی نباید خالی باشد")
            }
            if (args.name) {
                if (args.name.length > 255) {
                    throw new Error("کاریر گرامی نام  محصول نباید بیشتر از 255 کارکنر باشد")
                }
                if (args.name.length < 2) {
                    throw new Error("کاریر گرامی نام  محصول نباید کمتر از 2 کارکنر باشد")
                }
            } else {
                throw new Error("کاریر گرامی نام  محصول نباید خالی باشد")
            }

            //find by id
            const Product = models.Product;
            let product = new Product();
            product.name = args.name;
            product.commission = args.commission;
            product.photo = args.photo;
            product.description = args.description;
            product.categories = args.categories;
            const save = await product.save();
            if (save) {
                return product;
            } else {
                return null;
            }
            //edit 
            //return 
        },
        async  editProduct(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP"]);
            //find by id
            const Product = models.Product;
            const find = await Product.findOne({
                _id: args.id,
                deleted_at: null
            });
            if (!find) {
                throw Error("محصول مورد نظر یافت نشد");
            }
            if (args.name)
                find.name = args.name;
            if (args.commission)
                find.commission = args.commission;
            if (args.photo)
                find.photo = [...find.photo, ...args.photo];
            if (args.description)
                find.description = args.description;
            if (args.categories)
                find.categories = args.categories;

            let product = new Product(find);
            const save = await product.save();
            if (save) {
                return product;
            } else {
                return null;
            }
        },
        async  deleteProduct(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //find by id
            const Product = models.Product;
            const find = await Product.findById(args.id);
            // Log("find deleteProduct",find);
            if (!find) {
                throw Error("محصول مورد نظر یافت نشد");
            }
            find.deleted_at = `${new Date()}`;
            let product = new Product(find);
            const save = await product.save();
            if (save) {
                return true;
            } else {
                return false;
            }
        },
        async  deletePhotoProduct(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //find by id
            const Product = models.Product;
            const find = await Product.findById(args.id);
            if (!find) {
                throw Error("محصول مورد نظر یافت نشد");
            }
            const photos = find.photo.filter(i => {
                return i != args.photo
            })
            find.photo = photos;
            let product = new Product(find);
            const save = await product.save();
            if (save) {
                return false;
            } else {
                return null;
            }
        },
        async  addPriceInProduct(parent, args, { request, models }, info) {
            hasPermission(request.user, ["PROVIDER"]);

            const Product = models.Product;
            const Price = models.Price;
            const find = await Product.findById(args.product)
                .populate({
                    path: "prices",
                    populate: [
                        { path: "provider", model: 'User' },
                    ]
                })
                .exec();

            if (!find) {
                throw Error("محصول مورد نظر یافت نشد");
            }

            const fnp = await find.prices.find((item) => {
                return item.provider.id == Auth.getId(request) ? item : null;
            })
            if (fnp) {
                if (fnp.price === args.price) {
                    return true;
                } else {
                    //   async.reject(fnp.prices, (i, callback) => {
                    //     // if(i.provider == Auth.getId(request)){
                    //     console.log(i,"pro\n");
                    //     callback(null,i);
                    //     // }
                    // },()=>{

                    // })
                    let prices = [];
                    let wating = null;
                    if (find.prices) {
                        async.concat(find.prices, function (price, callback) {
                            console.log("filePath", JSON.stringify(price['provider']['id']))
                            if (price['provider']['id'] != Auth.getId(request)) {
                                prices.push(price['id']);
                                callback(null, [price]);
                            }
                        }, (err, back) => {
                            wating = true;
                        });
                    } else {
                        wating = true;
                    }
                    console.log("aaa", prices)
                    await wating;
                    const en = new Price();
                    en.price = args.price;
                    en.provider = request.user.id;
                    en.product = find.id;
                    await en.save();
                    find.prices = [...prices, en.id]
                    const em = new Product(find);
                    await em.save();
                    return true;
                }

            } else {
                const en = new Price();
                en.price = args.price;
                en.provider = request.user.id;
                en.product = find.id;
                await en.save();
                find.prices = [...find.prices, en.id]
                const em = new Product(find);
                await em.save();
                return true;
            }

            // find by id
            // edit 
            // return 
        },

    }
}
import { isString, AdvertiseUpdateInputType, AdvertiseInputType, ProductsInputType, hasPermission, checkPermission, Offset } from "../tools";


export default {
    Query: {
        async advertises(parent, args: ProductsInputType, { models, request }, info) {
            console.time("advertises")
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const count = args.count ? parseInt(Offset[args.count]) : 15;
            const inPage = args.page ? args.page > 0 ? parseInt(`${args.page}`) : 0 : 0;
            const page = inPage > 0 ? inPage - 1 : 0;
            const Advertise = models.Advertise;
            let options = {
                deleted_at: null
            };
            if (checkPermission(request.user, "SHOP")) {
                options['status'] = 1;
            }
            if (checkPermission(request.user, "PROVIDER")) {
                options['status'] = 1;
            }
            const res1 = Advertise.find(options, null, {
                limit: count,
                skip: count * page,
                sort: { 'created_at': '-1' }
            });
            let res2 = Advertise.countDocuments(options);
            const advertise = await res1;
            const counts = await res2;
            const totalPages = counts / count
            const floor = Math.floor(totalPages);
            console.timeEnd("advertises");
            return {
                data: advertise,
                total: counts,
                totalData: advertise.length,
                totalPages: floor < totalPages ? floor + 1 : totalPages,
                limit: count,
                page: inPage,
                nextPage: ((inPage * count) < counts) ? inPage + 1 : 0,
                prevPage: inPage > 0 ? inPage - 1 : 0,
            };
        },
    },
    Mutation: {

        async  addAds(parent, args: AdvertiseInputType, { pubsub, models }, info) {
            // hasPermission(request.user, ["ADMIN"]);
            //find by name
            if (!isString(args.title)) {
                throw Error("نام Ads صحیح نمی باشد");
            }
            //new model
            const Advertise = models.Advertise;
            const find = await Advertise.findOne({ title: args.title });
            if (find) {
                throw Error("Ads تکراری می باشد");
            }
            let ads = new Advertise({
                title: args.title,
                link: args.link ? args.link : null,
                status: args.status ? args.status : 0,
                path: args.photo,
            });
            // save


            if (ads.save()) {
                pubsub.publish("newAdvertise", { newAdvertise: ads })
                return true;
            }
            throw Error("مشکلی در ثبت وجود امد");

        },
        async  editAds(parent, args: AdvertiseUpdateInputType, { request, models }, info) {
            //  hasPermission(request.user, ["ADMIN"]);

            //find by id
            const Advertise = models.Advertise;
            const ads = await Advertise.findById(args.id);
            if (!ads) {
                throw Error("Ads تکراری می باشد");
            }
            //save 
            if (args.title)
                ads.title = args.title;
            if (args.title)
                ads.path = args.photo;
            if (args.title)
                ads.link = args.link;
            if (args.status)
                ads.status = args.status;

            let en = new Advertise(ads);
            if (en.save()) {
                return true;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
        async  deleteAds(parent, args: AdvertiseUpdateInputType, { request, models }, info) {
            //   hasPermission(request.user, ["ADMIN"]);

            //find by id
            const Advertise = models.Advertise;
            const ads = await Advertise.findById(args.id);
            if (!ads) {
                throw Error("قیلا این تبلیغات رو حذف کردید");
            }
            //save 
            ads.deleted_at = new Date();
            let en = new Advertise(ads);
            if (en.save()) {
                return true;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
    },
    Subscription: {
        newAdvertise: {
            subscribe: (parent, args, { pubsub }) => {
                return pubsub.asyncIterator("newAdvertise")
            },
        }
    }
}
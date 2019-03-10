import { hasPermission, enCode, isMobile, isCode, SendSms, random, validProfile } from "../tools";

export default {
    Query: {
        async me(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const User = models.User;
            const user = await User.findById(request.user.id)
                .populate({
                    path: "categories",
                    populate: { path: "parent" }
                })
                .populate("profile.type_estate")
                .populate("profile.province")
                .populate("profile.city")
                .populate("profile.area")
                .exec();
            return user;
        },

        async users(parent, args, { request, models }, info) {
            // console.log("ddddd", request.user);
            hasPermission(request.user, ["ADMIN"]);
            const User = models.User;
            const user = await User.find().populate({
                path: "categories",
                populate: { path: "parent" }
            }).exec();
            // console.log("user", user);
            return user;
        },
    },
    Mutation: {
        async  upgradeToProvider(parent, args, { request, models }, info) {
            hasPermission(request.user, ["SHOP"]);
            const User = models.User;
            let user = await User.findById(request.userId);
            user.permission = ["PROVIDER"];
            const en = new User(user);
            const save = await en.save();
            if (save) {
                return true;
            } else {
                return false;
            }
        },
        async  userSignIn(parent, args, { models }) {
            //validation mobile
            if (!isMobile(args.mobile)) {
                throw Error("موبایل صحیح نمی باشد");
            }
            //find mobile
            const User = models.User;
            let user = await User.findOne({ mobile: args.mobile });
            if (!user) {
                throw Error("موبایل صحیح نمی باشد");
            }
            // send code
            const code = random(6);
            // save code
            user.sms_code = code;
            if (user.save()) {
                const sms = new SendSms();
                const response = await sms.verify(args.mobile, code);
                return true;
            } else {
                throw Error("موبایل صحیح نمی باشد");
            }

        },
        async  userSignUp(parent, args, { models }, info) {
            // validation mobile
            if (!isMobile(args.mobile)) {
                throw Error("موبایل صحیح نمی باشد");
            }
            //find mobile
            const User = models.User;
            const find = await User.findOne({ mobile: args.mobile });
            if (find) {
                throw Error("موبایل  تکراری است");
            }
            //save user
            let u = new User();
            u.firstName = args.firstName;
            u.lastName = args.lastName;
            u.mobile = args.mobile;
            u.permission = ["SHOP"];
            u.status = 0;
            const code = random(6);
            //save code 
            u.sms_code = code;
            if (u.save()) {
                const sms = new SendSms();
                const response = await sms.verify(args.mobile, code);
                return true
            } else {
                throw Error("موبایل صحیح نمی باشد");
            }
        },
        async  userVerify(parent, args, { models }, info) {
            //validation mobile and code
            if (!isMobile(args.mobile) || !isCode(args.code)) {
                throw Error("موبایل یا کد صحیح نمی باشد");
            }
            //find mobile , code
            const User = models.User;
            let myUser = await User.findOne({ mobile: args.mobile, sms_code: args.code });
            if (!myUser) {
                throw Error("موبایل یا کد صحیح نمی باشد");
            }
            //create token
            const user = {
                id: myUser._id,
                permission: myUser.permission,
                categories: myUser.categories,
            };
            const token = enCode(user);
            return {
                data: myUser,
                token,
            }
            //return user
        },
        // tslint:disable-next-line:typedef
        async  saveProfileShop(parent, args, { request, models }, info) {
            hasPermission(request.user, ["SHOP", "PROVIDER", "ADMIN"]);
            await validProfile(args);
            const User = models.User;
            let user = await User.findById(request.userId);

            if (!user) {
                throw Error("کاربر گرامی اطلاعات شما یافت نشد");
            }
            const Profile = models.Profile;
            let profile = user.profile ? user.profile : new Profile();
            if (args.postal_code) {
                profile.postal_code = args.postal_code;
            }
            if (args.shaba) {
                profile.shaba = args.shaba;
            }
            if (args.name) {
                profile.shop_name = args.name;
            }
            if (args.mali) {
                profile.mali = args.mali;
            }
            if (args.phone) {
                profile.phone = args.phone;
            }
            if (args.type_estate) {
                profile.type_estate = args.type_estate;
            }
            if (args.categories) {
                user.categories = args.categories;
            }
            if (args.address) {
                profile.address = args.address;
            }
            if (args.lat && args.long) {
                profile.location = {
                    lat: args.lat,
                    long: args.long,
                };
            }
            if (args.province) {
                profile.province = args.province;
            }
            if (args.city) {
                profile.city = args.city;
            }
            if (args.area) {
                profile.area = args.area;
            }

            user.status = 1;

            user.profile = profile;
            let v = new User(user);
            let p = await v.save();
            if (p) {
                return true;
            } else {
                return false;
            }

        },

    }
}; 
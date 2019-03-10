import { hasPermission, isString } from "../tools";
import { ObjectID } from "bson";

export default {
    Query: {

        async provinces(parent, args, { models, request }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const Province = models.Province;
            let options = {
                deleted_at: null
            };
            const provinces = await Province.find(options);
            return provinces;
        },
        async cities(parent, args, { models, request }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const City = models.City;
            const cities = await City.find({ province: args.province, deleted_at: null });
            return cities;
        },
        async areas(parent, args, { models, request }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const Area = models.Area;
            const areas = await Area.find({ city: args.city, deleted_at: null });
            return areas;
        },

    },
    Mutation: {

        async  newProvince(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //find by name
            if (!isString(args.name)) {
                throw Error("نام استان صحیح نمی باشد");
            }
            //new model
            const Province = models.Province;
            const find = await Province.findOne({ name: args.name });
            if (find) {
                throw Error("استان تکراری می باشد");
            }
            let province = new Province();
            // save
            province.name = args.name;

            if (province.save()) {
                return province;
            }
            throw Error("مشکلی در ثبت وجود امد");

        },
        async  editProvince(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //validation name
            if (!isString(args.name)) {
                throw Error("نام استان صحیح نمی باشد");
            }
            //find by id
            const Province = models.Province;
            const province = await Province.findById(args.id);
            if (!province) {
                throw Error("  استان پیدا نشد");
            }
            //save 
            province.name = args.name;
            let en = new Province(province);
            if (en.save()) {
                return province;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },

        async  newCity(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //find by name
            if (!isString(args.name)) {
                throw Error("نام شهر صحیح نمی باشد");
            }
            //new model
            const City = models.City;
            const find = await City.findOne({ name: args.name });
            if (find) {
                throw Error("شهر تکراری می باشد");
            }
            let city = new City();
            // save
            city.name = args.name;
            city.province = args.province;

            if (city.save()) {
                return city;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
        async  editCity(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //validation name
            if (!isString(args.name)) {
                throw Error("نام شهر صحیح نمی باشد");
            }
            //find by id
            const City = models.City;
            const city = await City.findById(args.id);
            if (!city) {
                throw Error("شهر یافت نشد");
            }
            //save 
            city.name = args.name;
            city.province = args.province;
            let en = new City(city);
            if (en.save()) {
                return city;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
        async  newArea(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //validation name
            if (!isString(args.name)) {
                throw Error("نام ناحیه صحیح نمی باشد");
            }
            //find by id
            const Area = models.Area;
            const find = await Area.findOne({ name: args.name, city: args.city });
            if (find) {
                throw Error("ناحیه تکراری می باشد");
            }
            let area = new Area();
            //save 
            area.name = args.name;
            area.province = args.province;
            area.city = args.city;

            if (area.save()) {
                return area;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
        async  editArea(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //validation name
            if (!isString(args.name)) {
                throw Error("نام ناحیه صحیح نمی باشد");
            }
            //find by id
            const Area = models.Area;
            const area = await Area.findById(args.id);
            if (!area) {
                throw Error("ناحیه یافت نشد");
            }
            //save 
            area.name = args.name;
            area.province = args.province;
            area.city = args.city;
            let en = new Area(area);
            if (en.save()) {
                return area;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
  // delete
  async  deleteProvince(parent, args: { id: ObjectID }, { request, models }, info) {
    hasPermission(request.user, ["ADMIN"]);
    //validation name
    //find by id
    const Entity = models.Province;
    const en = await Entity.findById(args.id);
    if (!en) {
        throw Error("دسته بندی یافت نشد");
    }
    en.deleted_at = `${new Date()}`;
    let em = new Entity(en);
    if (em.save()) {
        return true;
    }
    throw Error("مشکلی در ثبت وجود امد");
},
async  deleteCity(parent, args: { id: ObjectID }, { request, models }, info) {
    hasPermission(request.user, ["ADMIN"]);
    //validation name
    //find by id
    const Entity = models.City;
    const en = await Entity.findById(args.id);
    if (!en) {
        throw Error("دسته بندی یافت نشد");
    }
    en.deleted_at = `${new Date()}`;
    let em = new Entity(en);
    if (em.save()) {
        return true;
    }
    throw Error("مشکلی در ثبت وجود امد");
},
async  deleteArea(parent, args: { id: ObjectID }, { request, models }, info) {
    hasPermission(request.user, ["ADMIN"]);
    //validation name
    //find by id
    const Entity = models.Area;
    const en = await Entity.findById(args.id);
    if (!en) {
        throw Error("دسته بندی یافت نشد");
    }
    en.deleted_at = `${new Date()}`;
    let em = new Entity(en);
    if (em.save()) {
        return true;
    }
    throw Error("مشکلی در ثبت وجود امد");
},
    }
}
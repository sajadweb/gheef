import { hasPermission, CategoryInputType, TypeCategory, isString, CategorySaveInputType, CategoryUpdateInputType } from "../tools";
import { ObjectID } from "bson";

export default {
    Query: {
        async categories(parent, args: CategoryInputType, { models, request }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const Category = models.Category;
            let options = {
                deleted_at: null
            };
            if (args.type) {
                const type = TypeCategory[args.type];
                if (type === TypeCategory.Parent) {
                    options['parent'] = null;
                } else if (type === TypeCategory.Children) {
                    if (args.parent) {
                        options['parent'] = args.parent;
                    }
                }
            }
    
            const category = await Category.find(options).populate({
                path: "parent",
                populate: { path: "parent" }
            }).exec();
            return category;
        },
    },
    Mutation:{
        async  newCategory(parent, args: CategorySaveInputType, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //validation name
            if (!isString(args.title)) {
                throw Error("عنوان دسته بندی  صحیح نمی باشد");
            }
            //find by id
            const Category = models.Category;
            const find = await Category.findOne({ title: args.title });
            if (find) {
                throw Error("دسته بندی  تکراری می باشد");
            }
            //save 
            let category = new Category();
            category.title = args.title;
            category.parent = args.parent || null;
    
            if (category.save()) {
                return category;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
        async  editCategory(parent, args: CategoryUpdateInputType, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //validation name
            if (!isString(args.title)) {
                throw Error("عنوان دسته بندی  صحیح نمی باشد");
            }
            //find by id
            const Category = models.Category;
            const category = await Category.findById(args.id);
            if (!category) {
                throw Error("دسته بندی یافت نشد");
            }
            //save 
            category.title = args.title;
            category.parent = args.parent || null;
            let en = new Category(category);
            if (en.save()) {
                return category;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
        async  deleteCategory(parent, args: { id: ObjectID }, { request, models }, info) {
            hasPermission(request.user, ["ADMIN"]);
            //validation name
            //find by id
            const Category = models.Category;
            const category = await Category.findById(args.id);
            if (!category) {
                throw Error("دسته بندی یافت نشد");
            }
            category.deleted_at = `${new Date()}`;
            let en = new Category(category);
            if (en.save()) {
                return true;
            }
            throw Error("مشکلی در ثبت وجود امد");
        },
    }
}
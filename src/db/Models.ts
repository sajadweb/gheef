import User from "./User";
import Category from "./Category";
import { TypeEstate } from "./TypeEstate";
import Area from "./Area";
import Province from "./Province";
import City from "./City";
import Product from "./Product";
import Price from "./Price";
import Order from "./Order";
import SubOrder from "./SubOrder";
import Profile from "./Profile";
import Item from "./Item";
import Photo from "./Photo";
import Advertise from "./Advertise";



const UserModel = new User().getModelForClass(User);
const TypeEstateModel = new TypeEstate()
    .getModelForClass(TypeEstate, {
        schemaOptions: { collection: "type_estates" }
    });
const CategoryModel = new Category().getModelForClass(Category);
const AreaModel = new Area().getModelForClass(Area);
const ProvinceModel = new Province().getModelForClass(Province);
const CityModel = new City().getModelForClass(City);
const ProductModel = new Product().getModelForClass(Product);
const PriceModel = new Price().getModelForClass(Price,{
    schemaOptions: { collection: "prices" }
});
const OrderModel = new Order().getModelForClass(Order);
const SubOrderModel = new SubOrder().getModelForClass(SubOrder);
const PhotoModel = new Photo().getModelForClass(Photo);
const AdvertiseModel = new Advertise().getModelForClass(Advertise);

export const models = {
    User: UserModel,
    Category: CategoryModel,
    City: CityModel,
    Area: AreaModel,
    Province: ProvinceModel,
    Product: ProductModel,
    Price: PriceModel,
    Order: OrderModel,
    SubOrder: SubOrderModel,
    TypeEstate: TypeEstateModel,
    Profile: Profile,
    Item: Item,
    Photo: PhotoModel,
    Advertise: AdvertiseModel,

};
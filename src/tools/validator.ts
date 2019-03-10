export const findOneOrFail = async (entity: any, option: any): Promise<any> => {
    const en = await entity.findOneOrFail(entity, option);
    return en;
}
export const validProfile = async (args: any): Promise<any> => {
    if (args.postal_code) {
        if (args.postal_code.length>11) {
            throw new Error("کاریر گرامی کدپستی نباید بیشتر از 11 کارکنر باشد")
        }
    }
	if (args.categories) {
        if (args.categories.length <= 0) {
            throw new Error("کاریر گرامی دسته بندی نباید خالی باشد")
        }
   }else{
        throw new Error("کاریر گرامی دسته بندی نباید خالی باشد")
    }
    
    if (args.shaba) {
        if (args.shaba.length>21) {
            throw new Error("کاریر گرامی کدشبا نباید بیشتر از 21 کارکنر باشد")
        }
    }
   
    if (args.name) {
        if (args.name.length>255) {
            throw new Error("کاریر گرامی نام فروشگاه نباید بیشتر از 255 کارکنر باشد")
        }
        if (args.name.length<2) {
            throw new Error("کاریر گرامی نام فروشگاه نباید کمتر از 2 کارکنر باشد")
        }
    }else{
        throw new Error("کاریر گرامی نام فروشگاه نباید خالی باشد")
    }
   
    if (args.mali) {
        if (args.mali.length>10) {
            throw new Error("کاریر گرامی کدملی نباید بیشتر از 10 کارکنر باشد")
        }
        if (args.mali.length<10) {
            throw new Error("کاریر گرامی کدملی نباید کمتر از 10 کارکنر باشد")
        }
    }else{
        throw new Error("کاریر گرامی کدملی نباید خالی باشد")
    }
   
    if (args.phone) {
        if (args.phone.length>255) {
            throw new Error("کاریر گرامی شماره ثابت نباید بیشتر از 255 کارکنر باشد")
        }
    }
    if (args.type_estate) {
//TODO DATABASE
    }
    if (args.categories) {
//TODO DATABASE
    }else{
        throw new Error("کاریر گرامی دسته بندی نباید خالی باشد")
    }
    if (args.address) {
        if (args.address.length>1000) {
            throw new Error("کاریر گرامی آدرس نباید بیشتر از 1000 کارکنر باشد")
        }
    }
    if (args.province) {
//TODO DATABASE
    }else{
        throw new Error("کاریر گرامی استان نباید خالی باشد")
    }
    if (args.city) {
//TODO DATABASE
    }else{
        throw new Error("کاریر گرامی شهر نباید خالی باشد")
    }
    if (args.area) {
//TODO DATABASE
    }else{
        throw new Error("کاریر گرامی ناحیه نباید خالی باشد")
    }

}
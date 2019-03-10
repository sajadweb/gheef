import { hasPermission } from "../tools";

export default {
    Query: {
        async type_estates(parent, args, { request, models }, info) {
            hasPermission(request.user, ["ADMIN", "SHOP", "PROVIDER"]);
            const TypeEstate = models.TypeEstate;
            const type_estates = await TypeEstate.find();
            return type_estates;
        },
    },
    // Mutation:{
     
    // }
}
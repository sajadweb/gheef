// import * as Request from "request-promise";
import * as  Kavenegar from "kavenegar";

const kavenegarApi = Kavenegar.KavenegarApi({
    apikey: process.env.SMS_KEY
});

export class SendSms {
    token: number;
    template: string = "";
    async verify(mobile: number, code: number): Promise<boolean> {
        return await kavenegarApi.VerifyLookup({
            receptor: mobile,
            token: code,
            template: "verifyGheef"
        });
        // return Request.post(process.env.SMS_KEY).then((r) => {
        //     console.log("rrrrrrrrrrrr 1");
        //     return true;
        // }).catch(e => {
        //     // console.log("eeeeeee",);
        //     throw new Error(e);
        // });
    }

}

export function random(length: number) {
    if (isNaN(length)) {
        throw new Error("Length must be a number , generate-sms-verification-code/index.js")
    }
    if (length < 1) {
        throw new Error("Length must be at least 1 , generate-sms-verification-code/index.js")
    }
    let possible = "0123456789";
    let rand = "123456789";
    let string = rand.charAt(Math.floor(Math.random() * rand.length));; 
    for (let i = 0; i < length-1; i++) {
        const char=possible.charAt(Math.floor(Math.random() * possible.length));
        string += char; 
    }
   
    return parseFloat(string);
}
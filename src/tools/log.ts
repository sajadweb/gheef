export const Log = (key:string,value:any) => {
    console.log(`------------------start ${key}-------------------`)
    console.log(Date.now(),JSON.stringify(value))
    console.log(`------------------end ${key}-------------------`)
}
const { IncomingWebhook } = require('@slack/client');
export const LogCatch = (error:any) => {
    const {SLACK_TYPE,SLACK_DEV,SLACK_UAT}=process.env;
    const url = SLACK_TYPE=="DEV"?SLACK_DEV:SLACK_UAT;
    const webhook = new IncomingWebhook(url);
    webhook.send(error);
}

export const LogApi = (error:any) => {
    const {SLACK_API}=process.env; 
    const webhook = new IncomingWebhook(SLACK_API);
    webhook.send(error);
}
import * as JWT from "jsonwebtoken";
export function enCode(data: any) {
    return JWT.sign(data, process.env.APP_SECRET, { expiresIn: '30d' });
}
export function deCode(token: string): any {
    // return process.env.APP_SECRET;
    try {
        token = token.replace("Bearer", "");
        return JWT.verify(token.trim(), process.env.APP_SECRET);
    } catch (error) {
        return null;
    }

}
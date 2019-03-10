export function isMobile(mobile: string): boolean {
    if (/^09[0-9]{9}$/.test(mobile)) {
        return true;
    }
    return false;
}
export function isCode(code: any): boolean {
    if (/^[0-9]{6}$/.test(code) || /^[0-9]{5}$/.test(code) || /^[0-9]{4}$/.test(code)) {
        return true;
    }
    return false;
}

export function isString(str: any): boolean {
    if (str)
        if (str !== undefined)
            if (str.length > 0)
                return true;

    return false;
}
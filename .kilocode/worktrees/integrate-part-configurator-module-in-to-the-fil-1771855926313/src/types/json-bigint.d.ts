declare module 'json-bigint' {
    const JSONbig: {
        parse(text: string): any;
        stringify(obj: any): string;
        stringify(obj: any, replacer?: (key: string, value: any) => any, spaces?: string | number): string;
    };
    export = JSONbig;
}
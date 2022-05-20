//example one
declare module'*.scss';

//example two
declare module'*.scss' {
    const content: any;
    export default content;
}

//example three
declare module'*.scss' {
    const content: Record<string, string>;
    export default content;
}

//example four
declare module'*.scss' {
    const content: {[key: string]: any}
    export = content
}
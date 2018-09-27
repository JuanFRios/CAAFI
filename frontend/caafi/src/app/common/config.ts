export class Config {
    type: string;
    name: string;
    value: any;

    constructor(type: string, name: string, value: any) {
        this.type = type;
        this.name = name;
        this.value = value;
    }
}

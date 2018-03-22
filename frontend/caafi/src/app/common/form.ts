export class Form{
    name: string;
    path: string;
    template:string;
    config:any

    constructor( name: string, path: string,template:string,config:any){
        this.name = name;
        this.path = path;
        this.template=template;
        this.config=config;
    }
}
import { Form } from './form';

export class Dependencie{
    name: string;
	forms: Form[];
    
    constructor(name: string, forms: Form[]){
        this.name=name;
        this.forms = forms;
    }
}
import { Form } from './form';

export class Dependency {
    name: string;
	forms: Form[];
    
    constructor(name: string, forms: Form[]){
        this.name=name;
        this.forms = forms;
    }
}
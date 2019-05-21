import { Form } from './form';

export class Dependency {
    name: string;
    forms: Form[];
    formsReport: Form[];
    surveys: Form[];

    constructor(name: string, forms: Form[]) {
        this.name = name;
        this.forms = forms;
    }
}

export const form = [
    {
        'fieldGroupClassName' : 'display-flex',
        'fieldGroup' : [
            {
                'key' : 'semestre',
                'type' : 'input',
                'className' : 'flex-1',
                'templateOptions' : {
                    'type' : 'text',
                    'label' : 'Semestre',
                    'placeholder' : 'Semestre',
                    'required' : false,
                    'pattern' : /[0-9]+[1-2]{1}$/
                },
                'validation' : {
                    'messages' : {
                        'pattern' : (error, field) => `El campo ${field.templateOptions.label} debe ser de la forma: 20151`
                    }
                }
            }
        ]
    }
];

export const data = {};

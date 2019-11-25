export const form = [
    {
        'fieldGroupClassName' : 'display-flex',
        'fieldGroup' : [
            {
                'key' : 'tge-semestre',
                'type' : 'input',
                'className' : 'flex-1',
                'templateOptions' : {
                    'type' : 'text',
                    'label' : 'Semestre inicial',
                    'placeholder' : 'Semestre inicial',
                    'required' : false,
                    'pattern' : /[0-9]+-[1-2]{1}$/
                },
                'validation' : {
                    'messages' : {
                        'pattern' : (error, field) => `El campo ${field.templateOptions.label} debe ser de la forma: 2015-1`
                    }
                }
            },
            {
                'key' : 'tle-semestre',
                'type' : 'input',
                'className' : 'flex-1',
                'templateOptions' : {
                    'type' : 'text',
                    'label' : 'Semestre final',
                    'placeholder' : 'Semestre final',
                    'required' : false,
                    'pattern' : /[0-9]+-[1-2]{1}$/
                },
                'validation' : {
                    'messages' : {
                        'pattern' : (error, field) => `El campo ${field.templateOptions.label} debe ser de la forma: 2015-1`
                    }
                }
            }
        ]
    },
    {
        'fieldGroupClassName' : 'display-flex',
        'fieldGroup' : [
            {
                'key' : 'te-semestre',
                'type' : 'input',
                'className' : 'flex-1',
                'templateOptions' : {
                    'type' : 'text',
                    'label' : 'Semestre',
                    'placeholder' : 'Semestre',
                    'required' : false,
                    'pattern' : /[0-9]+-[1-2]{1}$/
                },
                'validation' : {
                    'messages' : {
                        'pattern' : (error, field) => `El campo ${field.templateOptions.label} debe ser de la forma: 2015-1`
                    }
                }
            }
        ]
    }
];

export const data = {};

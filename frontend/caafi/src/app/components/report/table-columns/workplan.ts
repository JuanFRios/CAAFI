export const tableColumns = {
    'idPlan': {name: 'Identificación del plan', type: 'text', visible: true},
    'documento': {name: 'Documento de identificación', type: 'text', visible: true},
    'nombre': {name: 'Apellidos y nombre del profesor', type: 'text', visible: true},
    'tipoEmpleado': {name: 'Tipo de vinculación', type: 'text', visible: true, function: getTipoVinculacionDesc},
    'dedicacion': {name: 'Dedicación', type: 'text', visible: true, function: getDedicacionDesc},
    'docencia': {name: 'Horas dedicadas a la docencia', type: 'text', visible: true},
    'otrasDocencias': {name: 'Otras actividades asociadas a la docencia', type: 'text', visible: true},
    'investigacion': {name: 'Horas dedicadas a la investigación', type: 'text', visible: true},
    'otrasInvestigaciones': {name: 'Otras horas dedicas a la investigación', type: 'text', visible: true},
    'extension': {name: 'Horas dedicadas a la extensión', type: 'text', visible: true},
    'otrasExtensiones': {name: 'Otras horas dedicadas a la extensión', type: 'text', visible: true},
    'admon': {name: 'Horas dedicadas a la administración', type: 'text', visible: true},
    'otras': {name: 'Otras', type: 'text', visible: true},
    //'idEstado': {name: 'id_estado', type: 'text', visible: false},
    //'codigoFacultad': {name: 'codfac', type: 'text', visible: false},
    //'idCentroCosto': {name: 'ccosto_pro', type: 'text', visible: false},
    //'centroCosto': {name: 'ccosto', type: 'text', visible: false},
    //'centroCostoDesc': {name: 'ccosto_desc', type: 'text', visible: false},
    'semestre': {name: 'Semestre académico', type: 'text', visible: true},
    'diasPlan': {name: 'Días del plan', type: 'text', visible: true}
};

function getTipoVinculacionDesc(codeTipoVinculacion) {
    if (codeTipoVinculacion === 'OCASI') {
        return 'Ocasional';
    } else if (codeTipoVinculacion === 'REGUL' || codeTipoVinculacion === 'ASPIR') {
        return 'Vinculado';
    }
}

function getDedicacionDesc(codeDedicacion) {
    if (codeDedicacion === 1) {
        return 'Tiempo completo';
    } else if (codeDedicacion === 0.5) {
        return 'Medio tiempo';
    }
}

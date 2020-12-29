/**
 * Class for variables
 */
class Variable {
    constructor (name, value, type, constant){
        this.name = name;
        this.value = value;
        this.type = type;
        this.constant = constant;
    };

    toString(){
        return `${this.constant ? 'const' : 'let'} ${this.name}: ${this.type} = ${this.value}`
    };
}

/**
 * Class that represents parameter
 */
class Parameter {
    constructor(name, type){
        this.name = name;
        this.type = type;
    }

    toString(){
        return `${this.name}: ${this.type.toString()}`;
    }
}

/**
 * Class that represents method
 */
class Method {
    constructor(name, parameters, returnType, body, isExport){
        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
        this.body = body;
        this.isExport = isExport;
    }

    toString(){
        return `${this.isExport ? 'export ' : ''}function ${this.name}(${this.parameters.map(param => param.toString()).join(',')}): ${this.returnType.toString()} {
        ${this.body}
    }`
    }
}

/**
 * Class that represents Namespace type in AS
 */
class Namespace {
    constructor(name, methods, isExport){
        this.name = name;
        this.methods = methods;
        this.isExport = isExport;
    }

    toString(){
        return `${this.isExport ? 'export ' : ''}namespace ${this.name} {
    ${this.methods.map(method => method.toString()).join('\n')}
}`;
    }

    addMethod(method){
        this.methods.push(method);
    }
}

/**
 * Array value
 */
class ArrayType {
    constructor(value){
        this.value = value;
    }

    toString(){
        return `[${this.value.toString()}];`;
    }
}

const namespace = (name, methods, isExport) => new Namespace(name, methods, isExport);
const method = (name, params, returnType, body, isExport) => new Method(name, params, returnType, body, isExport);
const param = (name, type) => new Parameter(name, type);
const variable = (name, value, type, constant) => new Variable(name, value, type, constant);
const arrayType = (value) => new ArrayType(value);

module.exports = {
    namespace,
    method,
    param,
    variable,
    arrayType
};

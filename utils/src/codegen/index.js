const INDENTATION = " ".repeat(4);

class ReturnType {
    constructor(value) {
        this.value = value;
    }
    
    toString() {
        return `return ${this.value};`;
    }
}

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
 * Class that represents Enum in AS
 */
class EnumType {
    constructor(name, members, isExport) {
        this.name = name;
        this.members = members;
        this.isExport = isExport;
    }
    
    toString() {
        return `
${this.isExport ? 'export ' : ''}enum ${this.name} {
${this.members.map(([name, value]) => `${INDENTATION}${name} = ${value}`).join(', \n')
}
}`
    };

    toSwitchCase() {
        return switchCase(`${this.name.toLowerCase()}Type`, this.members.map(([name, value]) => [name, returnType(value).toString()])).toString();
    }

    addMember(member) {
        this.members.push(member);
    }
}

class SwitchCase {
    constructor (type, members){
        this.type = type;
        this.members = members;
    }

    toString() {
        return `switch(${this.type}) {
${this.members.map(([name, value]) => {
    return `${INDENTATION}case ${name}:
${INDENTATION.repeat(2)}${value.toString()}`;
}).join('\n')}
}`;
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

class Call {
    constructor(method, call, args) {
        this.method = method;
        this.call = call;
        this.args = args;
    }

    toString() {
        return `${this.method}.${this.call}(${this.args.map(arg => arg).join(', ')});`
    }
}

class BytesReader {
    constructor(bytes, index, type){
        this.bytes = bytes;
        this.index = index;
        this.type = type;
    }

    toString() {
        return `BytesReader.decodeInto<${this.index}>(${this.bytes}, ${this.index});`;
    }
}

const namespace = (name, methods, isExport) => new Namespace(name, methods, isExport);
const method = (name, params, returnType, body, isExport) => new Method(name, params, returnType, body, isExport);
const param = (name, type) => new Parameter(name, type);
const variable = (name, value, type, constant) => new Variable(name, value, type, constant);
const arrayType = (value) => new ArrayType(value);
const eNum = (name, members, isExport) => new EnumType(name, members, isExport);
const call = (method, call, args) => new Call(method, call, args);
const bytesReader = (bytes, index, type) => new BytesReader(bytes, index, type);
const switchCase = (type, members) => new SwitchCase(type, members);
const returnType = (value) => new ReturnType(value);

module.exports = {
    namespace, method, param, variable, switchCase,
    arrayType, eNum, call, bytesReader
};

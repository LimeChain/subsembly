const INDENTATION = " ".repeat(4);

const polkadotTypes = require("../metadata/types.json");

function _reverseObject(obj) {
    return Object.keys(obj).reduce((r, k) => 
        Object.assign(r, { [obj[k]]: k }, {})
    )
}

const subsemblyTypes = _reverseObject(polkadotTypes);

class Import {
    constructor(from, types) {
        this.from = from;
        this.types = types;
    }

    toString() {
        return `import { ${this.types.map(type => type.toString()).join(', ')} } from "${this.from}";`;
    }
}

class ReturnType {
    constructor(value, indent) {
        this.value = value;
        this.indent = indent;
    }
    
    toString() {
        return `${INDENTATION.repeat(this.indent)}return ${this.value.toString()}`;
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
        return `${this.constant ? 'const' : 'let'} ${this.name}: ${this.type} = ${this.value.toString()}`
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
    constructor (type, members, indent, defaultReturn){
        this.type = type;
        this.members = members;
        this.indent = indent;
        this.defaultReturn = defaultReturn;
    }

    closingBrace(indent){
        return `${INDENTATION.repeat(indent)}}`
    }

    toString() {
        return `switch(${this.type}) {
${this.members.map(([name, value]) => {
    return `${INDENTATION.repeat(this.indent)}case ${name}: {
${INDENTATION.repeat(this.indent + 1)}${value.toString()}\n${this.closingBrace(this.indent)}`;}).join('\n')}
${INDENTATION.repeat(this.indent)}default: {
${INDENTATION.repeat(this.indent + 1)}${this.defaultReturn.toString()}
${this.closingBrace(this.indent)}
${this.closingBrace(this.indent - 1)}`;
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
    constructor(module, call, args, indent) {
        this.module = module;
        this.call = call;
        this.args = args;
        this.indent = indent;
    }

    toString() {
        return `${INDENTATION.repeat(this.indent)}${this.module}.${this.call}(${this.args.map(arg => arg).join(', ')});`
    }
}

class BytesReader {
    constructor(bytes, index = 0, args, indent){
        this.bytes = bytes;
        this.index = index;
        this.args = args;
        this.indent = indent;
    }

    toString() {
            return this.args.length ? `let bytesReader = new BytesReader(${this.bytes});
${this.args.map((arg) => `${INDENTATION.repeat(this.indent)}const ${arg.name} = bytesReader.readInto<${subsemblyTypes[arg.type]}>();`).join('\n')}` : ``;
    }
}

const namespace = (name, methods, isExport) => new Namespace(name, methods, isExport);
const method = (name, params, returnType, body, isExport) => new Method(name, params, returnType, body, isExport);
const param = (name, type) => new Parameter(name, type);
const variable = (name, value, type, constant) => new Variable(name, value, type, constant);
const arrayType = (value) => new ArrayType(value);
const eNum = (name, members, isExport) => new EnumType(name, members, isExport);
const call = (module, call, args, indent) => new Call(module, call, args, indent);
const bytesReader = (bytes, index, args, indent) => new BytesReader(bytes, index, args, indent);
const switchCase = (type, members, indent, defaultReturn) => new SwitchCase(type, members, indent, defaultReturn);
const returnType = (value, indent) => new ReturnType(value, indent);
const importer = (from, types) => new Import(from, types);

module.exports = {
    namespace, method, param, variable, switchCase,
    arrayType, eNum, call, bytesReader, returnType, importer
};

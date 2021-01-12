const { eNum, namespace, call, returnType, switchCase, 
    method, param, bytesReader, importer } = require("./codegen");
const metadata = require('../metadata.json');
const { modules } = metadata.metadata.V12;

class DispatcherHelpers {
    static indentLevel = 1;
    static typesToImport = [];

    static getImports(pallets) {
        console.log(pallets);
        const palletNames = pallets.members.map(([name, _value]) => name);
        const scaleCodecImports = importer('as-scale-codec', ['BytesReader']).toString();
        const palletImports = importer('../pallets', palletNames).toString();
        const runtimeImports = importer('../runtime', ['Balance', 'Moment']).toString();
        const subsemblyCoreImports = importer('subsembly-core', ["AccountId", "Call", "ResponseCodes"]).toString();

        return [scaleCodecImports, palletImports, runtimeImports, subsemblyCoreImports].join('\n');
    }
    
    /**
     * Initializes BytesReader and decodes bytes to argument types
     * @param call 
     */
    static _generateCallBody(call) {
        const newTypes = call.args.filter(arg => !this.typesToImport.includes(arg.type));
        this.typesToImport = this.typesToImport.concat(newTypes);
        return bytesReader('call.args', 0, call.args, this.indentLevel + 5).toString();
    }
    /**
     * Generate enums for modules and calls
     */
    static generateEnums(modules) {
        const pallets = eNum("Pallets", [], true);
        const moduleCalls = [];

        modules.forEach((module, index) => {
            pallets.addMember([module.name, index]);
            if (module.calls) {
                const calls = [];
                module.calls.forEach((call, index) => {
                    calls.push([call.name, index]);
                });
                moduleCalls.push(eNum(`${module.name}Calls`, calls, false));
            };
        });
        return {
            pallets,
            moduleCalls
        }
    }

    /**
     * Get return statement for a call, depending on the return type.
     * Return type of the dispatch() is u8[]
     * @param {*} module 
     * @param {*} method 
     */
    static _getReturnStatement(module, method) {
        const callArgs = method.args.map(arg => arg.name);
        switch(method.type) {
            case 'void':
                const methodCall = call(module.replace("Call", ""), method.name, callArgs, this.indentLevel + 5);
                return methodCall.toString().concat("\n", returnType('ResponseCodes.SUCCESS;', this.indentLevel + 5).toString());
            case 'Vec<u8>':
                return returnType(call(module.replace("Call", ""), method.name, callArgs), this.indentLevel + 5).toString();
            default:
                return returnType(call(module.replace("Call", ""), `${method.name}.toU8a`, callArgs), this.indentLevel + 5).toString();
        }
    }

    /**
     * Generate the switch statement for calls of the module
     * @param {*} module 
     * @param {*} calls 
     */
    static _generateSwitchCall(module, calls) {
        const members = [];
        calls.forEach((method) => {
            const body = this._generateCallBody(method);
            members.push([`${module}.${method.name}`, body + "\n" + this._getReturnStatement(module, method)]);
        })
        return switchCase("call.callIndex[1]", members, this.indentLevel + 4);
    }

    /**
     * Generate body of the dispatch() function
     * @param {} modules 
     */
    static generateBody(pallets) {
        const palletMembers = [];

        pallets.members.forEach(([name, value]) => {
            const [module] = modules.filter((module) => module.name === name);
            if(module.calls){
                palletMembers.push([`Pallets.${name}`, this._generateSwitchCall(name, module.calls)]);
            }
        })
        return switchCase("call.callIndex[0]", palletMembers, this.indentLevel + 2).toString();
    }

    static generateNamespace(pallets) {
        const callParam = param('call', 'Call');
        const dispatch = method('dispatch', [callParam], 'u8[]', this.generateBody(pallets), true);
        return namespace('Dispatcher', [dispatch], true).toString()
    }

    static generateFile(modules) {
        const { pallets, moduleCalls } = this.generateEnums(modules);
        const imports = this.getImports(pallets);
        const enums = pallets.toString().concat('\n', moduleCalls.map(module => module.toString()).join('\n'));
        const dispatcher = this.generateNamespace(pallets);
        return [imports, enums, dispatcher].join('\n');
    }
}

// console.log(DispatcherHelpers.generateNamespace(modules));
console.log(DispatcherHelpers.generateFile(modules));

// module.exports = function generateDispatcher() {

// }
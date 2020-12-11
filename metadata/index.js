const ts = require('typescript');

function makeMetadataModule() {
    const namespaceName = ts.factory.createIdentifier("Metadata");



    return ts.factory.createModuleDeclaration(
        undefined,
        ts.SyntaxKind.ExportKeyword,
        "Metadata",

    );
}

function _makeMetadataFunction(){
    const functionName = ts.factory.createIdentifier("metadata");
    const variableName = ts.factory.createVariableDeclaration(
        "metadataU8a",
        undefined,
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.ArrayType),
        
        );
}
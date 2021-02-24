const path = require('path');
class Constants {
    static INIT_IGNORE = [
        /cli/,
        /insert-aura/,
        /test-node/,
        /Makefile/,
        /README.md/,
        /images/,
        /build.js/,
        /utils/,
        /.github/,
        /tests/,
        /scripts/
    ];
    static TEST_GEN_PATH = path.join(__dirname, './test-gen');
}

module.exports = Constants;
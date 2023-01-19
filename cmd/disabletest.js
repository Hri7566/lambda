const { LambdaCommand } = require('../build/LambdaCommandHandler');

module.exports = new LambdaCommand('disabletest', ['disabletest'], 'general', ['default'], (msg, cl) => {
    return `This command should not run.`
}, false);

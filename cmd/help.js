const { LambdaCommand } = require('../build/LambdaCommandHandler');
const { LambdaCommandHandler } = require('../build/LambdaCommandHandler');

module.exports = new LambdaCommand('help', ['help'], 'general', ['default'], (msg, cl) => {
    let out = 'Commands:';
    
    for (let cmd of LambdaCommandHandler.commands) {
        if (!cmd.visible) continue;
        out += ` ${cmd.aliases[0]} |`;
    }

    out = out.substring(0, out.length - 1).trim();

    return out;
}, true);

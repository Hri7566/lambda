const { LambdaCommand } = require('../build/LambdaCommandHandler');

module.exports = new LambdaCommand('about', ['about'], 'general', ['default'], (msg, cl) => {
    return `This bot is property of the Black Mesa Research Facility.`
}, true);

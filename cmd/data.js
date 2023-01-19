const { LambdaCommand } = require('../build/LambdaCommandHandler');
const { LambdaData } = require('../build/LambdaData');

module.exports = new LambdaCommand('data', ['data'], 'general', ['default'], async (msg, cl) => {
    let user = await LambdaData.getUser(msg.p._id);
    LambdaData.logger.debug(user);
    return `name: ${user.name} | _id: ${user._id} | color: ${user.color}`;
}, false);

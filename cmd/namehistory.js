const { LambdaCommand } = require('../build/LambdaCommandHandler');
const { LambdaData } = require('../build/LambdaData');

module.exports = new LambdaCommand('namehistory', ['namehistory', 'nh'], 'general', ['default'], async (msg, cl) => {
    let nh = await LambdaData.getNameHistory(msg.p._id);
    LambdaData.logger.debug(nh);
    // return `names: ${nh.join(' ')}`;
}, false);

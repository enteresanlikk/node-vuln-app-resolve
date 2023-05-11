const fs = require('fs');
const path = require('path');

module.exports = {
    contentToFile: (content, fileName) => {
        const filePath = path.join(__dirname, 'files', fileName);

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, Buffer.from(content, 'base64'), (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve(filePath);
            });
        });
    }
}
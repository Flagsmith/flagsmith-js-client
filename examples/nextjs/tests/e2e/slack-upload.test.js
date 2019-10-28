// const fs = require('fs');
// const Slack = require('node-slack-upload');
//
// const SLACK_TOKEN = process.env.SLACK_TOKEN;
// let slack;
// if (SLACK_TOKEN) {
//     slack = new Slack(SLACK_TOKEN);
// }
//
// module.exports = function (path, initialComment, channels, title) {
//     return new Promise((resolve) => {
//         slack.uploadFile({
//             file: fs.createReadStream(path),
//             filetype: 'auto',
//             title,
//             initialComment,
//             channels,
//         }, (err, data) => {
//             if (err) {
//                 resolve({ err });
//             } else {
//                 resolve({ data });
//             }
//         });
//     });
// };

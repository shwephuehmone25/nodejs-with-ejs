const fs = require("fs");

const fileDelete =  () => {
    fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log("file was deleted");
      });
    };

module.exports= fileDelete;
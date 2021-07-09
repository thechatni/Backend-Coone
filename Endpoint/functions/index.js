const functions = require("firebase-functions");
const os = require("os");
const path = require("path");
const spawn = require("child-process-promise").spawn;
const cors = require("cors")({ origin: true });
const Busboy = require("busboy");
const fs = require("fs");

const gcconfig = {
  projectId: "fir-cloud-587c5",
  keyFilename: "fir-cloud-587c5-firebase-adminsdk-cniu3-add81399bb",
};

const { Storage } = require("@google-cloud/storage");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.onFileChange = functions.storage.object().onFinalize((event) => {
  //   console.log(event);
  //   const object = event;
  //   const bucket = object.bucket;
  //   const contentType = object.contentType;
  //   const filePath = object.name;
  //   console.log("File change detected, function started");
  //   if (path.basename(filePath).startsWith("resized-")) {
  //     console.log("We already resized that file.");
  //     return;
  //   }
  //   const gcs = new Storage();
  //   const destBucket = gcs.bucket(bucket);
  //   const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
  //   const metadata = { contentType: contentType };
  //   return destBucket
  //     .file(filePath)
  //     .download({
  //       destination: tmpFilePath,
  //     })
  //     .then(() => {
  //       return spawn("convert", [tmpFilePath, "-resize", "500x500", tmpFilePath]);
  //     })
  //     .then(() => {
  //       return destBucket.upload(tmpFilePath, {
  //         destination: "resized-" + path.basename(filePath),
  //         metadata: metadata,
  //       });
  //     });
});

exports.uploadFile = functions.https.onRequest((req, res) => {
  const gcs = new Storage();
  cors(req, res, () => {
    const busboy = new Busboy({ headers: req.headers });

    let uploadData = null;
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename);
      uploadData = { file: filepath, type: mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("finish", () => {
      const bucket = gcs.bucket("fir-cloud-587c5.appspot.com");
      bucket
        .upload(uploadData.file, {
          uploadType: "media",
          metadata: {
            metadata: {
              contentType: uploadData.type,
            },
          },
        })
        .then(() => {
          res.status(200).json({
            message: "It worked!",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
    busboy.end(req.rawBody);
  });
});

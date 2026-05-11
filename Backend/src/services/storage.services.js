const upload = require("../middlewares/upload.middleware");

const ImageKit = require("@imagekit/nodejs").default;

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async ({ buffer, filename, folder = "" }) => {
  const file = await client.files.upload({
    file: await ImageKit.toFile(Buffer.from(buffer), "file"),
    fileName: filename,
    folder,
  });

  return file;
};

module.exports = { uploadFile };

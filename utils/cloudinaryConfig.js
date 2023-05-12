const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const pdf2img = require("pdf2img");

cloudinary.config({
  cloud_name: "dr3itqqen",
  api_key: "856214682239797",
  api_secret: "7_bvUYCvIjGx_WiKWpGjYp6Kuo4",
});

async function uploadCVGetUrl(studentId, filePath) {
  try {
    const publicId = `${studentId}_CV`;
    console.log("hi");
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
    });
    console.log("bye");

    // Delete the file from disk storage
    fs.unlink(filePath, (error) => {
      if (error) {
        console.log(`Error deleting file: ${error}`);
      } else {
        //console.log(`File deleted: ${file.path}`);
      }
    });

    return result.secure_url;
  } catch (error) {
    console.log(`Error uploading file: ${error}`);
    throw new Error("Failed to upload file");
  }
}

module.exports = { uploadCVGetUrl };

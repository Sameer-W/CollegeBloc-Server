const pinataApiKey = "b0bbb0a50748e181fb10";
const pinataSecretApiKey =
  "e2bad070444af44efda59d5f9cd9bb6185b467ff0cbbd2c00ba622c9e9d5ed69";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMTYzOTg3NC05YmI5LTQ3MTktYTM1MC03NDNlNGIxOWM3NTEiLCJlbWFpbCI6ImZhcGF5OTQ4NTJAanRob3Zlbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjBiYmIwYTUwNzQ4ZTE4MWZiMTAiLCJzY29wZWRLZXlTZWNyZXQiOiJlMmJhZDA3MDQ0NGFmNDRlZmRhNTlkNWY5Y2Q5YmI2MTg1YjQ2N2ZmMGNiYmQyYzAwYmE2MjJjOWU5ZDVlZDY5IiwiaWF0IjoxNjgwNzY0NTc5fQ.m0ynYfghVoCxMLhAd8K9XyhCkQz0fmOkQWD-ficlSKM";

const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function uploadBufferToPinata(fileBuffer, fileName) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const data = new FormData();

  data.append("file", fileBuffer, {
    filepath: fileName,
  });

  const response = await axios.post(url, data, {
    maxContentLength: "Infinity",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      // pinata_api_key: pinataApiKey,
      // pinata_secret_api_key: pinataSecretApiKey,
      authorization: `Bearer ${JWT}`,
    },
  });

  return response.data.IpfsHash;
}

async function uploadToPinata(src) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const formData = new FormData();

  const file = fs.createReadStream(src);
  formData.append("file", file);

  const response = await axios.post(url, formData, {
    maxContentLength: "Infinity",
    headers: {
      "Content-Type": `multipart/form-data`,
      // pinata_api_key: pinataApiKey,
      // pinata_secret_api_key: pinataSecretApiKey,
      authorization: `Bearer ${JWT}`,
    },
  });

  return response.data.IpfsHash;
}

module.exports = { uploadBufferToPinata, uploadToPinata };

// module.exports = {
//   host: "api.pinata.cloud/pinning/pinFileToIPFS",

//   protocol: "https",
//   headers: {
//     pinata_api_key: pinataApiKey,
//     pinata_secret_api_key: pinataSecretApiKey,
//     authorization: `Bearer ${JWT}`,
//   },
// };

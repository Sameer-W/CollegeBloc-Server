const pinataApiKey = "7bd46972694ce9ac0ac0";
const pinataSecretApiKey =
  "53cc95c27669c02d2d900ba4c3e49db6db3d5e1bffe68b124124b66f44c04bef";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZDNlNDU4Yy00MzgwLTRjYTQtOTk3NS1lNjc5NTRmZWYwYWUiLCJlbWFpbCI6InNhbWVlci53QHNvbWFpeWEuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjdiZDQ2OTcyNjk0Y2U5YWMwYWMwIiwic2NvcGVkS2V5U2VjcmV0IjoiNTNjYzk1YzI3NjY5YzAyZDJkOTAwYmE0YzNlNDlkYjZkYjNkNWUxYmZmZTY4YjEyNDEyNGI2NmY0NGMwNGJlZiIsImlhdCI6MTY4MDA3MzQzM30.FIUtk5z_WmvTeH0YHeA9afs7uM956MyRXoygkQsLL_g";

const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function uploadToPinata(fileBuffer, fileName) {
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

module.exports = { uploadToPinata };

// module.exports = {
//   host: "api.pinata.cloud/pinning/pinFileToIPFS",

//   protocol: "https",
//   headers: {
//     pinata_api_key: pinataApiKey,
//     pinata_secret_api_key: pinataSecretApiKey,
//     authorization: `Bearer ${JWT}`,
//   },
// };

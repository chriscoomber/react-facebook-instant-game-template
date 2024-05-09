import request from "request";
import open from "open";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { execSync } from "child_process";

config({ path: [".env.local", ".env"] });
const { FB_UPLOAD_TOKEN, FB_APP_ID } = process.env;

const CURRENT_GIT_COMMIT = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

const PROJECT_DIR_PATH = path.resolve();
const BUILD_DIR_PATH = path.join(PROJECT_DIR_PATH, "build");
const ARCHIVE_FILE_PATH = path.join(
  BUILD_DIR_PATH,
  `build-${CURRENT_GIT_COMMIT}.zip`
);

// Cleanup previous
fs.mkdirSync(BUILD_DIR_PATH, { recursive: true });
if (fs.existsSync(ARCHIVE_FILE_PATH)) {
  fs.unlinkSync(ARCHIVE_FILE_PATH);
}

// Make .zip
const output = fs.createWriteStream(ARCHIVE_FILE_PATH);

console.log("Zip build dir to build.zip...");
const archive = archiver("zip", { zlib: { level: 9 } });
archive.on("error", (err) => {
  throw err;
});
archive.directory(BUILD_DIR_PATH);
archive.pipe(output);
archive.finalize();

// Upload
output.on("close", () => {
  console.log("build.zip ready");
  console.log("Send build.zip...");

  upload(ARCHIVE_FILE_PATH, FB_APP_ID, FB_UPLOAD_TOKEN)
    .then(() => {
      console.log("Success");
      return Promise.resolve("Success");
    })
    .catch((error) => {
      console.log("Failure. " + error);
      return Promise.reject("Failure. " + error);
    });
});

/*
 * Attempts to upload archive to the Application's web hosting
 */
function upload(archivePath, appId, uploadToken) {
  const archiveFilename = path.relative(
    path.join(archivePath, ".."),
    archivePath
  );
  return new Promise(function (resolve, reject) {
    console.log("Uploading archive: " + archivePath);
    request.post(
      {
        url: "https://graph-video.facebook.com/" + appId + "/assets",
        formData: {
          access_token: uploadToken,
          type: "BUNDLE",
          comment: `Uploaded via upload.mjs`,
          asset: {
            value: fs.createReadStream(archivePath),
            options: {
              filename: archiveFilename,
              contentType: "application/octet-stream",
            },
          },
        },
      },
      function (error, response, body) {
        if (error || !body) reject(error);
        try {
          var jsonResponse = JSON.parse(response.body);
          if (jsonResponse.success) {
            const openUrl =
              "https://developers.facebook.com/apps/" +
              appId +
              "/instant-games/hosting/?use_case_enum=INSTANT_GAMES";

            console.log("Bundle uploaded via the graph API");
            console.log("Don't forget you need to publish the build");
            console.log("Opening developer dashboard...");
            return open(openUrl).then(resolve);
          } else {
            reject(new Error("Unexpected API response: " + response.body));
          }
        } catch (e) {
          reject(new Error("Upload failed. " + e.message));
        }
      }
    );
  });
}

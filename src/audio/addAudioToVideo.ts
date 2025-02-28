import fs from 'fs';
import  path  from 'path';
import { exec } from "child_process";

export const addAudioToVideo = async (
  videoFile: string,
  audioFile: string
): Promise<void> => {
  const videoFileNoExtension = path.basename(videoFile, path.extname(videoFile));
  const convert = new Promise<void>((resolve, reject) => {
    const ffmpegCommand = `ffmpeg -i ${videoFile} -i ${audioFile}/combined.mp3 -c:v copy -map 0:v:0 -map 1:a:0 -shortest ./video/final.mp4 -y`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ffmpeg command: ${error.message}`);
        reject(error);
      } else {
        console.log(`FFmpeg command executed successfully.`);
        resolve();
      }
    });
  });
  await convert;
  // TODO: doesn't work - adds black to beginning of video
  // // now trim off first 500ms of final.mp4
  // const trim = new Promise<void>((resolve, reject) => {
  //   const ffmpegCommand = `ffmpeg -i ./video/final.mp4 -ss 0.5 -c copy ./video/final-trimmed.mp4 -y`;

  //   exec(ffmpegCommand, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`Error executing ffmpeg command: ${error.message}`);
  //       reject(error);
  //     } else {
  //       console.log(`FFmpeg command executed successfully.`);
  //       resolve();
  //     }
  //   });
  // });
  // await trim;
  // now get rid of final by renaming it and overwriting the original video file
  fs.renameSync('./video/final.mp4', `./video/${videoFileNoExtension}.mp4`);
  console.log(`Video file ${videoFileNoExtension}.mp4 created successfully.`);
};

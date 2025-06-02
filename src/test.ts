import { pullYoutubeTranscript } from "./pull-data/utils/pull-youtube"

const video = "https://www.youtube.com/watch?v=cI1SotLa7Wg"

async function test() {

  const data = await pullYoutubeTranscript(video)
  console.log(JSON.stringify(data, null, 2));

}

test()
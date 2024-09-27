import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1860333",
  key: "ace56b1c7cdf9da32a14",
  secret: "5ec0c8b337df74262d07",
  cluster: "us2",
  useTLS: true,
});

export const pusherClient = new PusherClient("ace56b1c7cdf9da32a14", {
  cluster: "us2",
});

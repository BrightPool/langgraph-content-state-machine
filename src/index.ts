import { createGraph } from "./graph";
import "dotenv/config";
// import fs from "fs";

const main = async (topic: string = "Data engineering") => {
  const graph = await createGraph();
  const events = [];

  const eventStream = graph.streamEvents(
    {
      numberOfIterations: 0,
      topic: topic,
      finalContentBrief: "",
    },
    {
      version: "v1",
    }
  );

  for await (const event of eventStream) {
    events.push(event);
  }

  // Save the events to a file:
  // fs.writeFileSync("events.json", JSON.stringify(events, null, 2));

  // Print the events to the console:
  console.log(events);
};

main();

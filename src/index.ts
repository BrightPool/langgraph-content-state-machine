import { createGraph } from "./graph";
import "dotenv/config";
import { GraphType } from "./types";
// import fs from "fs";

const main = async (
  topic: string = "Data engineering",
  graphType: GraphType = GraphType.BlogGeneration
) => {
  const graph = await createGraph(graphType);
  const events = [];

  const eventStream = graph.streamEvents(
    {
      numberOfBriefIterations: 0,
      topic: topic,
      finalContentBrief: "",
    },
    {
      version: "v1",
      recursionLimit: 100,
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

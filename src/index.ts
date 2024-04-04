import { createGraph } from "./graph";
import "dotenv/config";
import { GraphType } from "./types";
import { AgentState } from "./types";
import fs from "fs";

const main = async (
  topic: string = "Data engineering",
  graphType: GraphType = GraphType.BlogGeneration
) => {
  const graph = await createGraph(graphType);

  const result = (await graph.invoke(
    {
      numberOfBriefIterations: 0,
      topic: topic,
      finalContentBrief: "",
    },
    {
      recursionLimit: 100,
    }
  )) as AgentState;

  if (graphType === GraphType.BlogGeneration) {
    fs.writeFileSync("data/blog_post.md", result.latestBlogPost as string);
  } else {
    fs.writeFileSync("data/content_brief.md", result.latestBrief as string);
  }

  // Use the eventStream if you want!
  // const events = [];

  // const eventStream = graph.streamEvents(
  //   {
  //     numberOfBriefIterations: 0,
  //     topic: topic,
  //     finalContentBrief: "",
  //   },
  //   {
  //     version: "v1",
  //     recursionLimit: 100,
  //   }
  // );

  // for await (const event of eventStream) {
  //   events.push(event);
  // }

  // Save the events to a file:
  // fs.writeFileSync("events.json", JSON.stringify(events, null, 2));
};

main();

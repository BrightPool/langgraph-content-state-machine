import { createGraph } from "./graph";
import "dotenv/config";

const main = async () => {
  const runnable = await createGraph();
  const result = await runnable.invoke({
    numberOfIterations: 0,
    topic: "Data engineering",
    finalContentBrief: "",
  });
  console.log(`This is the final result`, result);
};

main();

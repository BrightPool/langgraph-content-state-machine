import { createContentWorkflow } from "./graph";
import "dotenv/config";

const main = async () => {
  const runnable = await createContentWorkflow();
  const result = await runnable.invoke({
    numberOfIterations: 0,
    topic: "Data engineering",
  });
  console.log(`This is the final result`, result);
};

main();

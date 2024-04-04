import type { StreamEvent } from "@langchain/core/dist/tracers/log_stream";

const resetStateForNewRun = (
  event: StreamEvent,
  resetBriefs: () => void,
  resetBlogPosts: () => void
) => {
  if (event.event === "on_llm_start") {
    if (event.metadata.step === "briefGeneration") {
      resetBriefs();
    } else if (event.metadata.step === "blogPostGeneration") {
      resetBlogPosts();
    }
  }
};

export const parserEventsStream = (
  events: StreamEvent[],
  resetBriefs: () => void,
  resetBlogPosts: () => void,
  setBriefs: (briefs: any) => void,
  setBlogPosts: (blogPosts: any) => void
) => {
  for (const event of events) {
    resetStateForNewRun(event, resetBriefs, resetBlogPosts);

    // Event parsing and updating the state:
    if (event.metadata && event.metadata.step && event?.data?.chunk) {
      switch (event.metadata.step) {
        case "briefGeneration":
          setBriefs((prevBriefs: string) => {
            return prevBriefs + event.data.chunk;
          });

          break;
        case "blogPostGeneration":
          setBlogPosts((prevBlogPosts: string) => {
            return prevBlogPosts + event.data.chunk;
          });
          break;
        default:
          // Handle other steps or ignore
          break;
      }
    }
  }
};

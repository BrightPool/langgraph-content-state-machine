"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
require("dotenv/config");
const types_1 = require("./types");
const fs_1 = __importDefault(require("fs"));
const main = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (topic = "Data engineering", graphType = types_1.GraphType.BlogGeneration) {
    const graph = yield (0, graph_1.createGraph)(graphType);
    const result = (yield graph.invoke({
        numberOfBriefIterations: 0,
        topic: topic,
        finalContentBrief: "",
    }, {
        recursionLimit: 100,
    }));
    if (graphType === types_1.GraphType.BlogGeneration) {
        fs_1.default.writeFileSync("data/content_brief.md", result.latestBrief);
        fs_1.default.writeFileSync("data/blog_post.md", result.latestBlogPost);
    }
    else {
        fs_1.default.writeFileSync("data/content_brief.md", result.latestBrief);
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
});
main();

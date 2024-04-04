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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const graph = yield (0, graph_1.createGraph)();
    const events = [];
    const eventStream = graph.streamEvents({
        numberOfIterations: 0,
        topic: "Data engineering",
        finalContentBrief: "",
    }, {
        version: "v1",
    });
    try {
        for (var _d = true, eventStream_1 = __asyncValues(eventStream), eventStream_1_1; eventStream_1_1 = yield eventStream_1.next(), _a = eventStream_1_1.done, !_a; _d = true) {
            _c = eventStream_1_1.value;
            _d = false;
            const event = _c;
            events.push(event);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = eventStream_1.return)) yield _b.call(eventStream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Save the events to a file:
    fs_1.default.writeFileSync("events.json", JSON.stringify(events, null, 2));
    // Print the events to the console:
    console.log(events);
});
main();

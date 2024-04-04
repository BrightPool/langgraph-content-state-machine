"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataState = exports.GraphType = void 0;
var GraphType;
(function (GraphType) {
    GraphType["BriefGeneration"] = "briefGeneration";
    GraphType["BlogGeneration"] = "BlogGeneration";
})(GraphType || (exports.GraphType = GraphType = {}));
var MetadataState;
(function (MetadataState) {
    MetadataState["briefGeneration"] = "briefGeneration";
    MetadataState["blogPostGeneration"] = "blogPostGeneration";
})(MetadataState || (exports.MetadataState = MetadataState = {}));

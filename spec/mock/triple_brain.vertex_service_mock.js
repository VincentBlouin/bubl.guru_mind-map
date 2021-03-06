/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "triple_brain.vertex_service",
    "triple_brain.edge",
    "triple_brain.vertex",
    "test/test-utils",
    "triple_brain.triple_ui_builder"
], function ($, VertexService, Edge, Vertex, TestUtils, TripleUiBuilder) {
    "use strict";
    var api = {};
    api.applyDefaultMocks = function () {
        var spies = {};
        spies["addRelationAndVertexToVertex"] = api.addRelationAndVertexToVertex();
        spies["remove"] = api.remove();
        spies["makeCollectionPrivate"] = api.makeCollectionPrivate();
        spies["makeCollectionPublic"] = api.makeCollectionPublic();
        spies["makePublic"] = api.makePublic();
        spies["makePrivate"] = api.makePrivate();
        spies["mergeTo"] = spyOn(VertexService, "mergeTo").and.callFake(function () {
            return $.Deferred().resolve();
        });
        spies["setShareLevel"] = spyOn(VertexService, "setShareLevel").and.callFake(function () {
            return $.Deferred().resolve();
        });
        return spies;
    };
    api.addRelationAndVertexToVertex = function () {
        return spyOn(VertexService, "addRelationAndVertexToVertex").and.callFake(function (vertex, sourceBubble, relationOver) {
            var tripleJson = {};
            tripleJson.source_vertex = vertex.getModel().vertexServerFormat;
            var newVertexUri = TestUtils.generateVertexUri();
            tripleJson.end_vertex = Vertex.buildServerFormatFromUri(newVertexUri);
            tripleJson.edge = Edge.buildObjectWithUriOfSelfSourceAndDestinationVertex(
                TestUtils.generateEdgeUri(),
                vertex.getUri(),
                newVertexUri
            );
            return $.Deferred().resolve(
                TripleUiBuilder.createIntoSourceBubble(
                    sourceBubble,
                    tripleJson,
                    relationOver
                )
            );
        });
    };
    api.remove = api.removeVertex = function () {
        return spyOn(VertexService, "remove").and.callFake(function (vertexUi) {
            return $.Deferred().resolve(vertexUi);
        });
    };
    api.makeCollectionPrivate = function () {
        return spyOn(VertexService, "makeCollectionPrivate").and.callFake(function () {
            return $.Deferred().resolve();
        });
    };
    api.makeCollectionPublic = function () {
        return spyOn(VertexService, "makeCollectionPublic").and.callFake(function () {
            return $.Deferred().resolve();
        });
    };
    api.makePublic = function () {
        return spyOn(VertexService, "makePublic").and.callFake(function () {
            return $.Deferred().resolve();
        });
    };
    api.makePrivate = function () {
        return spyOn(VertexService, "makePrivate").and.callFake(function () {
            return $.Deferred().resolve();
        });
    };
    return api;
})
;

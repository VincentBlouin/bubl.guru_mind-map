/*
 * Copyright Vincent Blouin under the Mozilla Public License 1.1
 */

define([
        "require",
        "jquery",
        "triple_brain.event_bus",
        "triple_brain.id_uri",
        "triple_brain.user",
        "triple_brain.graph_element_service",
        "triple_brain.edge",
        "triple_brain.friendly_resource_service"
    ],
    function (require, $, EventBus, IdUri, UserService, GraphElementService, Edge, FriendlyResourceService) {
        var api = {};
        api.add = function (sourceVertex, destinationVertex, callback) {
            add(
                sourceVertex.getUri(),
                destinationVertex.getUri(),
                callback
            );
        };
        api.addToFarVertex = function (sourceVertex, destinationVertexUri, callback) {
            add(
                sourceVertex.getUri(),
                destinationVertexUri,
                callback
            );
        };
        api.remove = function (edge, callback) {
            var edgeUri = edge.getUri();
            $.ajax({
                type: 'DELETE',
                url: edgeUri
            }).success(function () {
                var sourceVertex = edge.sourceVertex(),
                    destinationVertex = edge.destinationVertex(),
                    sourceVertexUri = sourceVertex.getUri(),
                    destinationVertexUri = destinationVertex.getUri(),
                    sourceVertexId = sourceVertex.getId(),
                    destinationVertexId = destinationVertex.getId();
                callback(
                    edge,
                    edgeUri,
                    sourceVertexUri,
                    destinationVertexUri
                );
                EventBus.publish(
                    '/event/ui/graph/relation/deleted', [
                        edge,
                        edgeUri,
                        sourceVertexUri,
                        destinationVertexUri,
                        sourceVertexId,
                        destinationVertexId
                    ]
                );
            });
        };
        api.updateLabel = function (edge, label, callback) {
            FriendlyResourceService.updateLabel(
                edge,
                label,
                callback
            );
        };
        api.addSameAs = function (edge, sameAs, callback) {
            GraphElementService.addSameAs(
                edge,
                sameAs,
                callback
            );
        };
        api.removeSameAs = function (edge, sameAs, callback) {
            GraphElementService.removeIdentification(
                edge,
                sameAs,
                callback
            );
        };
        api.addType = function (edge, type, callback) {
            GraphElementService.addType(
                edge,
                type,
                callback
            );
        };
        api.removeType = function (edge, type, callback) {
            GraphElementService.removeType(
                edge,
                type,
                callback
            );
        };
        api.inverse = function (edge, callback) {
            $.ajax({
                type: 'PUT',
                url: edge.getUri() + "/inverse"
            }).success(callback);
        };
        return api;
        function edgesUrl() {
            return UserService.currentUserUri() + "/graph/edge";
        }

        function add(sourceVertexUri, destinationVertexUri, callback) {
            var sourceVertexUriFormatted = IdUri.encodeUri(sourceVertexUri);
            var destinationVertexUriFormatted = IdUri.encodeUri(destinationVertexUri);
            var response = $.ajax({
                type: 'POST',
                url: edgesUrl() +
                    '?sourceVertexId=' + sourceVertexUriFormatted +
                    '&destinationVertexId=' + destinationVertexUriFormatted
            }).success(function () {
                    var responseUri = IdUri.resourceUriFromAjaxResponse(
                        response
                    );
                    callback(
                        getEdgeServerFacade().buildObjectWithUriOfSelfSourceAndDestinationVertex(
                            responseUri,
                            sourceVertexUri,
                            destinationVertexUri
                        )
                    );
                }
            );
        }

        function getEdgeServerFacade() {
            if (undefined === Edge) {
                Edge = require("triple_brain.edge");
            }
            return Edge;
        }
    }
);
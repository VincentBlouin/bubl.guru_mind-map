/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "mr.graph-ui-builder",
    "mr.vertex-ui-builder",
    "mr.edge-ui-builder",
    "triple_brain.edge",
    "triple_brain.id_uri",
    "triple_brain.event_bus",
    "triple_brain.bubble_factory",
    "triple_brain.graph_displayer",
    "mr.meta_service",
    "triple_brain.graph_element_main_menu",
    "triple_brain.selection_handler"
], function ($, GraphUiBuilder, VertexUiBuilder, EdgeUiBuilder, Edge, IdUri, EventBus, BubbleFactory, GraphDisplayer, MetaService, GraphElementMainMenu, SelectionHandler) {
    "use strict";
    var api = {};
    api.buildFromMetaSubGraph = function (metaSubGraph) {
        var deferred = $.Deferred();
        if (metaSubGraph.getMetaCenter()) {
            deferred.resolve(
                api._build(metaSubGraph)
            );
        }
        else {
            MetaService.getForUri(
                IdUri.getGraphElementUriInUrl()
            ).then(function (metaCenter) {
                metaSubGraph.setMetaCenter(metaCenter);
                deferred.resolve(
                    api._build(metaSubGraph)
                );
            });
        }
        return deferred.promise();
    };
    api._build = function (metaSubGraph) {
        var container = GraphUiBuilder.buildRootBubbleContainer();
        var graphUiBuilder = GraphUiBuilder.usingVertexUiBuilder(
            VertexUiBuilder.withOptions({
                htmlClass: "meta"
            })
        );
        var metaCenter = graphUiBuilder.buildRootBubble(
            metaSubGraph.getMetaCenter(),
            container
        );
        graphUiBuilder.setVertexUiBuilder(
            new VertexUiBuilder.VertexUiBuilder()
        );
        graphUiBuilder.setEdgeUiBuilder(
            EdgeUiBuilder.withOptions({
                htmlClass: "meta-relation",
                isViewOnly: true
            })
        );
        api._edgePopoverText = $.t("meta_relation.remove_tooltip");
        var edgesBySourceVertex = buildEdgesGroupedBySourceVertex(metaSubGraph);
        var subGraph = metaSubGraph.getSubGraph();
        Object.keys(edgesBySourceVertex).forEach(function (vertexUri) {
            var sourceVertexAndEdges = edgesBySourceVertex[vertexUri];
            var child;
            var vertex = subGraph.getVertexWithUri(
                sourceVertexAndEdges.sourceVertex.getUri()
            );
            if (sourceVertexAndEdges.edges.length === 0) {
                child = Edge.withLabelSelfSourceAndDestinationUri(
                    vertex.getLabel(),
                    IdUri.generateUuid(),
                    vertex.getUri(),
                    metaCenter.getUri()
                );
            }else{
                child = Edge.withLabelSelfSourceAndDestinationUri(
                    vertex.getLabel(),
                    IdUri.generateUuid(),
                    vertex.getUri(),
                    metaCenter.getUri()
                );
                child.setSourceVertex(vertex);
                child.setDestinationVertex(metaCenter);
                var edgeToGroupVertexUi = graphUiBuilder.addEdge(
                    child,
                    metaCenter
                );
                var previousVertexUiBuilder = graphUiBuilder.getVertexUiBuilder();
                graphUiBuilder.setVertexUiBuilder(
                    VertexUiBuilder.withOptions({
                        htmlClass: "group-vertex-under-meta"
                    })
                );
                var groupVertexUi = graphUiBuilder.addVertex(
                    vertex,
                    edgeToGroupVertexUi
                );
                graphUiBuilder.getVertexUiBuilder().getClass().completeBuild(
                    groupVertexUi
                );
                graphUiBuilder.setVertexUiBuilder(
                    previousVertexUiBuilder
                );
                graphUiBuilder.getEdgeUiBuilder().getClass().afterChildBuilt(
                    edgeToGroupVertexUi,
                    metaCenter,
                    groupVertexUi
                );
                edgeToGroupVertexUi.hideLabel();
                sourceVertexAndEdges.edges.forEach(function (edgeBetweenGroupAndDestination) {
                    edgeBetweenGroupAndDestination.setSourceVertex(
                        groupVertexUi.getModel()
                    );
                    var destinationVertex = subGraph.getVertexWithUri(
                        edgeBetweenGroupAndDestination.getDestinationVertex().getUri()
                    );
                    edgeBetweenGroupAndDestination.setDestinationVertex(
                        destinationVertex
                    );
                    var edgeBetweenGroupAndDestinationUi = graphUiBuilder.addEdge(
                        edgeBetweenGroupAndDestination,
                        groupVertexUi
                    );
                    var destinationVertexUi = graphUiBuilder.addVertex(
                        destinationVertex,
                        edgeBetweenGroupAndDestinationUi
                    );
                    graphUiBuilder.getEdgeUiBuilder().getClass().afterChildBuilt(
                        edgeBetweenGroupAndDestinationUi,
                        groupVertexUi,
                        destinationVertexUi
                    );
                    api._setupMetaEdgeUi(edgeBetweenGroupAndDestinationUi);
                });
                if(groupVertexUi.getNumberOfHiddenRelations() > 1){
                    groupVertexUi.collapse();
                }
                return;
            }
            var edgeUi = graphUiBuilder.addEdge(
                child,
                metaCenter
            );
            var sourceVertexUi = graphUiBuilder.addVertex(
                vertex,
                edgeUi
            );
            graphUiBuilder.getEdgeUiBuilder().getClass().afterChildBuilt(
                edgeUi,
                metaCenter,
                sourceVertexUi
            );
            api._setupMetaEdgeUi(edgeUi);
        });
        return container;
    };
    api._setupMetaEdgeUi = function (metaEdgeUi) {
        metaEdgeUi.hideLabel();
        var edgeHtml = metaEdgeUi.getHtml();
        var menu = $("<span class='relation-menu menu'>");
        edgeHtml.append(menu);
        GraphElementMainMenu.addRelevantButtonsInMenu(
            menu,
            metaEdgeUi.getController()
        );
        edgeHtml.click(function(){
            SelectionHandler.setToSingleGraphElement(
                BubbleFactory.fromHtml(
                    $(this)
                )
            );
        });
        edgeHtml.find(".connector").addClass("meta-relation-clickable");
        metaEdgeUi.hideMenu();
    };
    EventBus.subscribe(
        '/event/ui/graph/drawing_info/updated/',
        function (event, centralBubbleUri) {
            if (!IdUri.isMetaUri(centralBubbleUri)) {
                return;
            }
            VertexUiBuilder.completeBuild(
                BubbleFactory.getGraphElementFromUri(
                    centralBubbleUri
                )
            );
        }
    );
    return api;

    function buildEdgesGroupedBySourceVertex(metaSubGraph) {
        var edgesBySourceVertex = {};
        var excludedDestinationVerticesUri = {};
        var subGraph = metaSubGraph.getSubGraph();
        subGraph.visitEdges(function (edge) {
            if (!edge.hasIdentification(metaSubGraph.getMetaCenter())) {
                return;
            }
            var sourceVertex = subGraph.getVertexWithUri(
                edge.getSourceVertex().getUri()
            );
            if (!edgesBySourceVertex[sourceVertex.getUri()]) {
                edgesBySourceVertex[sourceVertex.getUri()] = {
                    sourceVertex: sourceVertex,
                    destinationVertex: subGraph.getVertexWithUri(edge.getDestinationVertex().getUri()),
                    edges: []
                };
            }
            edgesBySourceVertex[sourceVertex.getUri()].edges.push(
                edge
            );
            excludedDestinationVerticesUri[edge.getDestinationVertex().getUri()] = true;
        });
        Object.keys(edgesBySourceVertex).forEach(function (vertexUri) {
            var sourceVertexAndEdges = edgesBySourceVertex[vertexUri];
            var areDestinationVerticesGroupedBySourceVertex = sourceVertexAndEdges.edges.length > 1;
            if (!areDestinationVerticesGroupedBySourceVertex) {
                return;
            }
            sourceVertexAndEdges.edges.forEach(function (edge) {
                excludedDestinationVerticesUri[
                    edge.getDestinationVertex().getUri()
                    ] = true;
            });
        });
        subGraph.visitVertices(function (vertex) {
            var isAVertexNotGroupedBySourceVertex = !edgesBySourceVertex[vertex.getUri()] && !excludedDestinationVerticesUri[vertex.getUri()];
            if (isAVertexNotGroupedBySourceVertex) {
                edgesBySourceVertex[vertex.getUri()] = {
                    sourceVertex: vertex,
                    edges: []
                };
            }
        });
        return edgesBySourceVertex;
    }
});
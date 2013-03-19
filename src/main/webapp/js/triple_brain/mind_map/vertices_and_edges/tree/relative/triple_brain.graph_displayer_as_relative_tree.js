/*
 * Copyright Mozilla Public License 1.1
 */
define([
    "jquery",
    "triple_brain.graph",
    "triple_brain.graph_displayer_as_tree_common",
    "triple_brain.ui.vertex_html_builder",
    "triple_brain.ui.graph",
    "triple_brain.relative_tree_displayer_templates",
    "triple_brain.ui.edge",
    "triple_brain.event_bus",
    "triple_brain.ui.vertex",
    "triple_brain.ui.arrow_line",
    "triple_brain.id_uri"
], function ($, Graph, TreeDisplayerCommon, VertexHtmlBuilder, GraphUi, RelativeTreeTemplates, EdgeUi, EventBus, VertexUi, ArrowLine, IdUriUtils) {
    var api = {};
    api.displayUsingDepthAndCentralVertexUri = function (centralVertexUri, depth, callback) {
        Graph.getForCentralVertexUriAndDepth(centralVertexUri, depth, function (graph) {
            var drawnTree = new TreeMaker()
                .makeUsingServerGraphAndCentralVertexUri(
                graph,
                centralVertexUri
            );
            callback(drawnTree);
        });
    };
    api.addVertex = function (newVertex, parentVertex) {
        var treeMaker = new TreeMaker();
        var container;
        if(parentVertex.isCenterVertex()){
            container = shouldAddLeft() ?
                leftVerticesContainer() :
                rightVerticesContainer();
        }else{
            container = treeMaker.childrenVertexContainer(parentVertex);
        }
        newVertex.children = [];
        var vertexHtmlFacade = treeMaker.buildVertexHtmlIntoContainer(
            newVertex,
            container
        );
        EdgeUi.redrawAllEdges();
        return vertexHtmlFacade;
    };
    api.allowsMovingVertices = function(){
        return false;
    };
    api.integrateEdges = function(edges){
        VertexUi.visitAllVertices(integrateEdgesOfVertex);
        function integrateEdgesOfVertex(vertex){
            var vertexServerFormat = vertex.getOriginalServerObject();
            $.each(vertexServerFormat.children, function(){
                var childInfo = this;
                buildEdge(
                    childInfo.edge,
                    vertex,
                    VertexUi.withId(childInfo.vertexHtmlId)
                );
            });
        }
    };
    api.addEdge = function(serverEdge, sourceVertex, destinationVertex){
        return buildEdge(
            serverEdge,
            sourceVertex,
            destinationVertex
        );
    };
    return api;
    function shouldAddLeft(){
        var numberOfDirectChildrenLeft = $(leftVerticesContainer()).children().length;
        var numberOfDirectChildrenRight = $(rightVerticesContainer()).children().length;
        return  numberOfDirectChildrenLeft < numberOfDirectChildrenRight;
    }
    function leftVerticesContainer(){
        return $(
            ".vertices-children-container.left-oriented"
        );
    }
    function rightVerticesContainer(){
        return $(".center-vertex").closest(".vertex-container").siblings(
            ".vertices-children-container:not(.left-oriented):first"
        );
    }
    function buildEdge(edgeServer, parentVertexHtmlFacade, childVertexHtmlFacade){
        var edgeHtml = $("<div class='edge' style='display:none'></div>");
        $(edgeHtml).attr(
            "id",
            IdUriUtils.graphElementIdFromUri(edgeServer.id)
        );
        GraphUi.addHTML(
            edgeHtml
        );
        $(edgeHtml).data(
            "source_vertex_id",
            parentVertexHtmlFacade.getId()
        );
        $(edgeHtml).data(
            "destination_vertex_id",
            childVertexHtmlFacade.getId()
        );
        var edgeFacade = EdgeUi.withHtml(edgeHtml);
        edgeFacade.setUri(edgeServer.id);
        edgeFacade.setArrowLine(
            ArrowLine.ofEdgeHavingUndefinedArrowLine(
                edgeFacade
            )
        );
        edgeFacade.arrowLine().drawInWithDefaultStyle();
        EventBus.publish(
            '/event/ui/html/edge/created/',
            edgeFacade
        );
        return edgeFacade;
    }
    function TreeMaker() {
        var treeMaker = this;
        this.makeUsingServerGraphAndCentralVertexUri = function(serverGraph, centralVertexUri) {
            var vertices = serverGraph.vertices;
            TreeDisplayerCommon.defineChildrenInVertices(
                serverGraph,
                centralVertexUri
            );
            buildVerticesHtml();
            function buildVerticesHtml() {
                var serverRootVertex = vertexWithId(centralVertexUri);
                var rootVertex = VertexHtmlBuilder.withJsonHavingNoPosition(
                    serverRootVertex
                ).create();
                var graphOffset = GraphUi.offset();
                var verticesContainer = RelativeTreeTemplates[
                    "root_vertex_super_container"
                    ].merge({
                    offset:graphOffset
                });
                GraphUi.addHTML(
                    verticesContainer
                );
                var vertexContainer= RelativeTreeTemplates["vertex_container"].merge();
                $(verticesContainer).append(vertexContainer);
                $(vertexContainer).append(rootVertex.getHtml());
                var leftChildrenContainer = treeMaker.addChildrenContainerToVertex(
                    rootVertex
                );
                $(leftChildrenContainer).addClass("left-oriented");
                var rightChildrenContainer = treeMaker.addChildrenContainerToVertex(
                    rootVertex
                );
                for(var i = 0 ; i < serverRootVertex.children.length; i++){
                    var isLeftOriented = i % 2 != 0;
                    var childVertex = vertexWithId(serverRootVertex.children[i].vertexUri);
                    var container = isLeftOriented ?
                        leftChildrenContainer:
                        rightChildrenContainer;
                    var childHtmlFacade = treeMaker.buildVertexHtmlIntoContainer(
                        childVertex,
                        container
                    );
                    serverRootVertex.children[i].vertexHtmlId = childHtmlFacade.getId();
                    buildChildrenHtmlTreeRecursively(
                        childHtmlFacade
                    );
                }
                function buildChildrenHtmlTreeRecursively(parentVertexHtmlFacade) {
                    var serverParentVertex = vertexWithId(
                        parentVertexHtmlFacade.getUri()
                    );
                    var childrenContainer = treeMaker.childrenVertexContainer(parentVertexHtmlFacade);
                    $.each(serverParentVertex.children, function () {
                        var childInfo = this;
                        var childVertexHtmlFacade = treeMaker.buildVertexHtmlIntoContainer(
                            vertexWithId(childInfo.vertexUri),
                            childrenContainer
                        );
                        childInfo.vertexHtmlId = childVertexHtmlFacade.getId();
                        var treeContainer = childVertexHtmlFacade.getHtml().closest(
                            ".vertex-tree-container"
                        );
                        $(treeContainer).append(
                            buildChildrenHtmlTreeRecursively(
                                childVertexHtmlFacade
                            )
                        );
                    });
                    return childrenContainer;
                }
            }
            return serverGraph;
            function vertexWithId(vertexId) {
                return vertices[vertexId]
            }
        };

        this.buildVertexHtmlIntoContainer = function(vertex, container){
            var childVertexHtmlFacade = VertexHtmlBuilder.withJsonHavingNoPosition(
                vertex
            ).create();
            var childTreeContainer = RelativeTreeTemplates[
                "vertex_tree_container"
                ].merge();
            $(container).append(
                childTreeContainer
            );
            var vertexContainer = RelativeTreeTemplates["vertex_container"].merge();
            childTreeContainer.append(
                vertexContainer
            );
            vertexContainer.append(
                childVertexHtmlFacade.getHtml()
            );
            treeMaker.addChildrenContainerToVertex(childVertexHtmlFacade);
            return childVertexHtmlFacade;
        };
        this.addChildrenContainerToVertex = function(vertexHtmlFacade){
            var childrenContainer = RelativeTreeTemplates[
                "vertices_children_container"
                ].merge();
            vertexHtmlFacade.getHtml().closest(
                ".vertex-tree-container, .root-vertex-super-container"
            ).append(childrenContainer);
            return childrenContainer;
        };
        this.childrenVertexContainer = function(vertexHtmlFacade){
            return $(vertexHtmlFacade.getHtml()).closest(".vertex-container"
            ).siblings(".vertices-children-container");
        }
    }
});
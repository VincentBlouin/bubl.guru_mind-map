/*
 * Copyright Mozilla Public License 1.1
 */
define([
    "jquery",
    "triple_brain.graph",
    "triple_brain.graph_displayer_as_tree_common",
    "triple_brain.ui.vertex_html_builder",
    "triple_brain.ui.graph",
    "triple_brain.relative_tree_displayer_templates"
], function ($, Graph, TreeDisplayerCommon, VertexHtmlBuilder, GraphUi, RelativeTreeTemplates) {
    var api = {};
    api.displayUsingDepthAndCentralVertexUri = function (centralVertexUri, depth, callback) {
        Graph.getForCentralVertexUriAndDepth(centralVertexUri, depth, function (graph) {
            var drawnTree = new TreeMakerFromServerGraph(
                centralVertexUri,
                graph
            ).make();
            callback(drawnTree);
        });
    };
    api.addVertex = function (newVertex, parentVertex) {

    };
    api.allowsMovingVertices = function(){
        return false;
    }
    return api;
    function TreeMakerFromServerGraph(centralVertexUri, serverGraph) {
        var vertices = serverGraph.vertices;
        this.make = function () {
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
                buildChildrenHtmlTreeRecursively(
                    rootVertex,
                    false
                );
                function buildChildrenHtmlTreeRecursively(parentVertexHtmlFacade, isLeftOriented) {
                    var serverParentVertex = vertexWithId(
                        parentVertexHtmlFacade.getUri()
                    );
                    var childrenContainer = RelativeTreeTemplates[
                        "vertices_children_container"
                        ].merge();
                    if(isLeftOriented){
                        $(childrenContainer).addClass("left-oriented");
                    }
                    parentVertexHtmlFacade.getHtml().closest(
                        ".vertices-children-container, .root-vertex-super-container"
                    ).append(childrenContainer);
                    $.each(serverParentVertex.children, function () {
                        var childVertex = vertexWithId(this);
                        var childVertexHtmlFacade = VertexHtmlBuilder.withJsonHavingNoPosition(
                            childVertex
                        ).create();
                        var childTreeContainer = RelativeTreeTemplates[
                            "vertex_tree_container"
                            ].merge();
                        childrenContainer.append(
                            childTreeContainer
                        );
                        var vertexContainer = RelativeTreeTemplates["vertex_container"].merge();
                        childTreeContainer.append(
                            vertexContainer
                        );
                        vertexContainer.append(
                            childVertexHtmlFacade.getHtml()
                        );
                        childTreeContainer.append(
                            buildChildrenHtmlTreeRecursively(childVertexHtmlFacade, isLeftOriented)
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
    }
});
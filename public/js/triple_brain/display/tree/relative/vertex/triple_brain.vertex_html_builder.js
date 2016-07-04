/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
        "jquery",
        "triple_brain.event_bus",
        "triple_brain.mind-map_template",
        "triple_brain.relative_tree_vertex",
        "triple_brain.vertex_html_builder_common",
        "triple_brain.graph_element_html_builder",
        "triple_brain.graph_ui",
        "triple_brain.bubble_factory",
        "triple_brain.edge_service",
        "triple_brain.mind_map_info",
        "jquery-ui",
        "jquery.is-fully-on-screen",
        "jquery.center-on-screen"
    ], function ($, EventBus, MindMapTemplate, RelativeTreeVertex, VertexHtmlCommon, GraphElementHtmlBuilder, GraphUi, BubbleFactory, EdgeService, MindMapInfo) {
        "use strict";
        var api = {};
        api.withServerFacade = function (serverFacade) {
            return new VertexCreator(serverFacade);
        };
        api.completeBuild = function (vertex) {
            GraphElementHtmlBuilder.setUpIdentifications(
                vertex.getModel(),
                vertex
            );
            vertex.refreshImages();
            VertexHtmlCommon.moveInLabelButtonsContainerIfIsToTheLeft(
                vertex
            );
            var hasAnExpandedOtherInstance = false;
            vertex.applyToOtherInstances(function(otherInstance){
                if(otherInstance.getNumberOfChild() > 0){
                    hasAnExpandedOtherInstance = true;
                    return -1;
                }
            });
            if (vertex.hasHiddenRelations() && !hasAnExpandedOtherInstance) {
                vertex.buildHiddenNeighborPropertiesIndicator();
            }
            vertex.reviewInLabelButtonsVisibility();
            api._setupChildrenContainerDragOverAndDrop(vertex);
            EventBus.publish(
                '/event/ui/vertex/build_complete',
                vertex
            );
        };
        api._setupChildrenContainerDragOverAndDrop = function(vertex){
            //vertex.getChildrenContainer().on("dragover", function(){
            //    console.log("poire");
            //});
        };
        EventBus.subscribe(
            '/event/ui/vertex/visit_after_graph_drawn',
            handleVisitAfterGraphDrawn
        );
        function handleVisitAfterGraphDrawn(event, vertex) {
            api.completeBuild(vertex);
        }

        function VertexCreator(serverFacade) {
            this.serverFacade = serverFacade;
            this.html = $(
                MindMapTemplate['relative_vertex'].merge()
            ).data(
                "uri",
                serverFacade.getUri()
            );
            VertexHtmlCommon.setUpClickBehavior(
                this.html
            );
        }

        VertexCreator.prototype.create = function (htmlId) {
            if (undefined === htmlId) {
                htmlId = GraphUi.generateBubbleHtmlId();
            }
            this.html.attr('id', htmlId);
            this.vertexUi = RelativeTreeVertex.createFromHtml(
                this.html
            );
            var label = VertexHtmlCommon.buildLabelHtml(
                this.vertexUi,
                VertexHtmlCommon.buildInsideBubbleContainer(
                    this.html
                ),
                RelativeTreeVertex,
                this.serverFacade
            ).blur(function () {
                    var $label = $(this);
                    $label.html(
                        linkify(
                            $label.html()
                        )
                    );
                });
            label.html(
                linkify(
                    label.html()
                )
            );
            if(!MindMapInfo.isViewOnly()){
                this._setupDragAndDrop();
            }
            this.html.data(
                "isPublic",
                this.serverFacade.isPublic()
            );
            this.vertexUi.setIncludedVertices(
                this.serverFacade.getIncludedVertices()
            );
            this.vertexUi.setIncludedEdges(
                this.serverFacade.getIncludedEdges()
            );
            if (this.vertexUi.hasIncludedGraphElements()) {
                this._showItHasIncludedGraphElements();
            }
            this.vertexUi.setNote(
                this.serverFacade.getComment()
            );
            this._createMenu();
            VertexHtmlCommon.buildInLabelButtons(
                this.vertexUi
            );
            this.vertexUi.hideMenu();
            this.vertexUi.addImages(
                this.serverFacade.getImages()
            );
            this.vertexUi.getHtml().append(
                $("<span class='arrow'>")
            );
            if (this.vertexUi.isPublic()) {
                this.vertexUi.makePublic();
            } else {
                this.vertexUi.makePrivate();
            }
            EventBus.publish(
                '/event/ui/html/vertex/created/',
                this.vertexUi
            );
            return this.vertexUi;
        };

        VertexCreator.prototype._showItHasIncludedGraphElements = function () {
            this.html.append(
                $("<div class='included-graph-elements-flag'>").text(
                    ". . ."
                )
            ).addClass("includes-vertices");
        };

        VertexCreator.prototype._createMenu = function () {
            var vertexMenu = $(
                MindMapTemplate['vertex_menu'].merge()
            );
            this.html.find(
                ".in-bubble-content"
            ).append(vertexMenu);
            VertexHtmlCommon.addRelevantButtonsInMenu(
                vertexMenu,
                this.vertexUi
            );
            return vertexMenu;
        };
        VertexCreator.prototype._setupDragAndDrop = function () {
            this.html.find(".in-bubble-content-wrapper").mousedown(function () {
                GraphUi.disableDragScroll();
            }).click(function(){
                GraphUi.enableDragScroll();
            }).mouseleave(function () {
                if(GraphUi.isThereAnOpenModal() || GraphUi.isDragScrollEnabled()){
                    return;
                }
                GraphUi.enableDragScroll();
            });
            this.html.on("dragstart", function (event) {
                if (event.originalEvent) {
                    event.originalEvent.dataTransfer.setData('Text', "dummy data for dragging to work in Firefox");
                }
                var vertex = BubbleFactory.fromHtml(
                    $(this)
                );
                RelativeTreeVertex.setDraggedVertex(
                    vertex
                );
                GraphUi.setIsDraggingBubble(true);
                GraphUi.disableDragScroll();
                vertex.hideMenu();
                vertex.hideHiddenRelationsContainer();
                vertex.getArrowHtml().addClass("hidden");
                vertex.getHtml().addClass(
                    "dragged"
                ).data(
                    "original-parent",
                    vertex.getParentVertex()
                );
            }).on(
                "dragend", function (event) {
                    event.preventDefault();
                    GraphUi.setIsDraggingBubble(false);
                    var bubble = BubbleFactory.fromHtml(
                        $(this)
                    );
                    bubble.getArrowHtml().removeClass(
                        "hidden"
                    );
                    bubble.showHiddenRelationsContainer();
                    GraphUi.enableDragScroll();
                }).on(
                "dragover", function (event) {
                    event.preventDefault();
                    var vertex = BubbleFactory.fromHtml($(this));
                    var draggedVertex = RelativeTreeVertex.getDraggedVertex();
                    var shouldSetToDragOver = !vertex.hasDragOver() && draggedVertex !== undefined && draggedVertex.getUri() !== vertex.getUri();
                    if (!shouldSetToDragOver) {
                        return;
                    }
                    vertex.enterDragOver();
                }).on(
                "dragleave", function (event) {
                    event.preventDefault();
                    var vertex = BubbleFactory.fromHtml(
                        $(this)
                    );
                    vertex.leaveDragOver();
                }).on(
                "drop", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    GraphUi.enableDragScroll();
                    GraphUi.setIsDraggingBubble(false);
                    var parent = BubbleFactory.fromHtml(
                        $(this)
                    );
                    parent.leaveDragOver();
                    var draggedVertex = RelativeTreeVertex.getDraggedVertex();
                    if (draggedVertex === undefined) {
                        return;
                    }
                    var shouldMove = draggedVertex.getUri() !== parent.getUri() && !draggedVertex.isBubbleAChild(parent);
                    if (!shouldMove) {
                        return;
                    }
                    draggedVertex.moveToParent(
                        parent
                    );
                    EdgeService.changeSourceVertex(
                        parent,
                        draggedVertex.getParentBubble()
                    );
                }
            );
        };
        return api;
        function linkify(text) {
            //http://stackoverflow.com/a/25821576/541493
            var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
            return text.replace(urlRegex, function(url,b,c) {
                var url2 = (c === 'www.') ?  'http://' +url : url;
                return '<a href="' +url2+ '" target="_blank">' + url + '</a>';
            });
        }
    }
);


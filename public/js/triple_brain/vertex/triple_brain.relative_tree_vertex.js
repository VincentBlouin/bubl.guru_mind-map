/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
        "jquery",
        "triple_brain.vertex_ui",
        "triple_brain.event_bus",
        "triple_brain.tree_edge",
        "triple_brain.object_utils",
        "triple_brain.triple_ui_builder",
        "triple_brain.selection_handler",
        "triple_brain.bubble_factory",
        "triple_brain.mind_map_info",
        "clipboard",
        "triple_brain.bubble",
        "triple_brain.graph_element_ui"
    ],
    function ($, VertexUi, EventBus, TreeEdge, ObjectUtils, TripleUiBuilder, SelectionHandler, BubbleFactory, MindMapInfo, Clipboard, Bubble, GraphElementUi) {
        "use strict";
        var api = {};
        VertexUi.buildCommonConstructors(api);
        api.createFromHtml = function (html) {
            var vertex = new api.RelativeTreeVertex().init(
                html
            );
            api.initCache(
                vertex
            );
            VertexUi.initCache(
                vertex
            );
            return vertex;
        };
        api.ofVertex = function (vertex) {
            return api.withHtml(
                vertex.getHtml()
            );
        };
        api.VerticesToHtmlLists = function (vertices) {
            var lists = $("<div>");
            var verticesInListById = {};
            vertices.forEach(function (vertex) {
                verticesInListById[vertex.getId()] = {};
            });
            Bubble.sortBubblesByNumberOfParentVerticesAscending(vertices).forEach(function (vertex) {
                if (!shouldIntegrateVertex(vertex)) {
                    return;
                }
                lists.append(
                    integrateBubble(vertex, true)
                );
            });
            return lists;

            function integrateBubble(bubble, isARoot) {
                var html = $(
                    isARoot ? "<div>" : "<li>"
                ).append(bubble.text());
                var ul = $("<ul>");
                bubble.visitAllImmediateChild(function (child) {
                    if (child.isGroupRelation() && !child.getModel().isLabelEmpty()) {
                        ul.append(
                            integrateBubble(child, false)
                        );
                    } else if (child.isATypeOfEdge()) {
                        var childVertex = child.getTopMostChildBubble();
                        if (!shouldIntegrateVertex(childVertex)) {
                            return;
                        }
                        if (!child.getModel().isLabelEmpty() && !child.isSetAsSameAsGroupRelation()) {
                            ul.append(
                                $("<li>").append(
                                    $("<em>").text("(" + child.text() + ")"),
                                    "  ",
                                    childVertex.text()
                                )
                            );
                            verticesInListById[childVertex.getId()].isIntegrated = true;
                        } else {
                            ul.append(
                                integrateBubble(childVertex, false)
                            );
                        }
                    } else if (child.isVertex() && shouldIntegrateVertex(child)) {
                        ul.append(
                            integrateBubble(child, false)
                        );
                    }
                });
                // vertices.forEach(function (otherVertex) {
                //     if (bubble.isVertexAChild(otherVertex)) {
                //         var relation = otherVertex.getParentBubble();
                //         if (relation.getModel().isLabelEmpty()) {
                //             ul.append()
                //         }
                //
                //     }
                // });
                if (ul.find("li").length > 0) {
                    html.append(ul);
                }
                if (verticesInListById[bubble.getId()]) {
                    verticesInListById[bubble.getId()].isIntegrated = true;
                }
                return html;
            }

            function shouldIntegrateVertex(vertex) {
                return verticesInListById[vertex.getId()] && !verticesInListById[vertex.getId()].isIntegrated;
            }
        };
        api = ObjectUtils.makeChildInheritParent(
            api,
            VertexUi
        );
        api.RelativeTreeVertex = function () {
        };

        api.RelativeTreeVertex.prototype = new VertexUi.VertexUi();

        api.RelativeTreeVertex.prototype.init = function (html) {
            this.html = html;
            VertexUi.VertexUi.apply(this, [html]);
            VertexUi.VertexUi.prototype.init.call(
                this
            );
            return this;
        };

        api.RelativeTreeVertex.prototype.visitVerticesChildren = function (visitor) {
            var children = this.getChildrenBubblesHtml();
            $.each(children, function () {
                var bubble = BubbleFactory.fromHtml($(this));
                if (bubble.isRelation()) {
                    var relationChild = bubble.getTopMostChildBubble();
                    if (relationChild.isVertex()) {
                        visitor(relationChild);
                    }
                }
            });
        };
        api.RelativeTreeVertex.prototype.remove = function (applyToOthers) {
            if (applyToOthers === undefined) {
                applyToOthers = true;
            }
            if (this._hasBeenCalledToRemove() || this._isRemoved()) {
                return;
            }
            this._setHasBeenCalledToRemove();
            if (applyToOthers) {
                this.applyToOtherInstances(function (otherInstance) {
                    otherInstance.remove();
                });
            }
            if (this._isRemoved()) {
                return;
            }
            this.visitVerticesChildren(function (childVertex) {
                childVertex.remove();
            });
            if (this._isRemoved()) {
                return;
            }
            var bubbleAbove = this.getBubbleAbove();
            var bubbleUnder = this.getBubbleUnder();
            this.removeFromCache();
            VertexUi.VertexUi.prototype.remove.call(
                this,
                bubbleAbove,
                bubbleUnder
            );
        };
        api.RelativeTreeVertex.prototype._setHasBeenCalledToRemove = function () {
            this.getHtml().data(
                "hasBeenCalledToRemove",
                true
            );
        };
        api.RelativeTreeVertex.prototype._hasBeenCalledToRemove = function () {
            return this.getHtml().data("hasBeenCalledToRemove") === true;
        };
        api.RelativeTreeVertex.prototype.removeFromCache = function () {
            api.removeFromCache(
                this.getUri(),
                this.getId()
            );
            VertexUi.removeFromCache(
                this.getUri(),
                this.getId()
            );
        };
        api.RelativeTreeVertex.prototype.initCache = function () {
            api.initCache(
                this
            );
            VertexUi.initCache(
                this
            );
        };
        api.RelativeTreeVertex.prototype._isRemoved = function () {
            return $.isEmptyObject(
                this.getHtml().data()
            );
        };
        api.RelativeTreeVertex.prototype.getRelationWithUiParent = function () {
            return this.getParentBubble();
        };
        api.RelativeTreeVertex.prototype.isALeaf = function () {
            return !this.hasChildren();
        };

        api.RelativeTreeVertex.prototype.hasHiddenRelations = function () {
            return !this.isCenterBubble() && MindMapInfo.isViewOnly() ?
                this._hasPublicHiddenRelations() :
                this.getNumberOfHiddenRelations() > 0;

        };
        api.RelativeTreeVertex.prototype.getNumberOfHiddenRelations = function () {
            if (this.isALeaf()) {
                var parentBubble = this.getParentBubble();
                if (parentBubble.getParentBubble().isGroupVertexUnderMeta()) {
                    return this.getModel().getNumberOfConnectedEdges() - 2;
                }
                if (parentBubble.isMetaRelation()) {
                    return this.getModel().getNumberOfConnectedEdges();
                }
                return this.getModel().getNumberOfConnectedEdges() - 1;
            }
            return 0;
        };
        api.RelativeTreeVertex.prototype._hasPublicHiddenRelations = function () {
            return this.getModel().getNbPublicNeighbors() > (
                this.getParentVertex().getModel().isPublic() ? 1 : 0
            );
        };
        api.RelativeTreeVertex.prototype.isVertexAChild = function (otherVertex) {
            return !otherVertex.isCenterBubble() &&
                !otherVertex.isSameBubble(this) &&
                otherVertex.getParentVertex().isSameBubble(this);
        };

        api.setupVertexCopyButton = function (vertex) {
            var button = vertex.getButtonHtmlHavingAction("copy");
            if (button.length === 0) {
                return;
            }
            api.setupCopyButton(
                button[0]
            );
        };

        api.setupCopyButton = function (button) {
            var clipboard = new Clipboard(
                button, {
                    target: function () {
                        var treeListCopyDump = $("#tree-list-copy-dump");
                        treeListCopyDump.html(
                            api.VerticesToHtmlLists(
                                SelectionHandler.getSelectedVertices()
                            )
                        );
                        return treeListCopyDump[0];
                    }
                }
            );
            clipboard.on("success", function () {
                $("#tree-list-copy-dump").empty();
            });
        };

        EventBus.subscribe(
            '/event/ui/graph/vertex_and_relation/added/',
            vertexAndRelationAddedHandler
        );
        EventBus.subscribe('/event/ui/graph/drawn', function () {
            var expandCalls = [];
            api.visitAllVertices(function (vertexUi) {
                if (vertexUi.getModel().hasOnlyOneHiddenChild() && !vertexUi.isExpanded()) {
                    expandCalls.push(
                        vertexUi.getController().expand(true)
                    );
                }
            });
            $.when.apply($, expandCalls).then(function () {
                GraphElementUi.getCenterVertexOrSchema().sideCenterOnScreenWithAnimation();
            });
            setupCopyButtons();
        });

        function setupCopyButtons() {
            var copyButton = $('.clipboard-copy-button')[0];
            if (!copyButton) {
                return;
            }
            $.each($('.clipboard-copy-button'), function () {
                api.setupCopyButton(this);
            });
        }

        function vertexAndRelationAddedHandler(event, triple, tripleJson) {
            var sourceBubble = triple.sourceVertex();
            if (!sourceBubble.isVertex()) {
                return;
            }
            sourceBubble.applyToOtherInstances(function (otherInstance) {
                TripleUiBuilder.createUsingServerTriple(
                    otherInstance,
                    tripleJson
                );
                otherInstance.resetOtherInstances();
            });
            triple.destinationVertex().resetOtherInstances();
            triple.destinationVertex().reviewInLabelButtonsVisibility(true);
        }

        return api;
    }
);

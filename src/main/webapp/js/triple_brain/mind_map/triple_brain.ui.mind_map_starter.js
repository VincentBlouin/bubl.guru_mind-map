define(
    [
        "jquery",
        "triple_brain.user",
        "triple_brain.event_bus",
        "triple_brain.login_handler",
        "triple_brain.drag_scroll",
        "triple_brain.ui.vertex",
        "triple_brain.mind-map_template",
        "triple_brain.server_subscriber",
        "triple_brain.ui.search",
        "triple_brain.ui.depth_slider",
        "triple_brain.graph_displayer",
        "triple_brain.graph_displayer_as_graph",
        "triple_brain.graph_displayer_as_absolute_tree",
        "triple_brain.graph_displayer_as_relative_tree",
        "triple_brain.ui.arrow_line"
    ],
    function ($, UserService, EventBus, LoginHandler, DragScroll, Vertex, MindMapTemplate, ServerSubscriber, SearchUi, DepthSlider, GraphDisplayer, GraphDisplayerAsGraph, GraphDisplayerAsAbsoluteTree, GraphDisplayerAsRelativeTree, ArrowLine) {
        var api = {
            offset:function () {
                var offset = {};
                var leftMargin = 150;
                var topMargin = 75;
                offset.left = $("#left-panel").width() + leftMargin;
                offset.top = topMargin;
                return offset;
            },
            start:function () {
                $(document).ready(function () {
                    ServerSubscriber.init(function () {
                        console.log("cometd initialized");
                    });
                    UserService.isAuthenticated(
                        callBackWhenIsAuthenticated,
                        showCredentialsFlow
                    );
                });
                function callBackWhenIsAuthenticated() {
                    $("html").addClass("authenticated");
                    handleIfNotAuthenticatedShowCredentialsFlow();
                    handleDisconnectButton();
                    DepthSlider.init();
                    SearchUi.init();
                    GraphDisplayer.setImplementation(
//                        GraphDisplayerAsGraph
                        GraphDisplayerAsRelativeTree
                    );
                    UserService.authenticatedUser(
                        GraphDisplayer.displayUsingDefaultVertex
                    );
                    $("#redraw-graph-btn").click(function () {
                        GraphDisplayer.displayUsingNewCentralVertex(
                            Vertex.centralVertex()
                        );
                    });
                }

                function handleIfNotAuthenticatedShowCredentialsFlow() {
                    $("html").ajaxError(function (e, jqxhr, settings, exception) {
                        if (jqxhr.status == 403) {
                            showCredentialsFlow();
                        }
                    });
                }

                function showCredentialsFlow() {
                    LoginHandler.startFlow();
                }

                function handleDisconnectButton() {
                    $("#disconnect-btn").click(function () {
                        UserService.logout(function () {
                            window.location = "/";
                        })
                    })
                }
            }
        };
        EventBus.subscribe(
            '/event/ui/graph/drawing_info/updated/',
            function (event, drawnGraph, centralVertexUri) {
                ArrowLine.resetDrawingCanvas();
                GraphDisplayer.integrateEdges(
                    drawnGraph.edges
                );
                var centralVertex = Vertex.withUri(centralVertexUri);
                centralVertex.setAsCentral();
                centralVertex.scrollTo();
                DragScroll.start();
                EventBus.publish('/event/ui/graph/drawn');
            }
        );
        return api;
    }
);


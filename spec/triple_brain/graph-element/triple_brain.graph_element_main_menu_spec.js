/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    'test/test-scenarios',
    'test/test-utils',
    'triple_brain.graph_element_main_menu',
    'triple_brain.selection_handler',
    "triple_brain.event_bus",
    "triple_brain.mind_map_info",
    "triple_brain.vertex_controller",
    "triple_brain.edge_controller",
    "triple_brain.graph_element_controller"
], function (Scenarios, TestUtils, GraphElementMainMenu, SelectionHandler, EventBus, MindMapInfo, VertexController, EdgeController, GraphElementController) {
    "use strict";
    describe("graph_element_main_menu", function () {
        it("returns the whole graph click handler if button is for whole graph even when a bubble is selected", function () {
            loadFixtures('graph-element-menu.html');
            var bubble = new Scenarios.threeBubblesGraph().getBubble1InTree();
            GraphElementMainMenu.reset();
            var clickHandler = GraphElementMainMenu._getCurrentClickHandler(
                getAWholeGraphButton()
            );
            expect(
                clickHandler.selectCanDo()
            ).toBeTruthy();
            SelectionHandler.setToSingleGraphElement(
                bubble
            );
            clickHandler = GraphElementMainMenu._getCurrentClickHandler(
                getAWholeGraphButton()
            );
            expect(
                clickHandler.selectCanDo()
            ).toBeTruthy();
        });
    });
    it("updates buttons visibility when suggestions are changed", function () {
        loadFixtures('graph-element-menu.html');
        MindMapInfo._setIsViewOnly(false);
        var bubble = new Scenarios.threeBubblesGraph().getBubble1InTree();
        SelectionHandler.setToSingleGraphElement(bubble);
        expect(
            bubble.getButtonHtmlHavingAction("suggestions")
        ).toHaveClass("hidden");
        var suggestions = [
            new Scenarios.getKaraokeSchemaGraph().getLocationPropertyAsSuggestion()
        ];
        bubble.setSuggestions(
            suggestions
        );
        EventBus.publish(
            '/event/ui/graph/vertex/suggestions/updated',
            [bubble, suggestions]
        );
        expect(
            bubble.getButtonHtmlHavingAction("suggestions")
        ).not.toHaveClass("hidden");
    });
    it("shows whole graph buttons when something is selected or not", function () {
        loadFixtures('graph-element-menu.html');
        MindMapInfo._setIsViewOnly(false);
        var bubble = new Scenarios.threeBubblesGraph().getBubble1InTree();
        SelectionHandler.setToSingleGraphElement(bubble);
        expect(
            getAWholeGraphButton().getHtml()
        ).not.toHaveClass("hidden");
        expect(
            getAWholeGraphButton()
        ).not.toHaveClass("hidden");
        SelectionHandler.removeAll();
        expect(
            getAWholeGraphButton().getHtml()
        ).not.toHaveClass("hidden");
    });
    it("sets the correct controller when multiple selected elements are all vertices", function () {
        var scenario = new Scenarios.threeBubblesGraph();
        var b1 = scenario.getBubble1InTree();
        var b2 = scenario.getBubble2InTree();
        SelectionHandler.addVertex(b1);
        SelectionHandler.addVertex(b2);
        expect(
            GraphElementMainMenu._getCurrentClickHandler() instanceof VertexController.Self
        ).toBeTruthy();
    });
    it("sets the correct controller when multiple selected elements are all relations", function () {
        var scenario = new Scenarios.threeBubblesGraph();
        var b1 = scenario.getBubble1InTree();
        var r1 = TestUtils.getChildWithLabel(
            b1,
            "r1"
        );
        var r2 = TestUtils.getChildWithLabel(
            b1,
            "r2"
        );
        SelectionHandler.addRelation(r1);
        SelectionHandler.addRelation(r2);
        expect(
            GraphElementMainMenu._getCurrentClickHandler() instanceof EdgeController.Self
        ).toBeTruthy();
    });
    it("sets the correct controller when multiple selected elements are different types of graph elements", function () {
        var scenario = new Scenarios.threeBubblesGraph();
        var b1 = scenario.getBubble1InTree();
        var r1 = TestUtils.getChildWithLabel(
            b1,
            "r1"
        );
        SelectionHandler.addVertex(b1);
        SelectionHandler.addRelation(r1);
        expect(
            GraphElementMainMenu._getCurrentClickHandler() instanceof GraphElementController.Self
        ).toBeTruthy();
    });
    function getAWholeGraphButton() {
        var wholeGraphButton;
        GraphElementMainMenu.visitButtons(function (button) {
            if (button.isForWholeGraph()) {
                wholeGraphButton = button;
            }
        });
        return wholeGraphButton;
    }
});
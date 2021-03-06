/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "test/test-scenarios",
    "test/test-utils",
    'test/mock',
    "triple_brain.graph_element",
    "triple_brain.mind_map_info"
], function (Scenarios, TestUtils, Mock, GraphElement, MindMapInfo) {
    "use strict";
    describe("graph_element", function () {
        beforeEach(function () {
            Mock.applyDefaultMocks();
        });
        it("takes the type and same as of a suggestion and sets them as identifications", function(){
            MindMapInfo._setIsViewOnly(false);
            var vertexSuggestionInTree = new Scenarios.oneBubbleHavingSuggestionsGraph().getAnySuggestionInTree();
            var graphElement = GraphElement.fromSuggestionAndElementUri(
                vertexSuggestionInTree.getSuggestion(),
                TestUtils.generateVertexUri()
            );
            expect(
                graphElement.getIdentifiers().length
            ).toBe(2);
        });
        it("does not fail if suggestion has no type", function(){
            var vertexSuggestionInTree = new Scenarios.oneBubbleHavingSuggestionsGraph().getAnySuggestionInTree();
            vertexSuggestionInTree.getSuggestion()._setType(undefined);
            var graphElement = GraphElement.fromSuggestionAndElementUri(
                vertexSuggestionInTree.getSuggestion(),
                TestUtils.generateVertexUri()
            );
            expect(
                graphElement.getIdentifiers().length
            ).toBe(1);
        });
        it("includes identifiers when building server format from ui", function(){
            var eventBubble = new Scenarios.oneBubbleHavingSuggestionsGraph().getVertexUi();
            var serverFormat = GraphElement.buildServerFormatFromUi(
                eventBubble
            );
            var graphElement = GraphElement.fromServerFormat(
                serverFormat
            );
            expect(
                graphElement.getIdentifiers().length
            ).toBeGreaterThan(0);
        });
        it("has right label for self identifier even if it changed", function(){
            var r1 = new Scenarios.threeBubblesGraph().getRelation1InTree();
            r1.getController().setLabel("new r1 label");
            var selfIdentifier = r1.getModel().getIdentifiersIncludingSelf()[0];
            expect(
                selfIdentifier.getLabel()
            ).toBe("new r1 label");
        });
        it("prevents from adding same identifier twice", function(){
            var b1 = new Scenarios.threeBubblesGraph().getCenterBubbleInTree();
            var identifier = TestUtils.dummyIdentifier();
            expect(
                b1.getModel().getIdentifiers().length
            ).toBe(0);
            b1.getModel().addIdentification(
                identifier
            );
            expect(
                b1.getModel().getIdentifiers().length
            ).toBe(1);
            b1.getModel().addIdentification(
                identifier
            );
            expect(
                b1.getModel().getIdentifiers().length
            ).toBe(1);
        });
        it("prevents from adding self as identifier", function(){
            var b1 = new Scenarios.threeBubblesGraph().getCenterBubbleInTree();
            expect(
                b1.getModel().getIdentifiers().length
            ).toBe(0);
            b1.addIdentification(
                b1.getModel().buildSelfIdentifier()
            );
            expect(
                b1.getModel().getIdentifiers().length
            ).toBe(0);
        });
    });
});
/*
 * Copyright Vincent Blouin under the Mozilla Public License 1.1
 */
define([
    "triple_brain.graph_displayer",
    "triple_brain.graph_element_main_menu",
    "triple_brain.graph_element_type",
    "triple_brain.event_bus",
    "jquery.focus-end"
], function (GraphDisplayer, GraphElementMainMenu, GraphElementType, EventBus) {
    var api = {};
    api.Types = GraphElementType;
    var menuHandlerGetters = {},
        selectors = {};
    initMenuHandlerGetters();
    initSelectors();
    api.buildCommonConstructors = function (api) {
        var cacheWithIdAsKey = {},
            cacheWithUriAsKey = {};
        api.initCache = function (graphElement) {
            cacheWithIdAsKey[graphElement.getId()] = graphElement;
            updateUriCache(graphElement.getUri(), graphElement);
        };
        api.withHtml = function (html) {
            return cacheWithIdAsKey[
                html.prop('id')
                ];
        };
        api.withId = function (id) {
            return cacheWithIdAsKey[id];
        };
        api.withUri = function (uri) {
            return cacheWithUriAsKey[uri];
        };
        api.lastAddedWithUri = function (uri) {
            return cacheWithUriAsKey[uri][
            cacheWithUriAsKey[uri].length - 1
                ];
        };
        api.visitAll = function(visitor){
            $.each(cacheWithIdAsKey, function () {
                return visitor(
                    this
                );
            });
        };
        api.removeFromCache = function (uri, id) {
            var len = cacheWithUriAsKey[uri].length;
            while (len--) {
                var vertex = cacheWithUriAsKey[uri][len];
                if (vertex.getId() === uri) {
                    cacheWithUriAsKey.splice(len, 1);
                }
            }
            delete cacheWithIdAsKey[id];
        };
        EventBus.subscribe('/event/ui/graph/reset', emptyCache);
        function emptyCache() {
            cacheWithIdAsKey = {};
            cacheWithUriAsKey = {};
        }
        function updateUriCache(uri, vertex) {
            if (undefined === cacheWithUriAsKey[uri]) {
                cacheWithUriAsKey[uri] = [];
            }
            cacheWithUriAsKey[uri].push(vertex);
        }
    };
    api.Self = function () {
    };
    api.Self.prototype.setOriginalServerObject = function (serverJson) {
        this.html.data(
            "originalServerObject",
            serverJson
        );
    };
    api.Self.prototype.getOriginalServerObject = function () {
        return this.html.data(
            "originalServerObject"
        );
    };
    api.Self.prototype.getId = function () {
        return this.getHtml().attr("id");
    };
    api.Self.prototype.isVertex = function () {
        return this.getGraphElementType() === api.Types.Vertex;
    };
    api.Self.prototype.isCenterBubble = function(){
        return this.html.hasClass("center-vertex");
    };
    api.Self.prototype.isSchema = function () {
        return this.getGraphElementType() === api.Types.Schema;
    };
    api.Self.prototype.isRelation = function () {
        return this.getGraphElementType() === api.Types.Relation;
    };
    api.Self.prototype.isGroupRelation = function () {
        return this.getGraphElementType() === api.Types.GroupRelation;
    };
    api.Self.prototype.isProperty = function () {
        return this.getGraphElementType() === api.Types.Property;
    };
    api.Self.prototype.isVertexSuggestion = function () {
        return this.getGraphElementType() === api.Types.VertexSuggestion;
    };
    api.Self.prototype.isRelationSuggestion = function () {
        return this.getGraphElementType() === api.Types.RelationSuggestion;
    };
    api.Self.prototype.isBubble = function () {
        return !this.isRelation() && !this.isRelationSuggestion();
    };
    api.Self.prototype.getSimilarButtonHtml = function (button) {
        return this.getMenuHtml().find(
                "[data-action=" + button.getAction() + "]"
        );
    };
    api.Self.prototype.getMenuHandler = function () {
        return menuHandlerGetters[
            this.getGraphElementType()
            ]();
    };
    api.Self.prototype.getTextOrDefault = function () {
        var text = this.text();
        return "" === text.trim() ?
            this.getSelector().getWhenEmptyLabel() :
            text;
    };
    api.Self.prototype.getSelector = function () {
        return selectors[
            this.getGraphElementType()
            ]();
    };
    api.Self.prototype.getInputSizer = function () {
        return this.html.find(".input-size");
    };
    api.Self.prototype.rightActionForType = function (vertexAction, edgeAction, groupRelationAction, schemaAction, propertyAction, suggestionVertexAction, suggestionRelationAction){
        switch (this.getGraphElementType()) {
            case api.Types.Vertex :
                return vertexAction;
            case api.Types.Relation :
                return edgeAction;
            case api.Types.GroupRelation :
                return groupRelationAction;
            case api.Types.Schema :
                return schemaAction;
            case api.Types.Property :
                return propertyAction;
            case api.Types.VertexSuggestion :
                return suggestionVertexAction;
            case api.Types.RelationSuggestion :
                return suggestionRelationAction;
        }
    };
    api.Self.prototype.focus = function () {
        this.editMode();
        this.getLabel().maxCharCleanTextApply().focusEnd();
    };
    api.Self.prototype.editMode = function(){
        this.getLabel().attr(
            "contenteditable",
            "true"
        );
        this.getHtml().addClass("edit");
    };
    api.Self.prototype.centerOnScreen = function () {
        this.getHtml().centerOnScreen();
    };
    api.Self.prototype.isInTypes = function (types) {
        return $.inArray(
            this.getGraphElementType(),
            types
        ) !== -1;
    };
    api.Self.prototype.getHtml = function () {
        return this.html;
    };
    api.Self.prototype.rebuildMenuButtons = function () {
        var container = this.getMenuHtml().empty();
        GraphElementMainMenu.addRelevantButtonsInMenu(
            container,
            this.getMenuHandler().forSingle()
        );
        this.onlyShowButtonsIfApplicable();
    };
    api.Self.prototype.onlyShowButtonsIfApplicable = function(){
        GraphElementMainMenu.onlyShowButtonsIfApplicable(
            this.getMenuHandler().forSingle(),
            this
        );
    };
    api.Self.prototype.isSuggestion = function(){
        return this.isVertexSuggestion() || this.isRelationSuggestion();
    };
    api.Self.prototype.setUri = function (uri) {
        this.html.data(
            "uri",
            uri
        );
    };
    api.Self.prototype.getUri = function () {
        return this.html.data(
            "uri"
        );
    };
    return api;
    function initMenuHandlerGetters() {
        menuHandlerGetters[api.Types.Vertex] = GraphDisplayer.getVertexMenuHandler;
        menuHandlerGetters[api.Types.Relation] = GraphDisplayer.getRelationMenuHandler;
        menuHandlerGetters[api.Types.GroupRelation] = GraphDisplayer.getGroupRelationMenuHandler;
        menuHandlerGetters[api.Types.Schema] = GraphDisplayer.getSchemaMenuHandler;
        menuHandlerGetters[api.Types.Property] = GraphDisplayer.getPropertyMenuHandler;
        menuHandlerGetters[api.Types.VertexSuggestion] = GraphDisplayer.getVertexSuggestionMenuHandler;
        menuHandlerGetters[api.Types.RelationSuggestion] = GraphDisplayer.getRelationSuggestionMenuHandler;
    }

    function initSelectors() {
        selectors[api.Types.Vertex] = GraphDisplayer.getVertexSelector;
        selectors[api.Types.Relation] = GraphDisplayer.getEdgeSelector;
        selectors[api.Types.GroupRelation] = GraphDisplayer.getGroupRelationSelector;
        selectors[api.Types.Schema] = GraphDisplayer.getSchemaSelector;
        selectors[api.Types.Property] = GraphDisplayer.getPropertySelector;
        selectors[api.Types.VertexSuggestion] = GraphDisplayer.getVertexSuggestionSelector;
        selectors[api.Types.RelationSuggestion] = GraphDisplayer.getRelationSuggestionSelector;
    }
});

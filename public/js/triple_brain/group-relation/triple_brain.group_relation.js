/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
        "jquery",
        "triple_brain.graph_ui",
        "triple_brain.graph_element",
        "triple_brain.identification"
    ], function ($, GraphUi, GraphElement, Identification) {
        "use strict";
        var api = {};
        api.withoutAnIdentification = function () {
            return new GroupRelation(undefined);
        };
        api.usingIdentification = function (identification) {
            if (Array.isArray(identification)) {
                return new GroupRelation(identification);
            } else {
                return new GroupRelation([identification]);
            }
        };
        api.usingIdentifiers = function (identifications) {
            return new GroupRelation(identifications);
        };
        function GroupRelation(identifiers) {
            this.identifiers = identifiers;
            this.vertices = {};
            Identification.Identification.apply(
                this
            );
            this.init(
                this.getIdentification().getServerFormat()
            );
        }

        GroupRelation.prototype = new Identification.Identification();

        GroupRelation.prototype.getIdentification = function () {
            return this.identifiers[0];
        };
        GroupRelation.prototype.getIdentifiers = function () {
            return this.identifiers;
        };
        GroupRelation.prototype.getVertices = function () {
            return this.vertices;
        };
        GroupRelation.prototype.getSortedVertices = function () {
            var self = this;
            var sortedKeys = Object.keys(this.vertices).sort(
                function (a, b) {
                    var vertexAUiInstances = self.vertices[a];
                    var vertexBUiInstances = self.vertices[b];
                    var vertexA = vertexAUiInstances[
                        Object.keys(vertexAUiInstances)
                        ].vertex;
                    var vertexB = vertexBUiInstances[
                        Object.keys(vertexBUiInstances)
                        ].vertex;
                    return GraphElement.sortCompare(
                        vertexA,
                        vertexB
                    );
                });
            var sorted = {};
            $.each(sortedKeys, function () {
                sorted[this] = self.vertices[this];
            });
            return sorted;
        };
        GroupRelation.prototype.getAnyVertex = function () {
            var verticesWithUri = this.getVertices();
            var verticesWithId = verticesWithUri[Object.keys(verticesWithUri)[0]];
            return verticesWithId[Object.keys(verticesWithId)[0]].vertex;
        };
        GroupRelation.prototype.addVertex = function (vertex, edge) {
            if (this.vertices[vertex.getUri()] === undefined) {
                this.vertices[vertex.getUri()] = {};
            }
            this.vertices[
                vertex.getUri()
                ][
                GraphUi.generateBubbleHtmlId()
                ] = {
                vertex: vertex,
                edge: edge
            };
        };
        GroupRelation.prototype.hasMultipleVertices = function () {
            return this.getNumberOfVertices() > 1;
        };
        GroupRelation.prototype.getNumberOfVertices = function () {
            return Object.keys(this.vertices).length;
        };
        GroupRelation.prototype.hasIdentifications = function () {
            return true;
        };
        GroupRelation.prototype.hasIdentification = function (identification) {
            var contains = false;
            $.each(this.identifiers, function () {
                if (this.getExternalResourceUri() === identification.getExternalResourceUri()) {
                    contains = true;
                    return false;
                }
            });
            return contains;
        };
        GroupRelation.prototype.addIdentification = function (identifier) {
            if(this.hasIdentification(identifier)){
                return;
            }
            this.identifiers.push(
                identifier
            );
        };
        return api;
    }
);

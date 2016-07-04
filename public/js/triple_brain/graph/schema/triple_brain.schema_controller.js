/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
        "triple_brain.schema_service",
        "triple_brain.graph_displayer",
        "triple_brain.graph_element",
        "triple_brain.graph_element_controller"
    ],
    function (SchemaService, GraphDisplayer, GraphElement, GraphElementController) {
        "use strict";
        var api = {};
        api.Self = SchemaController;
        function SchemaController(schemaUi) {
            this.schemasUi = schemaUi;
            GraphElementController.Self.prototype.init.call(
                this,
                this.schemasUi
            );
        }

        SchemaController.prototype = new GraphElementController.Self();

        SchemaController.prototype.addChildCanDo = function () {
            return this.isSingleAndOwned();
        };

        SchemaController.prototype.addChild = function () {
            var self = this;
            SchemaService.createProperty(
                this.schemasUi,
                function (propertyUri) {
                    GraphDisplayer.addProperty(
                        GraphElement.withUri(
                            propertyUri
                        ),
                        self.schemasUi
                    );
                }
            );
        };
        return api;
    }
);

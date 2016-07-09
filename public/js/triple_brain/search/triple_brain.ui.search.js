/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
        "jquery",
        "triple_brain.id_uri",
        "triple_brain.graph_displayer",
        "triple_brain.user_map_autocomplete_provider",
        "triple_brain.event_bus",
        "triple_brain.mind_map_info",
        "jquery-ui"
    ],
    function ($, IdUri, GraphDisplayer, UserMapAutocompleteProvider, EventBus, MindMapInfo) {
        "use strict";
        EventBus.subscribe('/event/ui/mind_map_info/is_view_only', function () {
            if (MindMapInfo.isAnonymous()) {
                return;
            }
            init();
        });
        EventBus.subscribe('/event/ui/flow/landing', function () {
            init();
        });
        function init() {
            getInput().empty().tripleBrainAutocomplete({
                select: function (event, ui) {
                    var elementUri = ui.item.uri;
                    window.location = IdUri.htmlUrlForBubbleUri(
                        elementUri
                    );
                },
                resultsProviders: [
                    UserMapAutocompleteProvider.toFetchOnlyCurrentUserVerticesAndSchemas()
                ]
            });
        }

        function getInput() {
            return $("#vertex-search-input");
        }
    }
);
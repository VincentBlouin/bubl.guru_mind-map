define([
    "require",
    "jquery",
    "triple_brain.event_bus",
    "triple_brain.ui.vertex",
    "triple_brain.vertex",
    "triple_brain.suggestion",
    "triple_brain.external_resource",
    "triple_brain.freebase_autocomplete_provider",
    "jquery.url"
],
    function (require, $, EventBus, Vertex, VertexService, Suggestion, ExternalResource, FreebaseAutocompleteProvider) {
        var api = {};
        api.key = "AIzaSyBHOqdqbswxnNmNb4k59ARSx-RWokLZhPA";
        api.BASE_URL = "https://www.googleapis.com/freebase/v1";
        api.SEARCH_URL = api.BASE_URL + "/search";
        api.IMAGE_URL = api.BASE_URL + "/image";
        api.thumbnailImageUrlFromFreebaseId = function(freebaseId){
            var options = {
                key: api.key,
                maxwidth:55,
                errorid : "/freebase/no_image_png"
            };
            return api.IMAGE_URL + freebaseId + "?" + $.param(options);
        };
        api.freebaseIdToURI = function (freebaseId) {
            return "http://rdf.freebase.com/rdf" + freebaseId;
        };
        api.idInFreebaseURI = function (freebaseURI) {
            return freebaseURI.replace("http://rdf.freebase.com/rdf", "");
        };
        api.isOfTypeTypeFromTypeId = function (typeId) {
            return typeId == "/type/type";
        };
        api.isFreebaseUri = function (uri) {
            return $.url(uri).attr()
                .host
                .toLowerCase()
                .indexOf("freebase.com") != -1;
        };
        api.handleIdentificationToServer = function(vertex, freebaseSuggestion, successCallBack){
            var externalResource = ExternalResource.fromFreebaseSuggestion(
                freebaseSuggestion
            );
            var typeId = getTypeId();
            if (api.isOfTypeTypeFromTypeId(typeId)) {
                vertexService().addType(
                    vertex,
                    externalResource,
                    successCallBack
                );
            } else {
                vertexService().addSameAs(
                    vertex,
                    externalResource,
                    successCallBack
                );
            }
            function getTypeId(){
                if(freebaseSuggestion.notable === undefined){
                    return "";
                }else{
                    return freebaseSuggestion.notable.id;
                }
            }
        };
        api.listPropertiesOfFreebaseTypeId = function (vertex, freebaseId) {
            Suggestion = require("triple_brain.suggestion")
            var propertiesOfTypeQuery = {
                id:freebaseId,
                type:"/type/type",
                properties:[
                    {   id:null,
                        name:null,
                        expected_type:null
                    }
                ]
            };
            $.ajax({
                type:'GET',
                url:'https://www.googleapis.com/freebase/v1/mqlread?query=' + JSON.stringify(propertiesOfTypeQuery),
                dataType:'jsonp'
            }).success(function (result) {
                    var freebaseProperties = [];
                    if (result.result) {
                        freebaseProperties = result.result.properties;
                    }
                    var suggestions = [];
                    $.each(freebaseProperties, function () {
                        var freebaseProperty = this;
                        suggestions.push(
                            Suggestion.fromFreebaseSuggestionAndTypeUri(
                                freebaseProperty,
                                api.freebaseIdToURI(
                                    result.result.id
                                )
                            )
                        )
                    })
                    vertexService().addSuggestions(
                        vertex,
                        suggestions
                    );
                })
        };
        api.removeSuggestFeatureOnVertex = function(vertex){
            $(vertex.label()).autocomplete( "destroy" );
        };

        EventBus.subscribe(
            '/event/ui/graph/vertex/type/added',
            function (event, vertex, type) {
                var typeUri = type.uri();
                if (!api.isFreebaseUri(typeUri)) {
                    return;
                }
                var typeId = api.idInFreebaseURI(typeUri);
                api.listPropertiesOfFreebaseTypeId(
                    vertex,
                    typeId
                );
                vertex.label().tripleBrainAutocomplete({
                    select:function (event, ui) {
                        var vertex = require("triple_brain.ui.vertex").withId(
                            $(this).closest(".vertex").attr("id")
                        );
                        vertex.triggerChange();
                        var searchResult = ui.item;
                        var identificationResource = ExternalResource.withUriLabelAndDescription(
                            searchResult.uri,
                            searchResult.label,
                            searchResult.description
                        );
                        vertexService().addSameAs(
                            vertex,
                            identificationResource
                        );
                    },
                    resultsProviders : [
                        require(
                            "triple_brain.freebase_autocomplete_provider"
                        ).toFetchForTypeId(typeId)
                    ]
                });
            }
        );

        EventBus.subscribe(
            '/event/ui/html/vertex/created/',
            function(event, vertex){
                prepareAsYouTypeSuggestions(vertex);
            }
        );

        function prepareAsYouTypeSuggestions(vertex){
            var vertexTypes = vertex.getTypes();
            if (vertexTypes.length == 0) {
                return;
            }
            var filterValue = "(all ";
            $.each(vertexTypes, function () {
                var identification = this;
                if (api.isFreebaseUri(identification.uri())) {
                    filterValue += "type:" + api.idInFreebaseURI(identification.uri());
                }
            });
            filterValue += ")";
            vertex.label().tripleBrainAutocomplete({
                select:function (event, ui) {
                    var vertex = require("triple_brain.ui.vertex").withId(
                        $(this).closest(".vertex").attr("id")
                    );
                    vertex.triggerChange();
                    var searchResult = ui.item;
                    var identificationResource = ExternalResource.withUriLabelAndDescription(
                        searchResult.uri,
                        searchResult.label,
                        searchResult.description
                    );
                    vertexService().addSameAs(
                        vertex,
                        identificationResource
                    );
                },
                resultsProviders : [
                    require(
                        "triple_brain.freebase_autocomplete_provider"
                    ).fetchUsingOptions({
                            filter:filterValue
                    })
                ]
            });
        };

        EventBus.subscribe(
            '/event/ui/graph/vertex/type/removed',
            function(event, vertex, removedType){
                if (api.isFreebaseUri(removedType.uri())) {
                    api.removeSuggestFeatureOnVertex(
                        vertex
                    );
                }
            }
        );
        function vertexService(){
            return VertexService === undefined ?
                require("triple_brain.vertex") :
                VertexService;
        }
        return api;
    }
);
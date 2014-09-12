/*
 * Copyright Vincent Blouin under the Mozilla Public License 1.1
 */
define([
    "jquery",
    "triple_brain.user",
    "triple_brain.id_uri",
    "triple_brain.mind_map_info"
], function ($, UserService, IdUri, MindMapInfo) {
    "use strict";
    var api = {},
        baseUri;
    api.create = function (callback) {
        var response = $.ajax({
            type: 'POST',
            url: getBaseUri()
        }).success(function () {
            callback(
                IdUri.resourceUriFromAjaxResponse(
                    response
                )
            );
        });
    };
    api.get = function(uri, callback){
        $.ajax({
            type: 'GET',
            url: adaptSchemaUri(uri)
        }).success(callback);
    };
    api.createProperty = function(schema, callback){
        var response = $.ajax({
            type: 'POST',
            url: schema.getUri() + "/property"
        }).success(function () {
            callback(
                IdUri.resourceUriFromAjaxResponse(
                    response
                )
            );
        });
    };
    return api;
    function getBaseUri(){
        if(baseUri === undefined){
            baseUri = UserService.currentUserUri() + "/graph/schema";
        }
        return baseUri;
    }
    function adaptSchemaUri(uri){
        if (MindMapInfo.isAnonymous() || !IdUri.isGraphElementUriOwnedByCurrentUser(uri)) {
            return "/service/users/" +
                IdUri.getOwnerFromUri(uri) +
                "/non_owned/schema/" +
                IdUri.getSchemaShortId(uri);
        }
        return uri;
    }
});
/*
 * Copyright Mozilla Public License 1.1
 */
define([
    "triple_brain.image"
], function (Image) {
    var api = {};
    api.fromServerFormat = function (serverFormat) {
        return new api.Object(
            serverFormat
        );
    };
    api.buildObjectWithUri = function (uri) {
        return {
            uri : uri,
            label: ""
        };
    };
    api.Object = function (serverFormat) {
        var _images = buildImages();
        this.getLabel = function () {
            return serverFormat.label;
        };
        this.getComment = function () {
            return serverFormat.comment;
        };
        this.getImages = function () {
            return _images;
        };
        this.getUri = function () {
            return serverFormat.uri;
        };
        function buildImages() {
            return undefined === serverFormat.images ?
                [] :
                Image.arrayFromServerJson(
                    serverFormat.images
                );
        }
    };
    return api;
});
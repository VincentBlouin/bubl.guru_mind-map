/*
 * Copyright Vincent Blouin under the Mozilla Public License 1.1
 */
define([
    "triple_brain.image",
    "jquery.json.min"
], function (Image) {
    "use strict";
    var api = {};
    api.fromServerFormat = function (serverFormat) {
        return new api.Self().init(serverFormat);
    };
    api.buildObjectWithUri = function (uri) {
        return {
            uri : uri,
            label: ""
        };
    };
    api.withUri = function (uri) {
        return api.withUriAndLabel(
            uri,
            ""
        );
    };
    api.withUriAndLabel = function (uri, label) {
        return api.fromServerFormat({
                uri : uri,
                label: label
            }
        );
    };
    api.withLabel = function(label){
        return api.fromServerFormat({
            label : label
        });
    };
    api.withLabelAndDescription = function(label, description){
        return api.fromServerFormat({
            label : label,
            description: description
        });
    };
    api.withUriLabelAndDescription = function (uri, label, description) {
        return api.fromServerFormat({
                uri : uri,
                label: label,
                comment: description
            }
        );
    };
    api.Self = function () {};

    api.Self.prototype.init = function(friendlyResourceServerFormat){
        this.friendlyResourceServerFormat = friendlyResourceServerFormat;
        this._images = this._buildImages();
        if(friendlyResourceServerFormat.comment === undefined){
            friendlyResourceServerFormat.comment = "";
        }
        return this;
    };

    api.Self.prototype.getLabel = function () {
        return this.friendlyResourceServerFormat.label;
    };
    api.Self.prototype.getComment = function () {
        return this.friendlyResourceServerFormat.comment;
    };
    api.Self.prototype.setComment = function(comment){
        return this.friendlyResourceServerFormat.comment = comment;
    };
    api.Self.prototype.hasComment = function(){
        return this.friendlyResourceServerFormat.comment.length > 0;
    };
    api.Self.prototype.addImage = function(image){
        this._images.push(image);
    };
    api.Self.prototype.getImages = function () {
        return this._images;
    };
    api.Self.prototype.hasImages = function(){
        return this._images.length > 0;
    };
    api.Self.prototype.setUri = function(uri){
        this.friendlyResourceServerFormat.uri = uri;
    };
    api.Self.prototype.getUri = function () {
        return this.friendlyResourceServerFormat.uri;
    };
    api.Self.prototype.getJsonFormat = function () {
        var self = this;
        return $.toJSON(
            self.getServerFormat()
        );
    };
    api.Self.prototype.getServerFormat = function () {
        return this.friendlyResourceServerFormat
    };
    api.Self.prototype._buildImages = function(){
        return undefined === this.friendlyResourceServerFormat.images ?
            [] :
            Image.arrayFromServerJson(
                this.friendlyResourceServerFormat.images
            );
    };
    return api;
});
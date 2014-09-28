/*
 * Copyright Vincent Blouin under the Mozilla Public License 1.1
 */
define([
    "triple_brain.edge"
], function(Edge){
    var api = {};
    api.fromServerFormat = function(serverFormat){
        return new Object(
            serverFormat
        );
    };
    function Object(serverFormat){
        Edge.Self.apply(
            this
        );
        this.init(serverFormat.edge);
    }
    Object.prototype = new Edge.Self;
    Object.prototype.isVertex = function(){
        return false;
    };
    return api;
});
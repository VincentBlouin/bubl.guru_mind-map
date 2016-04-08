/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "triple_brain.event_bus"
], function ($, EventBus) {
    "use strict";
    var api = {};
    api.isBubbleCloudFlow = function(){
        return "centersCloud" === bublGuruFlow;
    };
    api.publishFlow = function(flow){
        EventBus.publish(
            '/event/ui/flow/' + flow
        );
    };
    api.showOnlyFlow = function(flow){
        api.hideAllFlowSpecificHtml();
        $("[data-flow='"+flow+"']").removeClass("hidden");
    };
    api.hideAllFlowSpecificHtml = function(){
        $("[data-flow]").addClass("hidden");
    };
    return api;
});
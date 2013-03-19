/**
 * Copyright Mozilla Public License 1.1
 */
define([
    "require",
    "jquery",
    "./triple_brain.template.vertices_list.js",
    "triple_brain.ui.left_panel",
    "./triple_brain.template.vertices_list.js"
],
    function(require, $, Template, LeftPanel, VerticesList) {
        var api = {
            create : function(){
                return new VerticesListCreator().create()
            }
        };
        function VerticesListCreator(){
            var html = Template['panel'].merge();
            this.create = function(){
                VerticesList = require("./triple_brain.module.vertices_list");
                LeftPanel.addHTML(html);
                addTitle();
                addSortMenu();
                addVerticesList();
                $('.sort-vertices-btn').css('padding', '0px');
                $('#sort-by-label').click(function() {
                    var verticesList = VerticesList.get();
                    verticesList.sortByLabel();
                });
                $('#sort-by-min-number-of-edges-from-center-vertex').click(function() {
                    var verticesList = VerticesList.get();
                    verticesList.sortByDistanceFromCentralVertex();
                });
                return VerticesList.get();
            }

            function addTitle(){
                $(html).append(
                    Template['title'].merge()
                )
            }
            function addSortMenu(){
                var sortMenu = Template['sort_menu'].merge();
                $(html).append(sortMenu);
                var title = Template['sort_menu_title'].merge();
                $(sortMenu).append(title);
                var optionsList = Template['options_list'].merge();
                $(sortMenu).append(optionsList);
                var sortByLabelOption = Template['sort_by_label_option'].merge();
                $(optionsList).append(sortByLabelOption);
                var sortByDistanceFromCentralVertex = Template['sort_by_distance_from_central_vertex'].merge();
                $(optionsList).append(sortByDistanceFromCentralVertex);
            }
            function addVerticesList(){
                $(html).append(
                    Template['vertices_list'].merge()
                );
            }
        }
        return api;
    }
);
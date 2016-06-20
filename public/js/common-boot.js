/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

requirejs.config({
    baseUrl: '/js',
    paths: {
        "locales": '../locales',
        "test": '../../spec',
        "module": '../module',
        "md5" : "vendor/md5.min",
        "polyk" : "vendor/polyk",
        "diff_match_patch" : "vendor/diff_match_patch_uncompressed",
        "jquery": "jquery/jquery-2.2.4",
        "jquery.performance": "jquery/jquery.performance",
        "jquery.safer-html": "jquery/jquery.safer-html",
        "jquery-ui": "jquery/jquery-ui-11-4/jquery-ui.min",
        "jquery.url": "jquery/jquery.url",
        "jquery.nano": "jquery/jquery.nano",
        "jquery.tinysort.min": "jquery/jquery.tinysort.min",
        "jquery.cookie": "jquery/jquery.cookie",
        "jquery.colorbox": "jquery/jquery.colorbox-min",
        "jquery.focus-end": "jquery/jquery.focus-end",
        "jquery.center-on-screen": "jquery/jquery.center-on-screen",
        "jquery.is-fully-on-screen": "jquery/jquery.is-fully-on-screen",
        "jquery.i18next": "vendor/i18next.amd.withJQuery-1.6.3",
        "masonry": "vendor/masonry.pkgd.min",
        "bootstrap": "vendor/bootstrap/3.3.4/bootstrap.min",
        "bootstrap-datepicker": "vendor/bootstrap/bootstrap-datepicker",
        //"bootstrap-modal-carousel" : "vendor/bootstrap/bootstrap-modal-carousel",
        "ekko-lightbox" : "vendor/bootstrap/ekko-lightbox",
        "jquery.max_char": "triple_brain/jquery.max_char",
        "jquery.hotkeys": "jquery/jquery.hotkeys",
        "google-code-prettify":"bower_components/google-code-prettify/bin/prettify.min",
        "bootstrap-wysiwyg": "jquery/bootstrap-wysiwyg.min",
        "dragscroll": "vendor/dragscroll",
        "jquery.triple_brain.search": "triple_brain/search/jquery.triple_brain.search",
        "triple_brain.identified_to_service": "triple_brain/graph/triple_brain.identified_to_service",
        "triple_brain.flow": "triple_brain/flow/triple_brain.flow",
        "triple_brain.mind_map_flow": "triple_brain/flow/triple_brain.mind_map_flow",
        "triple_brain.other_user_flow": "triple_brain/flow/triple_brain.other_user_flow",
        "triple_brain.fork_service": "triple_brain/graph/triple_brain.fork_service",
        "triple_brain.visited_elements_cloud": "triple_brain/triple_brain.visited_elements_cloud",
        "triple_brain.center_graph_elements": "triple_brain/triple_brain.center_graph_elements",
        "triple_brain.center_graph_element_service": "triple_brain/triple_brain.center_graph_element_service",
        "triple_brain.bubble_cloud_flow": "triple_brain/flow/triple_brain.bubble_cloud_flow",
        "triple_brain.big_search_box": "triple_brain/search/triple_brain.big_search_box",
        "triple_brain.object_utils": "triple_brain/triple_brain.object_utils",
        "triple_brain.selection_handler": "triple_brain/triple_brain.selection_handler",
        "triple_brain.scroll_on_mouse_frontier": "triple_brain/triple_brain.scroll_on_mouse_frontier",
        "triple_brain.header": "triple_brain/triple_brain.header",
        "triple_brain.language_manager": "triple_brain/triple_brain.language_manager",
        "triple_brain.external_page_loader": "triple_brain/triple_brain.external_page_loader",
        "triple_brain.graph_element_button": "triple_brain/triple_brain.graph_element_button",
        "triple_brain.graph_element_main_menu": "triple_brain/triple_brain.graph_element_main_menu",
        "triple_brain.graph_element_menu": "triple_brain/triple_brain.graph_element_menu",
        "triple_brain.compare_flow": "triple_brain/compare/triple_brain.compare_flow",
        "triple_brain.graph_compare": "triple_brain/compare/triple_brain.graph_compare",
        "triple_brain.graph_modal_menu": "triple_brain/display/menu/triple_brain.graph_modal_menu",
        "triple_brain.ui.utils": "triple_brain/triple_brain.ui.utils",
        "triple_brain.user_service": "triple_brain/triple_brain.user_service",
        "triple_brain.login_handler": "triple_brain/triple_brain.login_handler",
        "triple_brain.register_handler": "triple_brain/triple_brain.register_handler",
        "triple_brain.change_password": "triple_brain/triple_brain.change_password",
        "triple_brain.event_bus": "triple_brain/triple_brain.event_bus",
        "triple_brain.group_relation": "triple_brain/graph/triple_brain.group_relation",
        "triple_brain.group_relation_ui": "triple_brain/graph/triple_brain.group_relation_ui",
        "triple_brain.group_relation_html_builder":"triple_brain/display/tree/relative/group_relation/triple_brain.group_relation_html_builder",
        "triple_brain.identification": "triple_brain/triple_brain.identification",
        "triple_brain.friendly_resource": "triple_brain/triple_brain.friendly_resource",
        "triple_brain.graph_element": "triple_brain/graph/graph_element/triple_brain.graph_element",
        "triple_brain.graph_element_service": "triple_brain/graph/graph_element/triple_brain.graph_element_service",
        "triple_brain.graph_element_ui": "triple_brain/graph/graph_element/triple_brain.graph_element_ui",
        "triple_brain.graph_ui": "triple_brain/graph/triple_brain.graph_ui",
        "triple_brain.vertex": "triple_brain/graph/vertex/triple_brain.vertex",
        "triple_brain.vertex_server_format_builder": "triple_brain/graph/vertex/triple_brain.vertex_server_format_builder",
        "triple_brain.vertex_ui": "triple_brain/graph/vertex/triple_brain.vertex_ui",
        "triple_brain.ui.vertex_segments": "triple_brain/graph/vertex/triple_brain.ui.vertex_segments",
        "triple_brain.search_result": "triple_brain/search/triple_brain.search_result",
        "triple_brain.search": "triple_brain/search/triple_brain.search",
        "triple_brain.ui.search": "triple_brain/search/triple_brain.ui.search",
        "triple_brain.user_map_autocomplete_provider": "triple_brain/search/autocomplete_results_provider/triple_brain.user_map_autocomplete_provider",
        "triple_brain.wikidata_autocomplete_provider": "triple_brain/search/autocomplete_results_provider/triple_brain.wikidata_autocomplete_provider",
        "triple_brain.mind-map_template": "triple_brain/triple_brain.mind-map_template",
        "triple_brain.id_uri": "triple_brain/triple_brain.id_uri",
        "triple_brain.identified_bubble": "triple_brain/graph/triple_brain.identified_bubble",
        "triple_brain.vertex_service": "triple_brain/graph/vertex/triple_brain.vertex_service",
        "triple_brain.edge": "triple_brain/graph/edge/triple_brain.edge",
        "triple_brain.edge_ui": "triple_brain/graph/edge/triple_brain.edge_ui",
        "triple_brain.edge_service": "triple_brain/graph/edge/triple_brain.edge_service",
        "triple_brain.suggestion": "triple_brain/graph/vertex/suggestion/triple_brain.suggestion",
        "triple_brain.suggestion_origin": "triple_brain/graph/vertex/suggestion/triple_brain.suggestion_origin",
        "triple_brain.suggestion_service": "triple_brain/graph/vertex/suggestion/triple_brain.suggestion_service",
        "triple_brain.identification_context": "triple_brain/triple_brain.identification_context",
        "triple_brain.identification_menu": "triple_brain/graph/triple_brain.identification_menu",
        "triple_brain.link_to_far_vertex_menu": "triple_brain/graph/vertex/triple_brain.link_to_far_vertex_menu",
        "triple_brain.included_graph_elements_menu": "triple_brain/graph/vertex/triple_brain.included_graph_elements_menu",
        "triple_brain.image_displayer": "triple_brain/graph/vertex/triple_brain.image_displayer",
        "triple_brain.delete_menu": "triple_brain/graph/triple_brain.delete_menu",
        "triple_brain.image_menu": "triple_brain/graph/vertex/triple_brain.image_menu",
        "triple_brain.ui.all": "triple_brain/triple_brain.ui.all",
        "triple_brain.point": "triple_brain/triple_brain.point",
        "triple_brain.segment": "triple_brain/triple_brain.segment",
        "triple_brain.ui.vertex_hidden_neighbor_properties_indicator": "triple_brain/graph/vertex/hidden_neighbor_properties/triple_brain.ui.vertex_hidden_neighbor_properties_indicator",
        "triple_brain.wikidata": "triple_brain/triple_brain.wikidata",
        "triple_brain.wikidata_uri": "triple_brain/triple_brain.wikidata_uri",
        "triple_brain.transform_matrix_2d": "triple_brain/triple_brain.transform_matrix_2d",
        "triple_brain.error": "triple_brain/triple_brain.error",
        "triple_brain.triple": "triple_brain/graph/triple_brain.triple",
        "triple_brain.triple_ui": "triple_brain/graph/triple_brain.triple_ui",
        "triple_brain.triple_ui_builder": "triple_brain/graph/triple_brain.triple_ui_builder",
        "triple_brain.template": "triple_brain/triple_brain.template",
        "triple_brain.image": "triple_brain/triple_brain.image",
        "triple_brain.graph_service": "triple_brain/graph/triple_brain.graph_service",
        "triple_brain.sub_graph": "triple_brain/graph/triple_brain.sub_graph",
        "triple_brain.graph_displayer": "triple_brain/display/triple_brain.graph_displayer",
        "triple_brain.graph_displayer_factory": "triple_brain/display/triple_brain.graph_displayer_factory",
        "triple_brain.vertex_html_builder_common": "triple_brain/display/triple_brain.vertex_html_builder_common",
        "triple_brain.group_relation_menu_handler" : "triple_brain/display/tree/relative/group_relation/triple_brain.group_relation_menu_handler",
        "triple_brain.graph_displayer_as_relative_tree": "triple_brain/display/tree/relative/triple_brain.graph_displayer_as_relative_tree",
        "triple_brain.keyboard_actions_handler": "triple_brain/display/tree/relative/triple_brain.keyboard_actions_handler",
        "triple_brain.relative_tree_graph_menu_handler": "triple_brain/display/tree/relative/triple_brain.relative_tree_graph_menu_handler",
        "triple_brain.graph_element_menu_handler": "triple_brain/display/triple_brain.graph_element_menu_handler",
        "triple_brain.edge_html_builder": "triple_brain/display/tree/relative/edge/triple_brain.edge_html_builder",
        "triple_brain.edge_html_builder_common": "triple_brain/display/tree/relative/edge/triple_brain.edge_html_builder_common",
        "triple_brain.graph_element_html_builder": "triple_brain/display/tree/relative/triple_brain.graph_element_html_builder",
        "triple_brain.edge_html_builder_view_only": "triple_brain/display/tree/relative/edge/triple_brain.edge_html_builder_view_only",
        "triple_brain.relative_tree_vertex": "triple_brain/display/tree/relative/vertex/triple_brain.relative_tree_vertex",
        "triple_brain.center_bubble": "triple_brain/display/tree/relative/vertex/triple_brain.center_bubble",
        "triple_brain.relative_tree_vertex_menu_handler": "triple_brain/display/tree/relative/vertex/triple_brain.relative_tree_vertex_menu_handler",
        "triple_brain.schema_menu_handler": "triple_brain/display/tree/relative/schema/triple_brain.schema_menu_handler",
        "triple_brain.vertex_html_builder": "triple_brain/display/tree/relative/vertex/triple_brain.vertex_html_builder",
        "triple_brain.vertex_html_builder_view_only": "triple_brain/display/tree/relative/vertex/triple_brain.vertex_html_builder_view_only",
        "triple_brain.relative_tree_displayer_templates": "triple_brain/display/tree/relative/triple_brain.relative_tree_displayer_templates",
        "triple_brain.tree_edge": "triple_brain/display/tree/triple_brain.tree_edge",
        "triple_brain.tree_edge_menu_handler": "triple_brain/display/tree/triple_brain.tree_edge_menu_handler",
        "triple_brain.bubble": "triple_brain/display/tree/triple_brain.bubble",
        "triple_brain.bubble_factory": "triple_brain/triple_brain.bubble_factory",
        "triple_brain.graph_displayer_as_tree_common": "triple_brain/display/tree/triple_brain.graph_displayer_as_tree_common",
        "triple_brain.mind_map_info": "triple_brain/triple_brain.mind_map_info",
        "triple_brain.schema_service" : "triple_brain/graph/schema/triple_brain.schema_service",
        "triple_brain.schema" : "triple_brain/graph/schema/triple_brain.schema",
        "triple_brain.property" : "triple_brain/graph/schema/triple_brain.property",
        "triple_brain.schema_html_builder": "triple_brain/display/tree/relative/schema/triple_brain.schema_html_builder",
        "triple_brain.schema_ui" : "triple_brain/graph/schema/triple_brain.schema_ui",
        "triple_brain.property_ui" : "triple_brain/graph/schema/triple_brain.property_ui",
        "triple_brain.property_html_builder": "triple_brain/display/tree/relative/schema/triple_brain.property_html_builder",
        "triple_brain.property_menu_handler": "triple_brain/display/tree/relative/schema/triple_brain.property_menu_handler",
        "triple_brain.friendly_resource_service": "triple_brain/triple_brain.friendly_resource_service",
        "triple_brain.schema_suggestion" : "triple_brain/triple_brain.schema_suggestion",
        "triple_brain.suggestion_bubble_html_builder" : "triple_brain/display/tree/relative/suggestion_bubble/triple_brain.suggestion_bubble_html_builder",
        "triple_brain.suggestion_bubble_ui" : "triple_brain/display/tree/relative/suggestion_bubble/triple_brain.suggestion_bubble_ui",
        "triple_brain.suggestion_bubble_menu_handler" : "triple_brain/display/tree/relative/suggestion_bubble/triple_brain.suggestion_bubble_menu_handler",
        "triple_brain.suggestion_relation_builder" : "triple_brain/display/tree/relative/suggestion_bubble/triple_brain.suggestion_relation_builder",
        "triple_brain.suggestion_relation_ui" : "triple_brain/display/tree/relative/suggestion_bubble/triple_brain.suggestion_relation_ui",
        "triple_brain.suggestion_relation_menu_handler" : "triple_brain/display/tree/relative/suggestion_bubble/triple_brain.suggestion_relation_menu_handler",
        "triple_brain.graph_element_type" : "triple_brain/graph/triple_brain.graph_element_type",
        "triple_brain.landing_page_flow": "triple_brain/flow/triple_brain.landing_page_flow",
        "triple_brain.schema_list_flow": "triple_brain/flow/triple_brain.schema_list_flow",
        "triple_brain.modules": "triple_brain/triple_brain.modules",
        "triple_brain.module.date_picker": "module/date_picker/triple_brain.module.date_picker"
    },
    shim: {
        "polyk": [],
        "diff_match_patch":[],
        "jquery-ui": ["jquery"],
        "jquery.url": ["jquery"],
        "jquery.nano": ["jquery"],
        "jquery.tinysort.min": ["jquery"],
        "jquery.cookie": ["jquery"],
        "jquery.cometd": ["jquery"],
        "jquery.cometd-ack": ["jquery"],
        "jquery.cometd-reload": ["jquery"],
        "jquery.cometd-timestamp": ["jquery"],
        "jquery.cometd-timesync": ["jquery"],
        "jquery.colorbox": ["jquery"],
        "jquery.hotkeys":["jquery"],
        "bootstrap": ["jquery"],
        "bootstrap-datepicker": ["bootstrap"],
        "bootstrap-wysiwyg":["jquery", "bootstrap", "jquery.hotkeys", "google-code-prettify"]
    }
});
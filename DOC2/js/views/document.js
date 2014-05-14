/*global define*/
define([
    'underscore',
    'backbone',
    'mustache',
    'views/document-menu',
    'views/attribute-frame'
], function (_, Backbone, Mustache, ViewDocumentMenu, ViewAttributeFrame) {
    'use strict';

    return Backbone.View.extend({

        className : "dcpDocument",

        initialize : function () {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'beginSave', this.showThrobber);
            this.listenTo(this.model, 'endSave', this.hideThrobber);
            this.template = this.model.get("template") || window.dcp.template.doc;
        },

        render : function() {
            var $content, model = this.model;
            //add document base
            this.$el.empty().append($(Mustache.render(this.template, this.model.toJSON())));
            //add menu
            this.$el.find(".dcpDocument-menu").append(new ViewDocumentMenu({model : this.model}).render().$el);
            //add first level attributes
            $content = this.$el.find(".dcp-document-form");
            _.each(this.model.get("attributes-definition"), function(currentAttr) {
                var view;
                if (currentAttr.type === "frame") {
                    view = new ViewAttributeFrame({model : model.get("attributes").get(currentAttr.id)});
                }
                $content.prepend(view.render().$el);
            });
            return this;
        },

        showThrobber : function() {
            this.$el.find(".dcpDocument--loading").show();
            this.$el.find(".dcpDocument-content,.dcpDocument-menu").hide();
        },

        hideThrobber : function() {
            this.$el.find(".dcpDocument--loading").hide();
            this.$el.find(".dcpDocument-content,.dcpDocument-menu").show();
        }
    });

});
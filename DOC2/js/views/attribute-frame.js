/*global define*/
define([
    'underscore',
    'backbone',
    'mustache',
    'views/attribute',
    'views/attribute-array'
], function (_, Backbone, Mustache, ViewAttribute, ViewAttributeArray) {
    'use strict';

    return Backbone.View.extend({

        className : "panel panel-default css-frame frame",

        initialize : function () {
            this.listenTo(this.model, 'change:label', this.updateLabel);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = this.model.get("template") || window.dcp.template.frame;
        },

        render : function () {
            var $content;
            this.$el.empty().append($(Mustache.render(this.template, this.model.toJSON())));
            $content = this.$el.find(".frame--content");
            this.model.get("children").each(function (currentAttr) {
                var view;
                if (currentAttr.get("type") === "array") {
                    view = new ViewAttributeArray({model : currentAttr});
                } else {
                    view = new ViewAttribute({model : currentAttr});
                }
                $content.append(view.render().$el);
            });
            return this;
        },

        updateLabel : function() {
            this.$el.find(".frame--head").text(this.model.get("label"));
        }
    });

});
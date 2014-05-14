/*global define*/
define([
    'underscore',
    'backbone',
    'mustache'
], function (_, Backbone, Mustache) {
    'use strict';

    return Backbone.View.extend({

        className : "col-sm-9 css-attr-content",

        events : {
                 "change .attr--content" : "updateModel"
        },

        initialize : function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = this.model.get("template") || window.dcp.template.text;
        },

        render : function () {
            this.$el.append($(Mustache.render(this.template, this.model.toJSON())));
            this.$el.find(".attr--content").kendoDatePicker({
                culture : "fr-FR"
            });
            return this;
        },

        updateModel : function() {
            this.model.set("value", this.$el.find(".attr--content").val());
        }
    });

});
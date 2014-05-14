/*global define*/
define([
    'underscore',
    'backbone',
    'mustache'
], function (_, Backbone, Mustache) {
    'use strict';

    return Backbone.View.extend({

        tagName : "td",
        className : "array--header--cell",

        initialize : function () {
            this.listenTo(this.model, 'change:label', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template =  window.dcp.template.array_header;
        },

        render : function () {
            this.$el.empty().append($(Mustache.render(this.template, this.model.toJSON())));
            return this;
        },

        updateLabel : function () {
            this.$el.find(".array--head").text(this.model.get("label"));
        }
    });

});
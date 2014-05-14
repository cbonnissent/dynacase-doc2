/*global define*/
define([
    'underscore',
    'backbone',
    'mustache'
], function (_, Backbone, Mustache) {
    'use strict';

    return Backbone.View.extend({

        className : "dcpDocument",

        events : {
                 "click .menu--save" : "save"
        },

        initialize : function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = this.model.get("template") || window.dcp.template.menu;
        },

        render : function () {
            var elements = $(Mustache.render(this.template, this.model.toJSON()));
            this.$el.empty().append(elements);
            return this;
        },

        save : function(event) {
            event.preventDefault();
            this.model.trigger("save");
        }
    });

});
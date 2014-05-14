/*global define*/
define([
    'underscore',
    'backbone',
    'mustache'
], function (_, Backbone, Mustache) {
    'use strict';

    return Backbone.View.extend({

        tagName : "td",

        className : "css-attr-content",

        events : {
            "change .attr--content" : "updateModel"
        },

        initialize : function (options) {
            if (!_.isNumber(options.lineNumber)) {
                throw "You need a line number to display an array like attribute";
            }
            this.lineNumber = options.lineNumber;
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = this.model.get("template") || window.dcp.template.docid;
        },

        render : function () {
            this.$el.append($(Mustache.render(this.template, this.model.toLineNumber(this.lineNumber))));
            /*this.$el.find(".attr--content").kendoDatePicker({
             culture : "fr-FR"
             });*/
            return this;
        },

        updateModel : function () {
            this.model.set("value", this.$el.find(".attr--content").val());
        }
    });

});
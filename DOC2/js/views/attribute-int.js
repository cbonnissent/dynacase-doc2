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
            this.listenTo(this.model, 'change:value', this.updateValue);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = this.model.get("template") || window.dcp.template.int;
        },

        render : function () {
            this.$el.append($(Mustache.render(this.template, this.model.toJSON())));
            this.$el.find(".attr--content").kendoNumericTextBox({
                culture : "fr",
                decimals : 0
            });
            return this;
        },

        updateValue : function () {
            this.$el.find("#"+this.model.id).data("kendoNumericTextBox").value(this.model.get("value"));
        },

        updateModel : function () {
            this.model.set("value", this.$el.find("#" + this.model.id).data("kendoNumericTextBox").value());
        }
    });

});
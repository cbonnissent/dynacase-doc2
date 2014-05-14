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
            this.listenTo(this.model, 'change:value', this.updateValue);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = this.model.get("template") || window.dcp.template.date;
        },

        render : function () {
            this.$el.append($(Mustache.render(this.template, this.model.toLineNumber(this.lineNumber))));
            this.$el.find(".attr--content").kendoDatePicker({
                culture : "fr-FR",
                value : this.model.get("value")[this.lineNumber] ? new Date(this.model.get("value")[this.lineNumber]) : ""
            });
            this.$el.find(".k-select").addClass("btn-default");
            return this;
        },

        updateModel : function () {
            var value = this.model.get("value"), newValue = this._getKendoWidget().value();
            newValue = new Date(newValue);
            value[this.lineNumber] = newValue.getFullYear()+"-"+this._padding(newValue.getMonth()+1)+"-"+ this._padding(newValue.getDate());
            this.model.set("value", value);
        },

        updateValue : function() {
            var date = this.model.get("value")[this.lineNumber] ? new Date(this.model.get("value")[this.lineNumber]) : "";
            this._getKendoWidget().value(new Date(this.model.get("value")[this.lineNumber]));
        },

        _getKendoWidget : function() {
            return this.$el.find("#" + this.lineNumber + "__" + this.model.id).data("kendoDatePicker");
        },

        _padding : function(value) {
            if (value < 10) {
                return "0"+value;
            }
            return value;
        }
    });

});
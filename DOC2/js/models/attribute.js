/*global define*/
define([
    'underscore',
    'backbone'
], function (_, Backbone, CollectionAttributes) {
    'use strict';

    return Backbone.Model.extend({

        defaults : {
              children : [],
              valueAttribute : true,
              multiple : false
        },

        initialize : function() {
            var value, currentModel = this;
            if (this.get("type") === "frame" || this.get("type") === "array" || this.get("type") === "tab") {
                this.set("valueAttribute", false);
            }
            if (this.get("type") === "date") {
                value = this.get("value");
                if (_.isArray(value)) {
                    value = _.map(value, function(currentValue) {
                        var value = new Date(currentValue.date);
                        return value.getFullYear() + "-" + currentModel._padding(value.getMonth() + 1) + "-" + currentModel._padding(value.getDate());
                    });
                } else {
                    value = new Date(value.date);
                    value = value.getFullYear() + "-" + currentModel._padding(value.getMonth() + 1) + "-" + currentModel._padding(value.getDate());
                }
                this.set("value", value);
            }
            this.on("change:value", this.checkNbLine);
        },

        toLineNumber : function(lineNumber) {
            var json;
            if (!_.isNumber(lineNumber)) {
                throw "lineNumber must be a number";
            }
            if (this.get("multiple") === false) {
                throw "You can't get line number on single attribute type";
            }
            json = this.toJSON();
            json.id = lineNumber+"__"+json.id;
            json.value = json.value[lineNumber];
            json.formattedValue = json.formattedValue[lineNumber];
            return json;
        },

        convertChildren : function(attributes, CollectionAttributes) {
            var children = this.get("children"), collection = new CollectionAttributes();
            _.each(children, function(currentChild) {
                collection.push(attributes.get(currentChild.id));
            });
            this.set("children", collection);
        },

        checkNbLine : function(model, value) {
            if (this.get("multiple") === false) {
                return;
            }
           if (this.previous("value").length !== value.length) {
               this.trigger("nbLines");
           }
        },

        _padding : function (value) {
            if (value < 10) {
                return "0" + value;
            }
            return value;
        }

    });
});
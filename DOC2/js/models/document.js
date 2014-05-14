/*global define*/
define([
    'underscore',
    'backbone',
    'collections/attributes'
], function (_, Backbone, CollectionAttributes) {
    'use strict';

    var flattenAttributes = function(currentAttributes, attributes) {
        if (!_.isArray(attributes)) {
            attributes = _.values(attributes);
        }
        currentAttributes = _.union(currentAttributes, attributes);
        _.each(attributes, function(currentAttr) {
            if (currentAttr.children) {
                currentAttributes = _.union(currentAttributes, flattenAttributes(currentAttributes, currentAttr.children));
            }
        });
        return currentAttributes;
    };

    return Backbone.Model.extend({

        initialize : function(properties, options) {
            var currentAttributes = flattenAttributes([], options.attributes),
                attributes = new CollectionAttributes(currentAttributes);
            this.set("attributes-definition", options.attributes);
            this.set("attributes", attributes);
            attributes.each(function(currentAttribute) {
                currentAttribute.convertChildren(attributes, CollectionAttributes);
            });
            this.listenTo(this, "save", this.save);
        },

        getValues : function() {
            var values = {}, attributes;
            attributes = this.get("attributes").filter(function (attribute) {
                return attribute.get("valueAttribute");
            });
            _.each(attributes, function (attribute) {
                values[attribute.id] = attribute.get("value");
            });
            return values;
        },

        save : function() {
            var currentModel = this;
            currentModel.trigger("beginSave");
            $.post("?app=DOC2&action=SAVE_DOC", {id : this.id, values : JSON.stringify(this.getValues())}).always(
                function() {
                    currentModel.trigger("endSave");
                }
            );
        }

    });

});
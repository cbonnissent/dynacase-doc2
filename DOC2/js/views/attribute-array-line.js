/*global define*/
define([
    'underscore',
    'backbone',
    'mustache',
    'views/attribute-date-array',
    'views/attribute-docid-array'
], function (_, Backbone, Mustache, ViewDateArray, ViewDocidArray) {
    'use strict';

    return Backbone.View.extend({

        tagName :   "tr",
        className : "array--content--line",

        initialize : function (options) {
            if (!_.isNumber(options.lineNumber)) {
                throw "You need a line number to display an array like attribute";
            }
            this.lineNumber = options.lineNumber;
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = window.dcp.template.array_line;
        },

        render : function () {
            var currentView = this;
            this.$el.empty().append($(Mustache.render(this.template, this.model.toJSON())));
            this.model.get("children").each(function(attribute) {
                var contentView;
                if (attribute.get("type") === "docid") {
                    contentView = new ViewDocidArray({model : attribute, lineNumber : currentView.lineNumber});
                    currentView.$el.append(contentView.render().$el);
                } else if (attribute.get("type") === "date") {
                    contentView = new ViewDateArray({model : attribute, lineNumber : currentView.lineNumber});
                    currentView.$el.append(contentView.render().$el);
                }
            });
            return this;
        }
    });

});
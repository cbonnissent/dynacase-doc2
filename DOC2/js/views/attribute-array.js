/*global define*/
define([
    'underscore',
    'backbone',
    'mustache',
    'views/attribute-array-header',
    'views/attribute-array-line'
], function (_, Backbone, Mustache, ViewHeader, ViewLine) {
    'use strict';

    return Backbone.View.extend({

        className : "panel panel-default css-array array",

        initialize : function () {
            this.listenTo(this.model, 'change:label', this.updateLabel);
            this.listenTo(this.model.get("children"), "nbLines", this.renderLines);
            this.listenTo(this.model, 'destroy', this.remove);
            this.lines = {};
            this.template = {
                array : window.dcp.template.array,
                line : window.dcp.template.array_line
            };
        },

        render : function () {
            this.$el.empty().append($(Mustache.render(this.template.array, this.model.toJSON())));
            this.renderHeader();
            this.renderLines();
            return this;
        },

        renderHeader : function() {
            var $content = this.$el.find(".array--content--head");
            this.model.get("children").each(function(currentAttr) {
                var view = new ViewHeader({model : currentAttr});
                $content.append(view.render().$el);
            });

        },

        renderLines : function() {
            var $content, nbLigne = 0, i = 0, line;
            this.model.get("children").each(function (currentAttr) {
                if (nbLigne < currentAttr.get("value").length) {
                    nbLigne = currentAttr.get("value").length;
                }
            });
            $content = this.$el.find(".array--content--body").empty();
            for (i = 0; i < nbLigne; i++) {
                line = new ViewLine({model : this.model, lineNumber : i});
                $content.append(line.render().$el);
            }
        },

        updateLabel : function () {
            this.$el.find(".array--head").text(this.model.get("label"));
        }
    });

});
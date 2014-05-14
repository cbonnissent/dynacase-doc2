/*global define*/
define([
    'underscore',
    'backbone',
    'mustache',
    'views/attribute-text',
    'views/attribute-int',
    'views/attribute-date',
    'views/attribute-docid'
], function (_, Backbone, Mustache, ViewAttributeText, ViewAttributeInt, ViewAttributeDate, ViewAttributeDocid) {
    'use strict';

    var AttributeView = Backbone.View.extend({

        className : "row css-attr attr",

        initialize : function () {
            this.listenTo(this.model, 'change:label', this.updateLabel);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = this.model.get("template") || window.dcp.template.label_attr;
        },

        render : function (inTemplate) {
            var contentView;
            this.$el.append($(Mustache.render(this.template, this.model.toJSON())));
            if (!inTemplate && this.model.get("options")["template"]) {
                this.$el.append($(Mustache.render(window.templates[this.model.get("options")["template"]], this.model.toJSON().options.templateData)));
                this.$el.find(".js-attr-target").each(function() {
                    var $this = $(this), attrid, currentAttr, currentView;
                    attrid = $this.data("attrid");
                    currentAttr = window.dcp.document.get("attributes").get(attrid);
                    currentView = new AttributeView({model : currentAttr});
                    $this.append(currentView.render(true).$el);
                });
                return this;
            }
            if (this.model.get("type") === "text") {
                contentView = new ViewAttributeText({model : this.model});
                this.$el.append(contentView.render().$el);
            } else if (this.model.get("type") === "int") {
                contentView = new ViewAttributeInt({model : this.model});
                this.$el.append(contentView.render().$el);
            } else if (this.model.get("type") === "docid") {
                contentView = new ViewAttributeDocid({model : this.model});
                this.$el.append(contentView.render().$el);
            } else if (this.model.get("type") === "date") {
                contentView = new ViewAttributeDate({model : this.model});
                this.$el.append(contentView.render().$el);
            }
            return this;
        },

        updateLabel : function() {
            this.$el.find(".attr--label").text(this.model.get("label"));
        }
    });

    return AttributeView;

});
/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim :    {
        underscore :            {
            exports : '_'
        },
        backbone :              {
            deps :    [
                'underscore',
                'jquery'
            ],
            exports : 'Backbone'
        },
        bootstrap :             {
            deps : [
                'jquery'
            ]
        },
        "kendo" :    {
            deps : [
                'jquery'
            ]
        },
        "kendo-culture" : {
            deps : [
                'jquery'
            ]
        }
    },
    paths :   {
        "jquery" :              "../libs/js/jquery.min",
        "underscore" :          "../libs/js/underscore",
        "backbone" :            "../libs/js/backbone",
        "mustache" :            "../libs/js/mustache",
        "text" :                "../libs/js/text",
        "bootstrap" :           "../libs/js/bootstrap",
        "kendo" :               "../libs/js/kendo.ui.core",
        "kendo-culture":        "../libs/js/kendo.culture.fr.min"
    }/*,
    urlArgs : "invalidateCache=" + (new Date()).getTime()*/
});

require([
    'jquery',
    'underscore',
    'backbone',
    'models/document',
    'views/document',
    'bootstrap',
    'kendo',
    'kendo-culture'
], function ($, _, Backbone, Document, DocumentView) {
    /*jshint nonew:false*/
    window.dcp = window.dcp || {};
    $.getJSON("?app=DOC2&action=GET_TEMPLATE")
        .done(function(data) {
        window.dcp.template = data;
        window.dcp.document = new Document(initialData.properties, {attributes : initialData.attributes});
        window.dcp.mainView = new DocumentView({model : window.dcp.document});
       $("body").append(window.dcp.mainView.render().$el);
    });
});
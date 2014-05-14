<?php

$app_desc = array(
    "name" => "DOC2",
    "short_name" => N_("DOC2"),
    "description" => N_("DOC2"),
    "access_free" => "N",
    "icon" => "DOC2.png",
    "displayable" => "N",
    "with_frame" => "Y",
    "childof" => ""
);

/* ACLs for this application */
$app_acl = array(
    array(
        "name" => "BASIC",
        "description" => N_("doc2:basic access"),
        "group_default" => "Y"
    )
);

/* Actions for this application */
$action_desc = array(
    array(
        "name" => "DOC2",
        "short_name" => N_("doc2:main interface"),
        "script" => "action.doc2.php",
        "function" => "doc2",
        "root" => "Y",
        "acl" => "BASIC"
    ),
    array(
        "name" => "GET_TEMPLATE",
        "short_name" => N_("doc2:get template"),
        "script" => "action.get_template.php",
        "function" => "get_template",
        "root" => "Y",
        "acl" => "BASIC"
    ),
    array(
        "name" => "SAVE_DOC",
        "short_name" => N_("doc2:save a doc"),
        "script" => "action.save_doc.php",
        "function" => "save_doc",
        "root" => "Y",
        "acl" => "BASIC"
    ),
);



/***********
 * Samples *
 ***********/

/*
$app_acl = array(
    array(
        "name"               => "ZOO_MONEY",
        "description"        => N_("Access to ticket sales")
    )
);
*/

/*
$action_desc = array(
    array(
        "name"               => "ZOO_TEXTTICKETSALES",   //required
        "short_name"         => N_("text sum of sales"), //not required
        "script"             => "zoo_ticketsales.php",   //not required, defaults to lower(<name>).php
        "function"           => "zoo_ticketsales",       //not required, defaults to lower(<name>)
        "acl"                => "ZOO_MONEY"              //not required, defaults to null
    )
);
*/
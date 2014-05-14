<?php

function get_template(Action &$action) {

    $pubDir = \ApplicationParameterManager::getScopedParameterValue("CORE_PUBDIR", DEFAULT_PUBDIR);
    $return = array();
    $mustacheRender = new Mustache_Engine(array(
        'helpers' => array(
            'i18n' => function ($text) {
                    return _($text);
                },
        ),
    ));
    foreach(glob($pubDir."DOC2/Layout/*.fragment.mustache") as $filename) {
        $return[basename($filename, ".fragment.mustache")] = $mustacheRender->render("{{=[ ]=}}\n".file_get_contents($filename));
    }

    $action->lay->template = json_encode($return);
    $action->lay->noparse = true;
    header('Content-type: application/json');
}
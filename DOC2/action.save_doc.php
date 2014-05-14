<?php

require_once "FDL/freedom_util.php";

function save_doc(Action &$action) {

    $dbaccess = getDbAccess();

    $usage = new ActionUsage($action);

    $id = $usage->addRequiredParameter("id", "id");
    $values = $usage->addRequiredParameter("values", "values");

    $usage->setStrictMode(false);

    $usage->verify(true);

    $doc = new_Doc("", $id, true);

    $values = json_decode($values, true);

    foreach($values as $attrid => $currentValue) {
        $doc->setValue($attrid, $currentValue);
    }

    $doc->store();



}
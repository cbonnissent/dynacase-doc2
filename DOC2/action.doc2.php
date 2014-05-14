<?php

require_once "FDL/freedom_util.php";

function doc2(Action &$action) {

    $dbaccess = getDbAccess();

    $usage = new ActionUsage($action);

    $id = $usage->addRequiredParameter("id", "id");
    $debug = ($usage->addOptionalParameter("debug", "debug", array("TRUE"), "FALSE") === "TRUE");

    $usage->setStrictMode(false);

    $usage->verify(true);

    $doc = array(
        "properties" => array(),
        "attributes" => array()
    );

    $templates = array();

    //Get the doc
    $currentDoc = new_Doc("", $id);
    if (!$currentDoc->isAlive()) {
        throw new Exception("Unable to build the IHM the id is not usable ( $id )");
    }

    $doc["properties"]["id"] = $currentDoc->getPropertyValue("id");
    $doc["properties"]["initid"] = $currentDoc->getPropertyValue("initid");
    $doc["properties"]["name"] = $currentDoc->getPropertyValue("name");
    $doc["properties"]["title"] = $currentDoc->getPropertyValue("title");
    $doc["properties"]["fam"] = getNameFromId($dbaccess, $currentDoc->getPropertyValue("fromid"));
    $doc["properties"]["icon"] = $currentDoc->getIcon();

    $fieldAttributes = $currentDoc->getFieldAttributes();

    $fieldAttributes = array_filter($fieldAttributes, function($attribute) {
        return is_a($attribute, "FieldSetAttribute") && $attribute->id !== "FIELD_HIDDENS";
    });

    usort($fieldAttributes, function(FieldSetAttribute $attribute1, FieldSetAttribute $attribute2) {
        return $attribute1->ordered < $attribute2->ordered ? -1 : 1;
    });

    $normalAttributes = $currentDoc->getNormalAttributes();

    foreach($fieldAttributes as $currentFieldAttribute) {
        $currentId = $currentFieldAttribute->id;
        if (isset($doc["attributes"][$currentId])) {
            continue;
        }
        $options = $currentFieldAttribute->getOptions();
        $doc["attributes"][$currentId] = array(
            "id" => $currentId,
            "type" => $currentFieldAttribute->type,
            "label" => $currentFieldAttribute->getLabel(),
            "order" => $currentFieldAttribute->ordered,
            "children" => array(),
            "options" => $options
        );
        if (isset($options["edittemplate"])) {
            $templateName = basename($options["edittemplate"], ".mustache");
            $data = array();
            if (method_exists($doc, $templateName)) {
                $data = $doc->$templateName();
            }
            $serverData = array_merge($data, $doc->getDefaultKeys());
            $templates[$templateName] = prepareTemplates($options["edittemplate"], $serverData);
            $doc["attributes"][$currentId]["templateData"] = $data;
        }
        foreach($normalAttributes as $currentChild) {
            /* @var NormalAttribute $currentChild */
            if ($currentChild->fieldSet->id === $currentId) {
                $doc["attributes"][$currentId]["children"][$currentChild->id] = analyzeAttribute($currentDoc,
                    $currentChild, $normalAttributes, $templates);
            }
        }
        if (!empty($doc["attributes"][$currentId]["children"])) {
            usort($doc["attributes"][$currentId]["children"], function ($attribute1, $attribute2) {
                return $attribute1["order"] < $attribute2["order"] ? -1 : 1;
            });
        }
    }

    //Asset
    $cssAsset = array(
        "DOC2/libs/style/bootstrap.css",
        "DOC2/libs/style/bootstrap-theme.css",
        "DOC2/libs/style/kendo.bootstrap.min.css",
        "DOC2/libs/style/kendo.common-bootstrap.min.css",
        "DOC2/css/document.css"
    );

    $pubDir = \ApplicationParameterManager::getScopedParameterValue("CORE_PUBDIR", DEFAULT_PUBDIR);
    $mustacheRender = new Mustache_Engine;
    $action->lay->template = $mustacheRender->render(file_get_contents($pubDir."/DOC2/Layout/doc2.mustache"), array(
        "initialData" => json_encode($doc, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP),
        "doc" => $doc,
        "cssAsset" => $cssAsset,
        "debug" => $debug,
        "templates" => json_encode($templates, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP)
    ));
    $action->lay->noparse = true;
}

function analyzeAttribute(Doc &$doc, NormalAttribute &$attribute, &$normalAttributes, &$templates)
{
    $currentId = $attribute->id;
    $formattedValue = $doc->getTextualAttrValue($currentId);
    if ($attribute->isMultiple()) {
        $formattedValue = explode("\n", $formattedValue);
    }
    $options = $attribute->getOptions();
    if (isset($options["edittemplate"])) {
        $templateName = basename($options["edittemplate"], ".mustache");
        $data = array();
        if (method_exists($doc, $templateName)) {
            $data = $doc->$templateName();
        }
        $serverData = array_merge($data, $doc->getDefaultKeys());
        $templates[$templateName] = prepareTemplates($options["edittemplate"], $serverData);
        $options["templateData"] = $data;
        $options["template"] = $templateName;
    }
    $return = array(
        "id" => $currentId,
        "type" => $attribute->type,
        "label" => $attribute->getLabel(),
        "order" => $attribute->ordered,
        "value" => $doc->getAttributeValue($currentId),
        "multiple" => $attribute->isMultiple(),
        "formattedValue" => $formattedValue,
        "options" => $options
    );
    $childAttributes = array_filter($normalAttributes, function ($attribute) use ($currentId) {
        if (!is_a($attribute, "NormalAttribute")) {
            return false;
        }
        /* @var NormalAttribute $attribute */
        return $attribute->fieldSet->id === $currentId;
    });
    if (!empty($childAttributes)) {
        $return["children"] = array();
    }
    foreach ($childAttributes as $currentChild) {
        $return["children"][$currentChild->id] = analyzeAttribute($doc, $currentChild, $normalAttributes, $templates);
    }
    if (!empty($return["children"])) {
        usort($return["children"], function ($attribute1, $attribute2) {
            return $attribute1["order"] < $attribute2["order"] ? -1 : 1;
        });
    }
    return $return;
};

function prepareTemplates($filePath, $values) {
    $mustacheRender = new Mustache_Engine(array(
        'helpers' => array(
            'i18n' => function ($text) {
                    return _($text);
                },
        ),
    ));
    $pubDir = \ApplicationParameterManager::getScopedParameterValue("CORE_PUBDIR", DEFAULT_PUBDIR);
    return $mustacheRender->render("{{=[ ]=}}\n" . file_get_contents($pubDir.$filePath), $values);
}
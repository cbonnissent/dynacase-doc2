<?php

namespace Doc2;
use \Dcp\AttributeIdentifiers\doc2_vig as MyAttributes;

Class doc2_vig extends \Dcp\Family\Document
{
    function alert() {
        $values = array();
        $values["username"] = "toto";
        $values["low_level"] = $this->getAttributeValue(MyAttributes::myw_level) < 2;
        return $values;
    }

    function getDefaultKeys() {
        $values = array();
        $attributes = $this->getAttributes();
        foreach($attributes as $currentAttributes) {
            $values["v_".$currentAttributes->id] = '<div data-attrid="'.$currentAttributes->id.'" class="js-attr-target"></div>';
            $values["l_" . $currentAttributes->id] = '<div data-attrid="' . $currentAttributes->id .'" class="js-label-target"></div>';
        }
        return $values;
    }
}
?>
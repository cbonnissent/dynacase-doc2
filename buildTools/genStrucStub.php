#!/usr/bin/env php
<?php

require_once "genStubFamilyClass.php";

foreach(glob("**/*__STRUCT.csv") as $currentPath) {
    print "$currentPath\n";
    $stubClass = new GenerateStub();
    $stubClass->addFileToExamine($currentPath);
    $stubClass->getSignifiantContent($currentPath);
    $currentElement = array_values($stubClass->content)[0];
    $file = fopen("./stubs/".$currentElement["name"]."__STUB.php", "w");
    fwrite($file, $stubClass->generateStubFile());
    fwrite($file, $stubClass->generateStubAttrFile());
    fclose($file);
}

foreach (glob("**/*__WFL.csv") as $currentPath) {
    $stubClass = new GenerateStub();
    $stubClass->addFileToExamine($currentPath);
    $stubClass->getSignifiantContent($currentPath);
    $currentElement = array_values($stubClass->content)[0];
    $file = fopen("./stubs/" . $currentElement["name"] . "__STUB.php", "w");
    fwrite($file, $stubClass->generateStubFile());
    fwrite($file, $stubClass->generateStubAttrFile());
    fclose($file);
}
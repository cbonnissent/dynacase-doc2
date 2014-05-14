<?php

class GenerateStub
{

    protected $files = array();

    public $content = array();
    public $attr = array();

    public function addFileToExamine($file)
    {
        $this->files[] = $file;
    }


    public function getSignifiantContent($file)
    {
        $csvFile = $file;
        $needUnlink = false;
        $famName = $className = $fromName = $famId = $famTitle = $name='';
        if (($handle = fopen($csvFile, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
                switch ($data[0]) {
                    case "BEGIN":
                        $famName = strtolower($data[5]);
                        if (isset($this->content[$famName])) {

                            $className = $this->content[$famName]["className"];
                            $fromName = $this->content[$famName]["fromName"];
                            $famId = $this->content[$famName]["id"];
                            $name = $this->content[$famName]["name"];
                            if ($data[4] && $data[4] != '-') {
                                $className = $data[4];
                            }
                            if ($data[1] && $data[1] != '-') {
                                $fromName = ($data[1] == '--') ? '' : $data[1];
                            }
                            if ($data[3] && $data[3] != '-') {
                                $famId = $data[3];
                            }
                            if ($data[2] && $data[2] != '-') {
                                $famTitle = $data[2];
                            }
                        } else {

                            $className = $data[4];
                            $fromName = ($data[1] == '--') ? '' : $data[1];
                            $famId = $data[3];
                            $famTitle = $data[2];
                            $name = $data[5];
                        }
                        $this->attr[$famName]=array();
                        break;
                    case 'CLASS';
                        $className = $data[1];
                        break;
                    case 'PARAM':
                    case 'ATTR':
                        $attrid = strtolower($data[1]);
                        $this->attr[$famName][$attrid] = array(
                            "id" => $attrid,
                            "type" => $data[6],
                            "label" => $data[3],
                            "famName" => $famName);
                        break;
                    case 'END';
                        $this->content[$famName] = array(
                            "famName" => $famName,
                            "name" => $name,
                            "className" => $className,
                            "id" => $famId,
                            "title" => $famTitle,
                            "fromName" => $fromName);
                        break;
                }

            }
        }
        fclose($handle);
        if ($needUnlink) {
            unlink($needUnlink);
        }
        $this->completeContent();
    }

    protected function completeContent()
    {
        foreach ($this->content as $k => $info) {
            $fromName = $info["fromName"];
            if ($fromName and is_numeric($fromName)) {
                foreach ($this->content as $famName => $info2) {
                    if ($info2["id"] == $fromName) {
                        $this->content[$k]["fromName"] = $famName;
                    }
                }
            }
        }
    }

    public function generateStubFile()
    {
        $phpContent = "<?php\n";
        $phpContent .= "namespace Dcp\\Family {\n";
        foreach ($this->content as $famId => $famInfo) {
            $phpContent .= "\t" . $this->getPhpPart($famInfo) . "\n";
        }
        $phpContent .= "}\n";
        return $phpContent;
    }

    protected function getPhpPart(array $info)
    {
        $famName = sprintf('%s', ucfirst(strtolower($info["famName"])));
        if ($info["className"]) {
            $parentClass = '\\' . $info["className"];
        } elseif ($info["fromName"]) {
            $parentClass = sprintf('%s', ucfirst(strtolower($info["fromName"])));
        } else {
            $parentClass = 'Document';
        }
        $comment = sprintf('/** %s  */', $info["title"]);
        $template = sprintf('class %s extends %s { const familyName="%s";}', $famName, $parentClass, $info["name"]);
        return $comment . "\n\t" . $template;

    }

    public function generateStubAttrFile()
    {

        $phpContent = "namespace Dcp\\AttributeIdentifiers {\n";
        foreach ($this->attr as $famName => $attrInfo) {
            $phpContent .= "\t" . $this->getPhpAttrPart($famName, $attrInfo) . "\n";
        }
        $phpContent .= "}\n";
        return $phpContent;
    }

    protected function getPhpAttrPart($famName, array $info)
    {
        $famInfo = $this->content[$famName];
        if ($famInfo["fromName"]) {
            $parentClass = sprintf('%s', ucfirst(strtolower($famInfo["fromName"])));
        } else {
            $parentClass = '';
        }
        $comment = sprintf('/** %s  */', $famInfo["title"]);
        if ($parentClass) {
            $template = sprintf("class %s extends %s {\n", ucwords($famName), $parentClass);
        } else {
            $template = sprintf("class %s {\n", ucwords($famName));

        }
        foreach ($info as $attrid => $attrInfo) {
            $template .= sprintf("\t\t/** [%s] %s */\n", str_replace('*',' ', $attrInfo["type"]),str_replace('*', ' ',$attrInfo["label"]));
            $template .= sprintf("\t\tconst %s='%s';\n", $attrInfo["id"], $attrInfo["id"]);
        }
        $template .= "\t}";
        return $comment . "\n\t" . $template;
    }
}

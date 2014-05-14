# Howto : Vue MVVM

But : Définir les élements mis en jeu pour construire un document en
consultation et en édition dans un modèle mvvm. Le rendu est totalement généré
côté client.

## Composition de la famille 

Famille de donnée "Département"


| BEGIN |           |           |  Département   | MY_DEPT |     |       |     |     |      |
| ----- | --------- | --------- | -------------- | ------- | --- | ----- | --- | --- | ---- |
| //    | idattr    | idframe   | label          | T       | A   | type  | ord | vis | need |
| ATTR  | MYD_IDENT |           | Identification |         |     | frame | 10  | W   | N    |
| ATTR  | MYD_NAME  | MYD_IDENT | Nom            | Y       |     | text  | 20  | W   | Y    |
| END   |           |           |                |         |     |       |     |     |      |

Famille "Vigilance météo".


| BEGIN |           |           |     Météo      | MY_WEATHER |     |                  |     |     |      |
| ----- | --------- | --------- | -------------- | ---------- | --- | ---------------- | --- | --- | ---- |
| //    | idattr    | idframe   | label          | T          | A   | type             | ord | vis | need |
| ATTR  | MYW_IDENT |           | Identification |            |     | frame            | 10  | W   | N    |
| ATTR  | MYW_NAME  | MYW_IDENT | Nom            | Y          |     | text             | 20  | W   | Y    |
| ATTR  | MYW_DATA  | MYW_IDENT | Données        | N          |     | array            | 30  | W   | N    |
| ATTR  | MYW_DEPT  | MYW_DATA  | Département    |            |     | docid("MY_DEPT") | 40  | W   |      |
| ATTR  | MYW_DATE  | MYW_DATA  | Date           |            |     | date             | 50  | W   |      |
| ATTR  | MYW_VIGI  |           | Vigilance      |            |     | frame            | 10  | W   | N    |
| ATTR  | MYW_LEVEL | MYW_VIGI  | Niveau         | N          |     | int              | 20  | W   | Y    |
| END   |           |           |                |            |     |                  |     |     |      |

### Options de rendu

#### Option vue de template

L'attribut "MY_LEVEL" utilise le template "à l'ancienne mode" suivant
"myLevel.html" en édition et en consultation.

    <p>[TEXT:Welcome] : [USERNAME]</p>
    [V_MY_LEVEL]<!-- vue standard -->
    <p id="my-lowLevel">Pas d'inquiétude</p>
    <p id="my-highLevel"><strong>Vigilance orange</strong></p>


Si le niveau est > 2 alors "Vigilance orange" est affiché sinon c'est "Pas
d'inquiétude".

L'attribut "MY_COUNTRY" à l'option "noaccesstext" à "Département sécurisé".

## Fichiers à réaliser

L'intégrateur doit réaliser un fichier de template mustache :

```
    <p>{{i18n:Welcome}} : {{username}}</p>
    {{V_MY_LEVEL}}
    {{#low_level}}
    <p id="my-lowLevel">Pas d'inquiétude</p>
    {{/low_level}}
    {{^#low_level}}
    <p id="my-highLevel"><strong>Vigilance orange</strong></p>
    {{/low_level}}
```

De plus, il doit traduire lancer la traduction qui va automatiquement extraire la chaîne i18n:Welcome

## Déclaration

En outre, dans le fichier de classe de la famille, le développeur doit créer la fonction :

    /**
     * 
     */
    public function myLevel() {
        $this->layout("set", $this->getAttributeValue(MyAttributes::my_level));
    }


On veut appliquer par défaut ce rendu.


| BEGIN  |                         |      | Météo | MY_WEATHER |
| ------ | ----------------------- | ---- | ----- | ---------- |
| RENDER | MY/myWeatherRender.json | view |       |            |
| RENDER | MY/myWeatherRender.json | edit |       |            |
|        |                         |      |       |            |
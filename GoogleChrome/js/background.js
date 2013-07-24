
var colorDictionary;
var colorDictionaryEn;
var currentColor;
//var colorsName = [];

$.getJSON("js/ColorDictionary.json", function(colorList){
    colorDictionary = colorList;
    loadColorNames(colorDictionary);
});

$.getJSON("js/ColorDictionary-en.json", function(colorList){
    colorDictionaryEn = colorList;
    loadColorNames(colorDictionaryEn);
});

function loadColorNames(dictionary)
{
    $.each(dictionary, function (index, color) {
        color.Index = index;
        color.label = color.Name;
    });
}



var colorDictionary;
var currentColor;
//var colorsName = [];

$.getJSON("js/ColorDictionary.json", function(colorList){
    colorDictionary = colorList;
    loadColorNames();
});

function loadColorNames()
{
    $.each(colorDictionary, function (index, color) {
        color.Index = index;
        color.label = color.Name;
    });
}


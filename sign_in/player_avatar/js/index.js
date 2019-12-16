// I like to put everything in objects and then pretend
// I know how to write clean/modular js.
var avatar = {
  bg: $('.avatar__bg'),
  head: $('.avatar__head'),
  headPosDiagonal: $('.avatar__head--positive-diagonal'),
  headNegDiagonal: $('.avatar__head--negative-diagonal'),
  headMiddle: $('.avatar__head--middle'),
  body: $('.avatar__body'),
  glow1: $('.avatar__glow--1'),
  glow2: $('.avatar__glow--2'),
  glow3: $('.avatar__glow--3'),
  glow4: $('.avatar__glow--4'),
  glow5: $('.avatar__glow--5'),
}

// cache stuff! 
var $bodyInput = $("#body-color"),
    $headInput = $("#head-color"),
    $headPosDiagonalInput = $("#head-pos-diagonal"),
    $headNegDiagonalInput = $("#head-neg-diagonal"),
    $headMidInput = $("#head-middle"),
    $bgInput = $("#bg-color"),
    $glow1Input = $("#glow1-color"),
    $glow2Input = $("#glow2-color"),
    $glow3Input = $("#glow3-color"),
    $glow4Input = $("#glow4-color"),
    $glow5Input = $("#glow5-color"),
    $headAdvanced = $("#syncHead"),
    $bgBlend = $('#blendBackground');

//init stuff! This could likely all be done with input[type=color] but this is so much easier to style...
$bodyInput.spectrum(createColorChanger(avatar.body));
$headInput.spectrum(createColorChanger(avatar.head, syncHead));
$headPosDiagonalInput.spectrum(createColorChanger(avatar.headPosDiagonal));
$headNegDiagonalInput.spectrum(createColorChanger(avatar.headNegDiagonal));
$headMidInput.spectrum(createColorChanger(avatar.headMiddle));
$bgInput.spectrum(createColorChanger(avatar.bg, bgBlend));
$glow1Input.spectrum(createColorChanger(avatar.glow1, bgBlend));
$glow2Input.spectrum(createColorChanger(avatar.glow2));
$glow3Input.spectrum(createColorChanger(avatar.glow3));
$glow4Input.spectrum(createColorChanger(avatar.glow4));
$glow5Input.spectrum(createColorChanger(avatar.glow5));
$secondaryGlowInputs = [$glow2Input, $glow3Input, $glow4Input, $glow5Input];
$advancedHeadInputs = [$headPosDiagonalInput, $headMidInput, $headNegDiagonalInput];


// mmmmmmmmmmmk gross boilerplate mostly done?
// let's build an app!


// Listens for the checkbox that controls whether or not
// the more advanced head color options are enabled
$headAdvanced.on("change", function(){
  if (!this.checked) {
    // If they're not, turn those inputs off
    disableAdvancedHeadInputs();
  }
  else {
    enableAdvancedHeadInputs();
  }
});

// Pretty straight forward. Disable the inputs and sync everything
// to the main head color.
function disableAdvancedHeadInputs(){
  $headInput.spectrum("enable");
  $.each($advancedHeadInputs, function(){
    this.spectrum("disable");
    syncHead();
  }); 
}
disableAdvancedHeadInputs(); // starts in this state

// Makes sure all the colors for the different head bits are synced up.
// This (like a lot of things in here) gets pretty repetitive...  
// There's likely a DRYer way to do things.
function syncHead() {
  var color = $headInput.spectrum("get").toHexString();
  avatar.head.css('fill', color);
  $.each($advancedHeadInputs, function(){
    this.spectrum("set", color);
  })
  avatar.headPosDiagonal.removeAttr('style'); 
  avatar.headNegDiagonal.removeAttr('style'); 
  avatar.headMiddle.removeAttr('style'); 
}

// Turns on the advanced inputs! 
// (and disables the standard one)
function enableAdvancedHeadInputs(){
  $.each($advancedHeadInputs, function(){
    $headInput.spectrum("disable");
    this.spectrum("enable");
    bgBlend();
  }); 
}

// Watches the checkbox that controls whether or not the background should be auto blended
$bgBlend.on("change", function(){
  if (this.checked) {
    // If it's toggled on, disable all of the controls for
    // the inbetween colors
    disableSecondaryGlowInputs();
  }
  else {
    enableSecondaryGlowInputs();
  }
});

function disableSecondaryGlowInputs() {
  $.each($secondaryGlowInputs, function(){
    this.spectrum("disable");
    bgBlend(); //makes sure the background is all blended up!
  });
}
disableSecondaryGlowInputs(); // starts in this state

function enableSecondaryGlowInputs() {
  $.each($secondaryGlowInputs, function(){
    this.spectrum("enable");
  });
}

// this is used when initializing Spectrum.
// I figured this makes things a bit less redundant?
// basically just calls Spectrum on a jquery object,
// then queues any callbacks etc.
function createColorChanger(target, callback){
  var spectrumOpts = {
    color: avatar.head.css('fill'),
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 3,
    showInput: true,
    preferredFormat: 'hex',
    color: target.css('fill'),
    showInitial: true,
    palette: [ // Some brand colors! Grays, content colors, accents.
      ['#ccc', '#555', '#343436'],
      ['#28282B', '#1E1E1E', '#111'],
      ['#0ebeff', '#47CF73', '#AE63E4'],
      ['#fcd000', '#ff3c41', '#76daff']
    ],
    containerClassName: 'picker',
    replacerClassName: 'picker-input',
    chooseText: "Select",
    cancelText: "Cancel",
    localStorageKey: "spectrum"
  }
  changeFunc = function(color){
    target.css('fill', color.toHexString());
    if (callback) {
      callback();
    }
  }
  return $.extend(spectrumOpts, {change:changeFunc});
}

// Creates auto-generated BG blends
function bgBlend() {
  // bail early if we're not meant to be in here
  if (!$bgBlend.is(":checked")) {
    return;
  }
  var bgFront = $bgInput.spectrum("get").toString();
  var bgBack = $glow1Input.spectrum("get").toString();
  var blend = steppedBlend(bgFront, bgBack, 6);
  avatar.glow1.css('fill', blend[0]);
  avatar.glow2.css('fill', blend[1]);
  avatar.glow3.css('fill', blend[2]);
  avatar.glow4.css('fill', blend[3]);
  avatar.glow5.css('fill', blend[4]);
  avatar.bg.css('fill', blend[5]);
  $glow2Input.spectrum('set', blend[1]);
  $glow3Input.spectrum('set', blend[2]);
  $glow4Input.spectrum('set', blend[3]);
  $glow5Input.spectrum('set', blend[4]);
}

// Internal function, blends two colors.
// There might be a better way to do this, but I wanted
// to write it to learn.
// 
// The weight param skews toward the first color if <0.5,
// and toward the second color if >0.5
function blend(color1, color2, weight){
  if (weight===undefined) {
    weight = .5;
  }
  // set the colors up as arrays of RGB vals
  color1 = prepColor(color1);
  color2 = prepColor(color2);
  var colorBlended = [];
  for (var i=0; i<3; i++) {
    colorBlended.push(weightedAverage(color1[i], color2[i], weight));
  }
  
  return rgbArrayToHex(colorBlended);
};

// Given a number of steps `n`, returns an array of `n` colors,
// evenly blended throughout each.
// 
// Again, probably a cleaner way to do this but I wrote it and that's neat!
function steppedBlend(color1, color2, steps) {
  var blendedArray = [];
  for (var i=0; i<steps; i++) {
    var weight = (i*steps)/(steps*(steps-1));
    blendedArray.push(blend(color1, color2, weight));
  }
  return blendedArray;
}

// Used when blending stuff
function weightedAverage(num1, num2, weight) {
  return Math.floor((num1*weight) + (num2*(1-weight)));
}

// Probably the world's least useful abstraction eyyyy
function stripHash(color) {
  if (color[0]=="#") {
    color = color.replace('#','');
  }
  return color;
}

// Sooo.... turns out one of the libs I used already does this.
// But hey, learning opportunities gone <del>wild</del>mild. (let's be honest)
function hexToRgbArray(color) {
  color =  color.match(/.{1,2}/g);
  color.forEach(function(hexVal, index){
    color[index] = parseInt(hexVal, 16);
  });
  return color;
}

// Inverse of the above
function rgbArrayToHex(color) {
  color.forEach(function(rgbVal, index){
    color[index] = ("0" + rgbVal.toString(16)).slice(-2); //force leading 0
  });
  return "#"+color.join('');
}

// Takes a hex color code and returns an array of rbg values
// because they're heaps easier to work with
function prepColor(color) {
  color = stripHash(color);
  return hexToRgbArray(color);
}

// Magic yo. https://github.com/exupero/saveSvgAsPng
$("#save").click(function(){
  saveSvgAsPng(document.getElementById("avatar"), "avatar.png", {scale:2.844});
})
function flicker(){
  $("#xp-increase-fx-flicker").css("opacity", "1");
  $("#xp-increase-fx-flicker").animate({"opacity":Math.random()}, 100, flicker);
}

$(document).ready(function(){
  flicker();
});

function doit(){
  $("#xp-increase-fx").css("display","inline-block");
  $("#xp-bar-fill").css("box-shadow",/*"0px 0px 15px #06f,*/ "-5px 0px 10px #fff inset");
  setTimeout(function(){$("#xp-bar-fill").css("-webkit-transition","all 2s ease");
  $("#xp-bar-fill").css("width","75%");},100);
  setTimeout(function(){$("#xp-increase-fx").fadeOut(500);$("#xp-bar-fill").css({"-webkit-transition":"all 0.5s ease","box-shadow":""});},2000);
  setTimeout(function(){$("#xp-bar-fill").css({"width":"0.1%"});},3000);
}
/*
  This pen does not work on mobile devices. Oh yeah and is no way affiliated by South Park and/or its trademark/rights/copyright holders. This is just a fan-based character creator I did for fun.
*/

// -------------- lookup tables
const skinColors = [
  rgb(241, 198, 163),
  rgb(210, 175, 137),
  rgb(210, 151, 93),
  rgb(86, 57, 39)
];
            
const colorTable = [
  rgba(0,0,0, 0), rgb(200, 195, 201), rgb(14, 8, 12), rgb(156, 148, 125), rgb(90, 42, 22), rgb(214, 166, 130), rgb(151, 7, 32), rgb(215, 62, 5), rgb(221, 234, 40), rgb(212, 229, 137)
    , rgb(17, 85, 44), rgb(14, 162, 126), rgb(218, 222, 221), rgb(175, 191, 207), rgb(33, 37, 82), rgb(53, 59, 95), rgb(224, 223, 219), rgb(147, 139, 150), rgb(118, 103, 106)
    , rgb(128, 102, 87), rgb(51, 24, 13), rgb(186, 90, 128), rgb(143, 0, 18), rgb(168, 68, 16), rgb(222, 205, 11), rgb(175, 239, 65), rgb(26, 87, 45), rgb(11, 96, 75)
    , rgb(174, 230, 205), rgb(135, 183, 219), rgb(30, 29, 61), rgb(61, 75, 136), rgb(223, 218, 214), rgb(118, 116, 129), rgb(104, 92, 94), rgb(88, 62, 35)
    , rgb(203, 183, 120), rgb(218, 95, 185), rgb(124, 0, 11), rgb(181, 0, 41), rgb(220, 197, 7), rgb(74, 191, 16), rgb(112, 160, 25), rgb(41, 84, 75), rgb(96, 191, 157)
    , rgb(99, 167, 214), rgb(18, 22, 47), rgb(213, 185, 208), rgb(218, 215, 210), rgb(48, 42, 52), rgb(90, 71, 75), rgb(69, 40, 36), rgb(219, 180, 173), rgb(219, 91, 200)
    , rgb(142, 0, 84), rgb(168, 0, 0), rgb(220, 170, 13), rgb(17, 152, 34), rgb(96, 106, 82), rgb(24, 47, 37), rgb(127, 201, 200), rgb(81, 135, 179), rgb(55, 120, 112)
    , rgb(138, 73, 157), rgb(198, 190, 187), rgb(30, 18, 30), rgb(35, 35, 33), rgb(131, 68, 63), rgb(195, 145, 144), rgb(202, 0, 108), rgb(78, 1, 37), rgb(161, 1, 3)
    , rgb(219, 141, 66), rgb(11, 116, 31), rgb(78, 87, 66), rgb(21, 35, 18), rgb(62, 167, 162), rgb(32, 104, 162), rgb(7, 59, 57), rgb(101, 24, 130)
];

const pathFromLine = (x1,x2,y1,y2) => {
  let p = new Path2D();
  p.moveTo(x1, y1);
  p.lineTo(x2, y2);
  return p;
};

// ----------------- classes of horror
class ViewState extends GameObject {
  constructor(name) {    
    super();
    this.name = name;    
    this.target = name;
  }
  draw() {
    super.draw();
  }
  update() {
    super.update();
  }
}
class View extends GameObject {
  constructor(name, text) {
    super();
    this.name = name;
    this.text = text || name;
    this.currentState = undefined;
    this.states = [];
    this.stateNames = [];
    this.viewSelector = undefined;
    this.switchProgress = 1.0;
    this.opacity = 1.0;    
    this.activeButtonIndex=-1;
    this.buttonIndex=0;
    this.canGoBack = true;
  }
  draw() {
    this.buttonIndex = 0;
    const oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.opacity;
    super.draw();
    // draw viewName
    
    ctx.fillStyle = "white";
    if (this.text) {
      drawTallText(this.text, 20, 80, 26);
      if (this.currentState) drawTallText(this.currentState, 20, 120, 14);
    }
    if (this.currentState && this.states[this.currentState]){
      this.states[this.currentState].draw();
    }        
    
    if (this.canGoBack) {
      this.drawGoBackButton();
    }
    
    let stateIndex = 0;
    if (this.states) {
      for(let name of this.stateNames) {
        if (this.currentState !== name) {
          this.drawStateButton(this.states[name], stateIndex);
          stateIndex++;
        }        
      }
    }
    
    ctx.globalAlpha = oldAlpha;
  }
  
  update() {
    super.update();
    if (this.currentState && this.states[this.currentState]){
      this.states[this.currentState].update();
    }    
    this.position.y = -(1.0-this.switchProgress) * canvas.height;
    this.opacity = this.switchProgress;
  }
  
  addState(name) {
    this.stateNames.push(name);
    this.states[name] = new ViewState(name);
    if (!this.currentState) {
      this.gotoState(name);
    }
    return this.states[name];
  }
  gotoState(name) {
    this.currentState = name;
  }        
  
  drawStateButton(state, index) {
    const x = this.position.x + canvas.width/2 + 100 + (index * 100) - 200;
    const y = this.position.y + canvas.height - 75;    
    if (this.viewSelector && this.drawMenuButton(state.name, x, y, false, false, true, 60)) {
      this.gotoState(state.name);
    }
  }
  
  drawGoBackButton() {
    const x = this.position.x + canvas.width/2 - 200;
    const y = this.position.y + canvas.height - 75;
    if (this.viewSelector && this.drawMenuButton("Back", x, y, false, false, true, 60)) {
      this.viewSelector.goBack();
    }
  }
  
  drawMenuButton(name, x, y, rightToLeft, disabled, centerText, width, height) {  
    disabled   =   disabled || false;
    centerText = centerText || false;
    width      =      width || 200;
    height     =     height || 55;
    
    let mouseOver = mouse.x >= x - (width/2) && mouse.x <= x + (width/2) &&
        mouse.y >= y - 40  && mouse.y <= y + 15;
    let buttonPressed = false;        
    if (mouseOver && !disabled) {   
        
      ctx.beginPath();          
      if (this.activeButtonIndex === -1 && mouse.leftButton)  {
        this.activeButtonIndex = this.buttonIndex;
      } else if (!mouse.leftButton && this.activeButtonIndex === this.buttonIndex) {
        buttonPressed = true;
        this.activeButtonIndex = -1;
      }            
      if (rightToLeft) {      
        var grd=ctx.createLinearGradient(x-width,y,x+40,y);
        grd.addColorStop(0,"rgba(1, 75, 132,0)");
        grd.addColorStop(0.2,"rgba(1, 75, 132,1)");
        grd.addColorStop(0.8,"rgba(1, 75, 132,1)");
        grd.addColorStop(1,"rgba(1, 75, 132,0)");      
        ctx.fillStyle = grd;                    
        ctx.fillRect(x-(width-20),y-37,width+10, 50);        
      }
      else if (centerText) {        
        // i know, i should change to the correct font to ensure we test
        // against the correct one. but Since we only use 1 font. it shouldnt be an issue. 
        var grd=ctx.createLinearGradient(x-((width/2)+5),y,((width/2)+5),y);
        grd.addColorStop(0,"rgba(1, 75, 132,0)");
        grd.addColorStop(0.2,"rgba(1, 75, 132,1)");
        grd.addColorStop(0.8,"rgba(1, 75, 132,1)");
        grd.addColorStop(1,"rgba(1, 75, 132,0)");      
        ctx.fillStyle = grd;                    
        ctx.fillRect(x-((width/2)+5),y-37,width+10, 50);
      } else {
        var grd=ctx.createLinearGradient(x-40,y,x+width,y);
        grd.addColorStop(0,"rgba(1, 75, 132,0)");
        grd.addColorStop(0.2,"rgba(1, 75, 132,1)");
        grd.addColorStop(0.8,"rgba(1, 75, 132,1)");
        grd.addColorStop(1,"rgba(1, 75, 132,0)");      
        ctx.fillStyle = grd;            
        ctx.fillRect(x-40,y-37,width+10, 50);
      }            
    }
    
    
    if (disabled) {
      ctx.fillStyle= "rgba(0,0,0, 0.5)" ;
    } else {
      ctx.fillStyle = "black";
      drawTallText(name, x+1, y+1, 14, rightToLeft, centerText);
      ctx.fillStyle = mouseOver === true ? "yellow" : "rgb(142,213,222)";
    }    
    drawTallText(name, x, y, 14, rightToLeft, centerText);
    this.buttonIndex++;
    
    return buttonPressed;
  }
}

class ViewSelector extends GameObject {
  constructor(views) {
    super();
    this.views=views;
    this.currentView = undefined;
    this.nextView = undefined;
    this.viewSwitchTimer = 0;
    this.viewSwitchDuration = 0.5;
    this.views.forEach(x => x.viewSelector = this);
    this.lastView = undefined;
  }  
  draw() {
    super.draw();
    if (this.currentView) {
      this.currentView.draw();
    }
    if (this.nextView) {
      this.nextView.draw();
    }
  }
  update() {
    super.update();
    if (this.currentView) {
      this.currentView.update();
    }
    if (this.nextView) {
      this.nextView.update();
    }
    if (this.nextView !== undefined) {
      this.viewSwitchTimer -= Time.deltaTime/1000;      
      this.currentView.switchProgress = 1.0 - (this.viewSwitchDuration - this.viewSwitchTimer) /  this.viewSwitchDuration;
      this.nextView.switchProgress = 1.0 - this.currentView.switchProgress;      
      if (this.viewSwitchTimer <= 0) {   
        this.currentView.switchProgress = 0;
        this.nextView.switchProgress = 1.0;
        this.viewSwitchTimer = 0;
        this.currentView = this.nextView;
        this.nextView = undefined;
      }
    }       
    // this.views.forEach(x => x.update());
  }
  goBack() {
    if (this.lastView) {
      this.gotoView(this.lastView.name);
    }
  }
  gotoView(name) {    
    for(let v of this.views) {
      if (v.name === name) {        
        this.lastView = this.currentView;
        this.nextView = v;
        this.nextView.position.y = canvas.height;
        this.viewSwitchTimer = this.viewSwitchDuration;
        return;
      }
    }
  }
}

class MainMenuView extends View {
  constructor() {
    super("MainMenu", " ");    
    this.canGoBack = false;
  }
  draw() {
    super.draw();
    
    const ga = ctx.globalAlpha;
    ctx.globalAlpha = this.opacity;
    
    this.drawBrokenGlass();
    this.drawMenuButtons();
    
    ctx.globalAlpha = ga;
  }
  update() {
    super.update();
  }
  
  drawMenuButtons() {
    let startY = this.position.y + canvas.height * 0.2;
    
    // left side
    let y = startY; 
    let x = (canvas.width / 2) - 400;
    if (this.drawMenuButton("Hair", x + 100, y, true)) {
      this.viewSelector.gotoView("Hair");
      return;
    }
    y += 100;
    if (this.drawMenuButton("Makeup", x + 100, y, true)) {
      this.viewSelector.gotoView("Makeup");
      return;      
    }
    y += 100;
    if (this.drawMenuButton("Facial Hair", x + 100, y, true)) {
      this.viewSelector.gotoView("Facial");
      return;
    }
    
    // right side
    x = (canvas.width / 2) + 300;
    y = startY;
    if (this.drawMenuButton("Eyewear", x, y, false)) {
      this.viewSelector.gotoView("Eyewear");
      return;      
    }
    y += 100;
    if (this.drawMenuButton("Clothes", x, y)) {
      this.viewSelector.gotoView("Clothes");
      return;            
    }
    y += 100;
    if (this.drawMenuButton("Skin", x, y, false)) {
      this.viewSelector.gotoView("Skin");
      return;                  
    }
  }

  
  drawBrokenGlass() {
    // give it up for the huge path!!

    let paths     = [
      new Path2D("M0,82l183,54.63c20.81,6.21,40.35,14.6,60.47,22.9,10.23,4.22,26.36,15.11,37.51,15.47,5.75.19,11.54-6.09,17.05-5.17,4.91.82,14,11.08,17.95,14.17l-54,54.59c-6.63,6.71-18.62,24.71-27.6,27.93-8.55,3.06-12.4-1.7-22.44-7.52,21,17.67,41.67,34.63,64,50.58l54.2,38.79c12.83,9.18,13.78,7.13,13.49,21.88-.17,8.31-.21,41.33-5.92,46.75-4.53,4.3-33.59,1.41-39.29,1.65L195,423l49.53,5.1c17.86,1.84,19.36,2.76,32.25,15.28,10.74,10.43,20.34,19.31,28.31,31.88,12.27,19.35,6.74,21-5.09,40.74-14.31-12.4-13.34-13.62-30.59-7.19-12.82,4.78-26.22,8.87-38.46,14.94S207.57,538,195,543.45C180,550,162,552.68,147.66,560.76c-23.29,13.17-43.16,36-56.65,58.63-5.23,8.77-8.4,22.93-14.67,30-8.85,10-27,17.3-38.34,24.58"),
      new Path2D("M269,160a295.26,295.26,0,0,1,51.63,21.65c12.21,6.54,25,15.71,38,20.36,11.44,4.07,4.69,5.29,13.24-.21s34.5-39.84,34-48.62c-.51-8.14-14.51-23.13-18.82-30L370,96"),
      pathFromLine(325, 493.5, 5, 137.82),
      new Path2D("M494,0l1.25,82.35c.16,10.54-4.37,35.79.68,45.13,4,7.45,9.59,6,20.68,7.78,6.86,1.08,30.77,8.93,36.51,5.44,5.18-3.14,9.83-25.6,11.92-31L596,29"),      
      new Path2D("M789,124c-25.52,8.93-56.17,14.86-79.78,27.92-26,14.4-46.06,40.76-70.77,57.4-11.1,7.48-9.45,7.67-21.61.3-12-7.28-21.7-12.89-35-16.91-12.66-3.83-28.09-4.11-34-17.13-5-11,3.15-26,6.4-37.75"),      
      new Path2D("M721,220c-19.06,9.26-45,29.17-65.79,32-3,.41-4.28,2.95-6.94,2-3.68-1.33-10.23-14.44-12.25-17.3q-9.46-13.4-18.85-26.84"),
      new Path2D("M654,253c5.11,8.72,15,36,23.6,40.31,6,3,23.5-3.1,30.39-4.23L806,273"),
      new Path2D("M881,266l-53,13.5c-9.5,2.42-46.82,5.56-53,13.5-6.71,8.62,0,48.37,0,59.3,0,14.56.57,29.27-.09,43.82-1.51,32.9-2,68-13,99.15-12.53,35.46-21,78.73-39.5,111.48C702.16,642.64,667,674.93,641,707"),
      pathFromLine(775, 786, 280, 287),
      new Path2D("M777,391l-73.3,34.16c-26.85,12.51-29.17,10.22-33.41,39.19-2.2,15-6.86,31.55-6.84,46.71,0,12.21-2.23,7.11,6.45,15.45C689.11,545,716.08,558.71,738,574"),
      new Path2D("M708.5,626.5,606.79,565.13c-11.07-6.68-19.43-14.49-31.79-4.13-11.85,9.92-20.75,32.92-29,46"),
      new Path2D("M623,715l-53.89-74.24c-11.18-15.4-30.68-56.12-48.72-60.29-10.7-2.48-46.78.87-56.5,5.73-10.59,5.3-7.81,3.1-7.26,18.93L460,703"),
      new Path2D("M380,682l36-97c-9.75-3.52-28.7-14.5-37.25-11.41-5.94,2.15-15.32,19.54-18.7,23.84L300,674"),
      pathFromLine(500, 457.36, 657, 626.5),
      pathFromLine(459, 404, 632, 626),
      new Path2D("M376,574l-35.56-20.74c-13.88-8.09-12.68-7.08-25.65,3.09L254,604"),
      new Path2D("M315,555l-17.78-37c-6-12.49-2.62-10.43-11.82-10.61-10.08-.2-26.8,11.25-36.09,15.14l-50,21C182.26,550.62,161,556.18,146,567c-20.6,14.86-38.07,38.29-56,56.35")
    ];
            
    const v = canvas.height/1.5;
    const y = canvas.height/2 - v;  
    const x = canvas.width/2 - v;
    
    ctx.save();  
    ctx.translate(canvas.width/2 - 500, canvas.height/2 - 500);
    ctx.beginPath();
    ctx.strokeStyle = "white";        
    paths.forEach(x => ctx.stroke(x));
    ctx.restore();

    ctx.save();  
    ctx.translate(x, y);
    
    var grd=ctx.createRadialGradient(v,v,v,v,v, 0);
    grd.addColorStop(0,"rgba(0,0,0,1)");    
    grd.addColorStop(0.9,"rgba(87, 188, 208, 0)");
    grd.addColorStop(1,"rgba(91, 194, 211, 0)");  
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,v*2,v*2);    
    ctx.restore();
  }
}

class Makeup extends GameObject {
  constructor(fills,strokes) {
    super();
    this.color = 2;
    if (fills)
      this.fills  = fills.map(x => new Path2D(x));
    else 
      this.fills = [];
    
    if (strokes)
      this.strokes  = strokes.map(x => new Path2D(x));
    else 
      this.strokes = [];    
    
    this.color = 1;    
  }
  
  draw() {
    super.draw();
    let x=this.position.x;
    let y=this.position.y;
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(this.scale, this.scale);
    ctx.fillStyle = colorTable[this.color];
    this.fills.forEach(x => ctx.fill(x));
    ctx.strokeStyle = colorTable[this.color];
    this.strokes.forEach(x => ctx.stroke(x));
    ctx.restore();
  }
  
  update() {  
    super.update();
  }
}

class FacialHair extends GameObject {
  constructor(fills, strokes, opacity, offsetX, offsetY) {
    super();
    this.color = 2;
    this.opacity = opacity || 1;
    this.fills = []; 
    this.strokes = []; 
    this.offsetX = offsetX || 0;
    this.offsetY = offsetY || 0;
    if (fills) this.fills = fills.map(x => new Path2D(x));    
    if (strokes) this.strokes = strokes;// strokes.map(x => new Path2D(x));    
    this.color = 1;    
  }
  
  draw() {
    super.draw();
    let x=this.position.x;
    let y=this.position.y;
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(this.scale, this.scale);
    ctx.fillStyle = colorTable[this.color].rgba(this.opacity);
    this.fills.forEach(x => ctx.fill(x));
    ctx.strokeStyle = colorTable[this.color].rgba(this.opacity);
    this.strokes.forEach(x => ctx.stroke(x));
    ctx.restore();
  }
  
  update() {  
    super.update();
  }
}

class Eyewear extends GameObject {
  constructor(path) {
    super();
    this.path  = new Path2D(path);
    this.color = 1; 
  }
  
  draw() {
    super.draw();
    let x=this.position.x;
    let y=this.position.y;
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(this.scale, this.scale);
    ctx.fillStyle = colorTable[this.color];
    ctx.fill(this.path);
    ctx.restore();
  }
  
  update() {  
    super.update();
  }
}

class Hair extends GameObject {
  constructor(base, shadow, contours, dropShadow, scaleX, scaleY, offsetX, offsetY) {    
    super();
    if (dropShadow) {
      this.dropShadow = new Path2D(dropShadow);
    }
    this.scaleX = scaleX || 1;
    this.scaleY = scaleY || 1;
    this.offsetX = offsetX || 0;
    this.offsetY = offsetY || 0;
    this.base=new Path2D(base);
    this.shadow=new Path2D(shadow);
    this.contours=contours.map(x => new Path2D(x));
    this.color = 4;
    this.extras = [];
    this.extrasFill = "white";
  }
  
  update() {
    super.update();
  }
  
  draw() {
    super.draw();
    let x = this.position.x + this.offsetX;
    let y = this.position.y + this.offsetY;
    let hs = this;  
    let color = colorTable[this.color];    
    ctx.save();    
    ctx.translate(x, y);
    ctx.scale(0.98 * this.scaleX, 1 * this.scaleY);
    ctx.fillStyle = color.rgb();
    ctx.fill(hs.base);    
    ctx.fillStyle = color.darker(22).rgb();
    ctx.fill(hs.shadow);    
    ctx.strokeStyle = color.darker(45).rgb();
    hs.contours.forEach(x => ctx.stroke(x));
    
    ctx.fillStyle = hs.extrasFill;
    hs.extras.forEach(x => {
      const extra = new Path2D(x);
      ctx.fill(extra);
      ctx.stroke(extra);
    });
    
    ctx.restore();
  }
}

class Avatar extends GameObject {
  constructor() {
    super();
    this.capeColor = 1;
    this.skinColor = 0;
    this.hairColor = 4;
    this.hairStyle = 0;
    this.shirtColor = 72;
    this.pantsColor = 24;
    this.bootsColor = 46;
    this.glovesColor = 71;    
    this.facialHairColor = 2;
    this.facialHairStyle = 0;
    this.eyewearColor = 2;
    this.eyewearStyle = 0;
    this.makeupColor = 0;
    this.makeupStyle = 0;
    this.side = 0;    
    this.headRadius = 100;
    this.width = 120;
    this.height = 200;
    this.scale = 1.0;
    this.headAngle = 0;
    this.eyeSize = 27;    
    this.irisSize = this.eyeSize * 0.1;
    this.isEyesClosed = false;
    this.eyeCloseDuration = 0.1;
    this.eyeCloseTimer    = this.eyeCloseDuration;
    this.headTiltDuration = 2;
    this.headTiltTimer    = this.headTiltDuration;
    this.lastHeadTilt     = 0;
    this.lastEyeClosed    = 0;
    this.minTimeBetweenHeadTilt = 6;
    this.minTimeBetweenBlink    = 2;
  }
  update() {
    super.update();
    if (this.isEyesClosed) {
      this.eyeCloseTimer -= Time.deltaTime/1000;
      if (this.eyeCloseTimer <= 0) {
        this.eyeCloseTimer = this.eyeCloseDuration;
        this.isEyesClosed = false;
      }
    }
    
    if (this.headAngle !== 0) { // is head tilted?
      this.headTiltTimer -= Time.deltaTime/1000;
      if (this.headTiltTimer <= 0) {
        this.headTiltTimer = this.headTiltDuration;
        this.headAngle = 0;
      }
    }
    
    if (Math.floor(Math.random()*200) === 42) { // just a magic number      
      if ((Time.time - this.lastEyeClosed)/1000 >this.minTimeBetweenBlink) {
        this.isEyesClosed = true;
        this.lastEyeClosed = Time.time;
      }
    }
    
    if (Math.floor(Math.random()*200) === 88) { // just a magic number      
      if ((Time.time - this.lastHeadTilt)/1000 >this.minTimeBetweenHeadTilt) {
        // this.isEyesClosed = true;
        this.headAngle = Math.random() >= 0.5 ? -5 : 5;
        this.lastHeadTilt = Time.time;
      }
    }
  }  
  draw() {
    super.draw();
    if (this.side === 0) {
      this.drawCapeBack();         
      this.drawBoots();
      this.drawPants();
      this.drawBody();
      this.drawCapeFront();
      this.drawHead();         
      this.drawGloves();
    }
  }
  drawCapeBack() {     
    const headSize = (this.headRadius * this.scale);
    let xoff = this.position.x + headSize - 170;
    let yoff = headSize * 1.75 - 170;
    ctx.save();
    ctx.strokeStyle = "transparent";        

   ctx.translate(xoff, this.position.y + yoff);
   ctx.scale(3.85,3.85);
   
  ctx.fillStyle = colorTable[this.capeColor].darker(20).rgba();
  ctx.beginPath();
  var capeBaseShape = new Path2D("M 10.622113,2.0305957 4.2076419,14.057726 2.604026,22.075806 c 0,0 0.801809,3.207241 -1.87088696,6.414471 -2.67269404,3.20724 12.82893596,1.06908 12.82893596,1.06908 l 46.5049,-0.26727 c 0,0 5.7797,0.70158 3.30746,-2.60588 -2.47225,-3.307461 -1.33635,-8.285351 -2.20497,-11.860081 -0.86863,-3.57473 -6.31425,-11.3923603 -6.31425,-11.3923603 0,0 -1.23612,-1.57021 -3.0736,-2.37202 -1.83747,-0.80181 -41.159502,0.96885 -41.159502,0.96885 z");
  ctx.stroke(capeBaseShape);
  ctx.fill(capeBaseShape);
    
    ctx.fillStyle = colorTable[this.capeColor].rgba();
  ctx.beginPath();
    var capeLightLeft = new Path2D("M 5.8994014,10.733623 10.340621,5.7254387 c 0,0 1.322916,-0.992188 1.937128,-1.322917 0.614211,-0.330729 6.945312,-2.787576 6.945312,-2.787576 l -8.600948,0.41565 z");
  ctx.stroke(capeLightLeft);
  ctx.fill(capeLightLeft);
  
    ctx.beginPath();
  var capeLightRight = new Path2D("m 58.107362,8.3712717 c 0,0 -2.69308,-4.299479 -6.99256,-5.953125 -4.299479,-1.653646 -5.10268,-1.322916 -5.10268,-1.322916 l 3.732517,-0.283483 2.078868,0.236233 c 0,0 3.307292,2.267858 3.921504,3.260045 0.614211,0.992188 2.362351,4.063246 2.362351,4.063246 z");
  ctx.stroke(capeLightRight);
  ctx.fill(capeLightRight);
    
    ctx.restore();
  }
  drawCapeFront() {     
    let leftPath = new Path2D("M18,.44s-3.67,0-3.33,3,5.33,7,8.33,6c1.14-.38,1.85-1.64,2.4-3.1C26.29,4,26.76,1.06,28,.44,30-.56,18,.44,18,.44Z");
    let midPath = new Path2D("M11,.44s-5,4-5,7-3,10-2,15-4,13-4,13,8-1,11-5,7-12,7-15-3-9-2-10S11,.44,11,.44Z");    
    let rightPath = new Path2D("M43,41.44s-10-5-11-8-3-9-2-11,1-12,0-13-6-1-5-3,1-6,3-6,3-1,7,0,8,8,8,12-3,12-2,15-1,2,2,8S43,41.44,43,41.44Z");
    let contour1 = new Path2D("M15,3.39l-2,1a7.78,7.78,0,0,0-2,5.05c0,3,1,10,0,12l-1,2,1-2s1-4,0-12a4.47,4.47,0,0,1,1-4c1.41-1.41.72-.65,1-1a2.82,2.82,0,0,1,2-1h0");
    let contour2 = new Path2D("M30.3,5.39l2,1a7.78,7.78,0,0,1,2,5.05c0,3-1,10,0,12l1,2-1-2s-1-4,0-12a4.47,4.47,0,0,0-1-4c-1.41-1.41-.72-.65-1-1a2.82,2.82,0,0,0-2-1h0");
    let contour3 = new Path2D("M21,6.44a18.66,18.66,0,0,1,3-4s3,2,3,3v2a4.94,4.94,0,0,0-1-3l-2-2s.58.42-1,2Z");
    
    ctx.save();
    ctx.translate(this.position.x + 34, this.position.y + 46);    
    ctx.fillStyle = colorTable[this.capeColor].rgba();    
    ctx.strokeStyle = colorTable[this.capeColor].darker(33).rgba(0.9);

    ctx.beginPath();
    ctx.fill(midPath);
    ctx.stroke(midPath);
    
    ctx.beginPath();
    ctx.fill(rightPath);
    ctx.stroke(rightPath);
    
    ctx.beginPath();
    ctx.fill(leftPath);
    ctx.stroke(leftPath);
    
    
    ctx.strokeStyle = colorTable[this.capeColor].darker(33).rgba(0.5);
    ctx.beginPath();
    ctx.stroke(contour1);
    
    ctx.beginPath();    
    ctx.stroke(contour2);
    
    ctx.beginPath();    
    ctx.stroke(contour3);
    
    ctx.restore();    
  }  
  drawBody() {    
    let bodyPath = new Path2D("M41.5,3.5s-11,7-15,13-15,28-16,32-7,32-7,35,28,6,28,6,3-18,4-23,3-17,3-17l-6,42v3a146.79,146.79,0,0,0,17,4c7,1,31,4,36,4s34,3,55,0,38-5,38-5l-8-50,7,38,27-3s-2-19-3-23-13-35-16-39-8-13-11-15S41.5,3.5,41.5,3.5Z");
    ctx.save();
    ctx.translate(this.position.x - (this.width/2) + 10, this.position.y+14);
    ctx.scale(1,1);
    ctx.fillStyle = colorTable[this.shirtColor].rgba();    
    ctx.beginPath();
    ctx.fill(bodyPath);
    ctx.restore();
    
    let bodyContourPath = new Path2D("M38.5,50.5s-7,40-6,43C33,94.93,38.5,50.5,38.5,50.5Z");
    // blackline 1
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "transparent";    
    ctx.translate(this.position.x - (this.width/2) + 10, this.position.y+14);    
    ctx.fill(bodyContourPath);
    ctx.restore();
    
    // blackline 2
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "transparent";        
    ctx.translate(this.position.x + this.width + 40, this.position.y+14);    
    ctx.scale(-1, 1);
    ctx.fill(bodyContourPath);
    ctx.restore();    
  }    
  drawGloves() {
    let x = this.position.x, 
        y= this.position.y;
    this.drawGlove(x - 32, y, 14);
    this.drawGlove(x + this.width + 20, y, -14);
  }      
  
  drawGlove(x, y, thumb) {    
    const headSize = (this.headRadius * this.scale);
    const color = colorTable[this.glovesColor];
    ctx.strokeStyle = color.darker(75).rgba();
    drawCircle(x, y+headSize+4, color.rgb(), 18);
    drawCircle(x+thumb, y+headSize, color.rgb(), 7);
  }
  
  drawPants() {    
    const headSize = (this.headRadius * this.scale);
    let x = this.position.x- (this.width/2) + 42, 
        y= this.position.y+headSize+8;
    
    let pantsPath = new Path2D("M0,1V35s9.83-2,19.91-3c12.39-1.25,26.67-.55,28.87,0,4,1,22.9,3,22.9,3h8s12.94-2,17.92-2,23.89-1,32.85,0,16.92,3,18.91,4-1-36-1-36-36.83,5-35.84,5S96.56,7,83.62,7,38.82,5,33.84,4,0,0,0,0Z");
    
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = colorTable[this.pantsColor].rgba();    
    ctx.beginPath();
    ctx.fill(pantsPath);
    ctx.restore();    
  }      
  
  drawBoots() {
    let bootsPath = new Path2D("M0,9.44s6-4,11-5,16-4,22-4,17-1,23,0,22,3,27,4,9,0,11,0,7-2,15-2,16-3,34-1,36,8,37,9a1.39,1.39,0,0,1,0,2l-180-1");
    
    
    const headSize = (this.headRadius * this.scale);
    let x = this.position.x- (this.width/2) + 28, 
        y= this.position.y+headSize+39;

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = colorTable[this.bootsColor].rgba();    
    ctx.beginPath();
    ctx.fill(bootsPath);
    ctx.restore();       
  }          
  
  drawHead() {
    const headSize = this.headRadius * this.scale;
    let x = this.position.x + headSize/2;
    let y = this.position.y - headSize/2;
    let angle = this.headAngle * Math.PI / 180;
    ctx.save();
    
   
    this.drawHeadBase();
    ctx.translate(x, y);    
    ctx.rotate(angle);  
    this.drawEyes();
    this.drawMouth();
    this.drawFacialHair();
    this.drawFacialDecoration();
    this.drawHair();
    ctx.rotate(-angle);  
    ctx.translate(-x, -y);
    ctx.restore();
  }
  drawEyes() {
    const headSize = this.headRadius * this.scale;
    let x = (-(headSize/2)) + this.eyeSize;
    let y = 5;    
    const eyeAngle  = 36;
    const eyeAngle0 = eyeAngle * Math.PI / 180;
    const eyeAngle1 = -eyeAngle * Math.PI / 180;                
    this.drawEye(x - 3, y, eyeAngle0, this.eyeSize/2,-5);
    this.drawEye(x + 3 + this.eyeSize + this.eyeSize, y, eyeAngle1, -this.eyeSize/2,-5, true);
    if (this.isEyesClosed === false)  {
      this.drawEyeSeparator(x, y);     
    }
  }
  
  drawEyeSeparator(x, y) {
    const size = this.eyeSize * 0.5;
    y-=2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x+this.eyeSize+1, y+size/2);    
    ctx.bezierCurveTo(x+this.eyeSize-1, y,
                      x+this.eyeSize, y-size/2, 
                      x+this.eyeSize+1, y-size/2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.60)';
    ctx.stroke();
    ctx.restore();
  }
  
  drawEye(x, y, angle, irisOffsetX, irisOffsetY, rightEye) {
    ctx.save();      
    ctx.beginPath();  
    
    const eyeLidColor = skinColors[this.skinColor].darker(7);
    const eyeLidColorShadow = skinColors[this.skinColor].darker(22);    
    
    ctx.strokeStyle = "transparent";    
    ctx.translate(x, y);    
        
    if (this.isEyesClosed) {
      ctx.translate(0, -2);
      ctx.rotate(angle);      
      ctx.fillStyle = eyeLidColorShadow.rgb();
      drawEllipse(0, 0, (this.eyeSize*3)/1.45, this.eyeSize * 2.5);      
      ctx.rotate(-angle);
      ctx.translate(0, 2);
    }
    
    ctx.fillStyle= this.isEyesClosed ? eyeLidColor.rgb() : "white";    
    ctx.rotate(angle);        
    drawEllipse(0, 0, (this.eyeSize*3)/1.45, this.eyeSize * 2.5);
    ctx.translate(-x, -y);
    if (this.isEyesClosed) {      
      const shiftDown = 15;
      ctx.rotate(-angle);
      ctx.beginPath();      
      ctx.strokeStyle = eyeLidColorShadow.darker(33).rgb();
      // ctx.arc(x+irisOffsetX, y+irisOffsetY, this.irisSize, 0, 2 * Math.PI, false);      
      if (rightEye) {
        ctx.moveTo(x -5 - this.eyeSize, y -4.5-shiftDown);
        ctx.lineTo(x -5 + this.eyeSize, y -4.5);
      } else {
        ctx.moveTo(x +1 - this.eyeSize, y);
        ctx.lineTo(x +5 + this.eyeSize, y-shiftDown);
      }      
      ctx.stroke();
      
    }
    else {
      ctx.beginPath();
      ctx.fillStyle= "black";
      ctx.arc(x+irisOffsetX, y+irisOffsetY, this.irisSize, 0, 2 * Math.PI, false);
      ctx.fill();            
    }
    ctx.restore();         
  }
  
  drawMouth() {
    ctx.save();
    
    const headSize = this.headRadius * this.scale;
    const size = headSize/3.75;
    let y = headSize/1.5 + 5;
    let x = -headSize/2 + size*1.5;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x+3, y-3,
                      x+10, y-5, 
                      x+size, y+1);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();
  }
  
  drawFacialHair() {
    
    const headSize = this.headRadius * this.scale;

    const facial = facialHairs[this.facialHairStyle];
    const color = colorTable[this.facialHairColor];
    
        
    if (!facial || (!facial.strokes && !facial.fills))  return;
    
    const x = (-(headSize/2) - 26 + 10) + facial.offsetX;
    const y = 32+ facial.offsetY;
    
    ctx.save();    
    ctx.scale(1.32,1.32);
    ctx.translate(x, y);    
    ctx.strokeStyle = ctx.fillStyle = color.rgba(facial.opacity);
    facial.fills.forEach(x => ctx.fill(x));
    facial.strokes.forEach(x => ctx.stroke(x));
    ctx.restore();
  }
  
  drawFacialDecoration() {    
    const headSize = this.headRadius * this.scale;    
    const eyewear = eyewears[this.eyewearStyle];
    const makeup  = makeups[this.makeupStyle];
    if (makeup && (makeup.fills || makeup.strokes)) {
      const x = -(headSize/2) - 26;
      const y = -20;    
      const color = colorTable[this.makeupColor];            
    }
    if (eyewear && eyewear.path)  {
      const x = -(headSize/2) - 26;
      const y = -20;    
      const color = colorTable[this.eyewearColor];      
      ctx.save();    
      ctx.scale(1.32,1.32);
      ctx.translate(x, y);    
      ctx.fillStyle = color.rgb();
      ctx.fill(eyewear.path);
      ctx.restore();
    }    
  }
  
  drawHair() {    
    if (this.hairStyle === 0) return; // bald
    const headSize = this.headRadius * this.scale;
    let x = headSize*1.22;
    let y = headSize*1.23;
    
    let hs = hairstyles[this.hairStyle];    
    
    x += hs.offsetX;
    y += hs.offsetY;
  
    let color = colorTable[this.hairColor];    
    ctx.save();    
    ctx.translate(-x, -y);
    ctx.scale(0.98 * hs.scaleX, 1 * hs.scaleY);
              
    if (hs.dropShadow) {      
      ctx.fillStyle = skinColors[this.skinColor].darker(15).rgb();
      ctx.fill(hs.dropShadow);   
    }
        
    ctx.fillStyle = color.rgb();
    ctx.fill(hs.base);    
    ctx.fillStyle = color.darker(22).rgb();
    ctx.fill(hs.shadow);
    
    ctx.strokeStyle = color.darker(45).rgb();
    for (let c of hs.contours)
      ctx.stroke(c);
    
    ctx.fillStyle = hs.extrasFill;
    hs.extras.forEach(x => {
      const extra = new Path2D(x);
      ctx.fill(extra);
      ctx.stroke(extra);
    });
        
    ctx.restore();
  }
  drawHeadBase() {
    const headSize = this.headRadius * this.scale;
    const x = this.position.x + headSize/2;    
    const y = this.position.y - headSize/2;    
    ctx.save();    
    ctx.strokeStyle = "transparent";
    drawCircle(x, y, skinColors[this.skinColor].rgb(), headSize);
    ctx.restore();    
  }
}

class HairPicker extends GameObject {
  constructor(hair) {
    super();
    this.selectedHair = hair || 1; 
    this.selectedHairBtn = undefined;
    for(let i = 0; i < hairstyles.length; i++) {
      let btn = new Button();      
      btn.background = rgba(255,255,255, 0.4);
      btn.border     = rgba(0,0,0,0);
      btn.content    = hairstyles[i];
      btn.contentScale  = 0.25;      
      btn.text       = "";
      btn.width      = 80;
      btn.height     = 80;
      btn.on("click", () => this.pickHair(btn, i));
      this.addChild(btn);
      if (i === this.selectedHair) {
        this.pickHair(btn, i);
      }
    }
  }
  draw() {
    super.draw();
  }
  update() {
    super.update();
    const margin = 3;
    const tileWidth = 80;        
    const tileHeight = 80;
    const containerWidth  = (hairstyles.length * tileWidth) + (hairstyles.length * margin); 
    const dif = canvas.width - containerWidth;     
    const startX = dif/2;    
    const left = 10;
    const top  = 15;        
    this.position.y = canvas.height - (tileHeight * 3);  
    for (let i = 0; i < this.children.length; ++i) {
      this.children[i].position = new Point(
        this.position.x + i * tileWidth + startX + (margin * i),this.position.y);
      this.children[i].contentMargin = {
        top: top - this.children[i].content.offsetY, 
        left: left - this.children[i].content.offsetX/2, right: 0, bottom: 0
      };
      if (this.children[i].contentMargin.top !== top) {
        this.children[i].contentMargin.top += top;
        if (i === 4 || i === 5) {
          this.children[i].contentMargin.top -= top;
        }
      }
    }        
  }
  pickHair(btn, hair) {
    if (this.selectedHairBtn) {     
      this.selectedHairBtn.borderWidth = 1;
      this.selectedHairBtn.border = rgba(150,150,150,0.4);
    }
    this.selectedHair = hair;
    btn.borderWidth = 5;
    btn.border = rgb(255, 255, 0);
    this.selectedHairBtn = btn;
  }
}

class EyewearPicker extends GameObject {
  constructor(color) {
    super();
    this.btnWidth = 80;
    this.btnHeight = 80;
    this.selectedEyewear = color || 2;
    this.selectedEyewearBtn = undefined;
    for (let i = 0; i < eyewears.length; ++i) {
      let btn = new Button();
      btn.width  = this.btnWidth;
      btn.height = this.btnHeight;
      btn.background = rgba(255,255,255, 0.4);
      btn.border     = rgba(0,0,0,0);
      btn.content     = eyewears[i];
      btn.content.color = 2;
      btn.contentScale  = 0.5;
      btn.contentMargin = {top:30,left:0};      
      btn.on("click", () => this.pickEyewear(btn, i));
      btn.text    = "";
      btn.content.width = btn.width;
      btn.content.height = btn.height;
      this.addChild(btn);      
      if (i === this.selectedEyewear) {
        this.pickEyewear(btn, i);
      }
    }
  }
  
  pickEyewear(btn, eyewear) {
    if (this.selectedEyewearBtn) {     
      this.selectedEyewearBtn.borderWidth = 1;
      this.selectedEyewearBtn.border = rgba(150,150,150,0.4);
    }
    this.selectedEyewear = eyewear;
    btn.borderWidth = 5;
    btn.border = rgb(255, 255, 0);
    this.selectedEyewearBtn = btn;
  }
  
  draw() {
    super.draw();
  }
  update() {
    super.update();    
    const margin = 3;
    const tileWidth = this.btnWidth;        
    const tileHeight = this.btnHeight;
    const containerWidth  = (eyewears.length * tileWidth) + (eyewears.length * margin); 
    const dif = canvas.width - containerWidth;     
    const startX = dif/2;    
    const left = 10;
    const top  = 15;        
    this.position.y = canvas.height - (tileHeight * 3);  
    for (let i = 0; i < this.children.length; ++i) {
      this.children[i].position = new Point(
        this.position.x + i * tileWidth + startX + (margin * i),this.position.y);
    }     
  }
}

class MakeupPicker extends GameObject {
  constructor(color) {
    super();
    this.selectedMakeup = color || 0;
    this.selectedMakeupBtn = undefined;
    for (let i = 0; i < skinColors.length; ++i) {
      
    }
  }
  draw() {
    super.draw();    
      drawTallText("Coming soon!", canvas.width/2 - 110, canvas.height - 300, 26);
  }
  update() {
    super.update();
  }
}

class FacialHairPicker extends GameObject {
  constructor(color) {
    super();
    this.selectedFacialHair = color || 0;
    this.selectedFacialHairBtn = undefined;
    this.btnWidth  = 80;
    this.btnHeight = 80;
    for (let i = 0; i < facialHairs.length; ++i) {
      let btn = new Button();
      btn.width  = this.btnWidth;
      btn.height = this.btnHeight;
      btn.background = rgba(255,255,255, 0.4);
      btn.border     = rgba(0,0,0,0);
      btn.content     = facialHairs[i];
      btn.contentMargin = {left: 5, top: 40};
      btn.content.color = 2;
      btn.contentScale  = 0.5;
      // btn.contentMargin = {top:30,left:0};      
      btn.on("click", () => this.pickFacial(btn, i));
      btn.text    = "";
      btn.content.width = btn.width;
      btn.content.height = btn.height;
      this.addChild(btn);
      if (i === this.selectedFacialHair) {
        this.pickFacial(btn, i);
      }
    }
  }
  
  pickFacial(btn, index) {
    if (this.selectedFacialHairBtn) {
      this.selectedFacialHairBtn.borderWidth = 1;
      this.selectedFacialHairBtn.border = rgba(150,150,150,0.4);
    }
    this.selectedFacialHairBtn = btn;
    btn.borderWidth = 4;
    btn.border = rgb(255, 255, 0);
    this.selectedFacialHair = index;    
  }
  
  draw() {
    super.draw();
  }
  update() {
    super.update();
    const margin = 3;
    const tileWidth = this.btnWidth;        
    const tileHeight = this.btnHeight;
    const containerWidth  = (facialHairs.length * tileWidth) + (facialHairs.length * margin); 
    const dif = canvas.width - containerWidth;     
    const startX = dif/2;    
    const left = 10;
    const top  = 15;        
    this.position.y = canvas.height - (tileHeight * 3);
    for (let i = 0; i < this.children.length; ++i) {
      this.children[i].position = new Point(
        this.position.x + i * tileWidth + startX + (margin * i),this.position.y);
      
      if  (i === 4 || i === 5) {
        this.children[i].contentMargin = {top: this.children[i].contentMargin.top, left: 30};
      }
      
      // this.children[i].content.position = this.children[i].position;
    }             
  }
}

class SkinRect extends GameObject {
  constructor(color, next) {
    super();
    this.color = color;
    this.next  = next || color;
    this.width  = 100;
    this.height = 64;
  }
  draw() {
    super.draw();
    let a = this.color.rgb();
    let b = this.next.rgb();
    let x = this.position.x;
    let y = this.position.y;
    var grd=ctx.createLinearGradient(x,y,x+this.width,y);
    grd.addColorStop(0,   a);
    grd.addColorStop(0.7, a);
    grd.addColorStop(1,  b);
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, this.width, this.height);
  }
  update() {
    super.update();
  }  
}

class SkinPicker extends GameObject {
  constructor(color) {
    super();
    this.selectedSkin = color || 0;
    this.selectedSkinBtn = undefined;
    this.btnWidth  = 140;
    this.btnHeight = 60;
    for (let i = 0; i < skinColors.length; ++i) {
      let btn = new Button();
      btn.width  = this.btnWidth;
      btn.height = this.btnHeight;
      btn.background = rgba(0,0,0,0);
      btn.border     = rgba(0,0,0,0);      
      btn.on("click", () => this.pickSkin(btn, i));
      btn.text    = "";
      btn.content = new SkinRect(skinColors[i], skinColors[i+1]);
      btn.content.width = btn.width;
      btn.content.height = btn.height;
      this.addChild(btn);      
      if (i === this.selectedSkin) {
        this.pickSkin(btn, i);
      }
    }
  }
  draw() {
    super.draw();
  }
  update() {
    super.update();    
    const margin = 3;
    const tileWidth = this.btnWidth;        
    const tileHeight = this.btnHeight;
    const containerWidth  = (skinColors.length * tileWidth) + margin*2; 
    const dif = canvas.width - containerWidth;     
    const startX = dif/2;    
    let offset = 0;
    this.position.y = canvas.height - (tileHeight * 3);  
    for (let i = 0; i < this.children.length; ++i) {      
      let child = this.children[i];
      if (i === this.selectedSkin) {
        offset += margin;
      }
      child.position = new Point(
        this.position.x + offset + i * tileWidth + startX,this.position.y);
      if (i === this.selectedSkin) {
        offset += margin;
      }
    }      
  }
  
  pickSkin(btn, index) {
    if (this.selectedSkinBtn) {
      this.selectedSkinBtn.borderWidth = 1;
      this.selectedSkinBtn.border = rgba(150,150,150,0.4);
    }
    this.selectedSkinBtn = btn;
    btn.borderWidth = 4;
    btn.border = rgb(255, 255, 0);
    this.selectedSkin = index;
  }
}

class ColorPicker extends GameObject {
  constructor(color) {
    super();  
    this.selectedColor = color || 1;
    this.selectedColorBtn = undefined;
    for(let i = 0; i < colorTable.length; i++) {
      let btn = new Button();
      btn.borderOnInside = true;
      btn.on("click", () => this.pickColor(btn, i));
      btn.text = "";
      btn.background = colorTable[i];  
      btn.border = rgba(150,150,150,0.4);
      btn.borderWidth = 1;
      this.addChild(btn);      
      if (i === this.selectedColor) {
        this.pickColor(btn, i);
      }
    }    
  }  
  pickColor(btn, color) {
    if (this.selectedColorBtn) {
      this.selectedColorBtn.borderWidth = 1;
      this.selectedColorBtn.border = rgba(150,150,150,0.4);
    }
    this.selectedColorBtn = btn;
    btn.borderWidth = 4;
    btn.border = rgb(255, 255, 0);
    this.selectedColor = color;             
  }  
  draw() {
    super.draw();
  }  
  update() {
    super.update();
    const rows = 5;
    const columns = 16;
    const tileHeight = 24;
    const containerWidth  = canvas.width * 0.9; // take up 90% of the canvas width
    const dif = canvas.width - containerWidth;
    const containerHeight = rows*tileHeight;  
    const tileWidth = containerWidth/columns;
    const startX = dif/2;
    this.position.y = canvas.height - (containerHeight * 2);
    for(let y = 0; y < rows; ++y) {
      for(let x = 0; x < columns; ++x) {
        let i = y * columns + x;
        this.children[i].width = tileWidth;
        this.children[i].height = tileHeight;
        this.children[i].position = new Point(this.position.x + x * tileWidth + startX,this.position.y+ y * tileHeight);
      }
    }        
  }
}

// ------------- inits
const avatar = new Avatar();
const facialHairs = [
  new FacialHair(),
  new FacialHair([],[pathFromLine(5,5,6,2), pathFromLine(3,9,12,8), pathFromLine(6,11,14,12),pathFromLine(8,13,18,15), pathFromLine(13,18,23,18), pathFromLine(18,22,27,23),pathFromLine(22,26,31,27), pathFromLine(27,31,34,29), pathFromLine(33,35,36,31),pathFromLine(42,39,34,40), pathFromLine(47,48,42,37), pathFromLine(56,56,44,39),pathFromLine(63,63,44,39), pathFromLine(70,70,44,37), pathFromLine(77,74,42,39),pathFromLine(84,82,41,37), pathFromLine(92,87,40,36),               pathFromLine(97,93,36,33), pathFromLine(103,99,34,31),                pathFromLine(107,103,31,27),pathFromLine(113,107,27,23), pathFromLine(116,112,23,20),pathFromLine(120,116,18,16),pathFromLine(124,119,14,11),pathFromLine(128,122,8,6),pathFromLine(130,125,2,2)], 1),
  new FacialHair(["M140.05,9c-1,2-6,6-7,8a143.09,143.09,0,0,1-11,15c-2,2-5,3-7,4s-19,9-19,9l-2-2V33l1-10V21l-12-5-7-4-6.34.36L61.05,16l-5,3-5,4-1,2,1,6-1,9-1,5h-5l-10-6-8-5-13-14S-.95,0,.05,3s10,25,10,25,3,2,5,3,3,7,3,7a47.09,47.09,0,0,1,5,2c2,1,4,6,4,6a52,52,0,0,1,5,3,12,12,0,0,1,4,4,58.09,58.09,0,0,1,10,1,103.79,103.79,0,0,1,13,4l15,5a47.09,47.09,0,0,0,5-2c2-1,10-4,10-4l8-2,6-4c3-2,9-2,9-2l6-8,11-10,8-9,4-10,3-12S141.05,7,140.05,9Zm-49,36-10,5s-4,1-6,0-2-2-2-2a7.47,7.47,0,0,1-3,3c-2,1-7-2-10-3s-7-5-7-5V35s0-8,1-10,7-6,11-7,13,0,15,0,7,5,9,7,2,9,2,9Z"],[],1,-5,-9),
  new FacialHair(["M138.37,8.94,130,18s-10,8-13,9-8,5-15,2S82,19,79,18s-9-2-13-1-25,7-28,7-8,3-16-2S0,0,0,0L2,8,9,21l9,10L34,42l16,7,12,3H74l12-1,10-3,12-5,15-11,7-8,6-9,3-6Z"],[],0.35, -5, -8),
  new FacialHair(["M48,14.28l-5.82-3.07A16.45,16.45,0,0,0,37.76,10C34.9,9.65,31,10,29,9.28a10.46,10.46,0,0,1-4.76-3.5S24,6.28,21,8.28s-8,1-8,1a21.42,21.42,0,0,0-6,1,66.59,66.59,0,0,0-7,3,13.38,13.38,0,0,1,1-5,10.24,10.24,0,0,1,6-5c3-1,8-2,11-3s6,1,6,1,3-2,6-1,4,1,7,2,9,3,10,6A21.42,21.42,0,0,1,48,14.28Z","M30,40.28a21.8,21.8,0,0,0-6-1,35.48,35.48,0,0,0-7,1v-6l4-2,2-1,4,1,3,2Z"],[],1, 44, 0),
  new FacialHair(["M34,0c-5,0-9,0-11,1a10,10,0,0,1-4,1s-4-2-6-2S5,0,3,1,0,5,0,5V27s0,3,4,6,11,3,11,3,6,2,6,3,0-2,2-2,6,0,9-1,7-3,8-6,3-9,3-13V5C43,3,39,0,34,0Zm6,23c0,4-3,5-5,7s-5,1-8,1a12.13,12.13,0,0,1-5-1,32,32,0,0,0-7,1c-4,1-9-2-11-3s-2-4-2-8A41,41,0,0,1,3,9C4,5,3,5,5,4s6-1,9-1,5,2,6,2,5-2,8-3,6,0,9,1,3,4,3,8Z"],[],1, 48, 2)
];
const makeups = [
  new Makeup()
];
const eyewears = [
  new Eyewear(),
  new Eyewear("M122.89,22.15a33.74,33.74,0,0,0-7.8-13c-5.85-6-12.68-10-19.51-9s-11.7,4-13.65,7-2.93,10-2.93,10-1-7-2.93-10-6.83-6-13.65-7-13.65,3-19.51,9a33.74,33.74,0,0,0-7.8,13L0,15.15v4l34.14,7v1a24.77,24.77,0,0,0,.86,7,36.41,36.41,0,0,0,4,9c2,3,5.86,4,5.86,4,2.76,1.41,4.88,2,14.63,1,7.82-.8,10.73-6,13.65-9s4.88-9,5.85-11c1,2,2.93,8,5.85,11s5.83,8.2,13.65,9c9.75,1,11.87.41,14.63-1,0,0,1.85,0,4.86-3,1.27-1.26,2-2,4-6a27.1,27.1,0,0,0,2-5c.71-2.12-.14-6-.14-6v-1l27.14-5v-4ZM72,36.15c-4,5-6,7-12,10s-13,0-17-2-4-4-6-10-1-6,0-11,4-9,7-13,11-6,16-7,9,2,11,3,6,9,6,9a24.42,24.42,0,0,1,1,7C78,26.15,76,31.15,72,36.15Zm48,0c-2,5-5,8-12,10s-12,0-17-3-7-8-9-12-2-9-1-14a24.13,24.13,0,0,1,3-8,23.61,23.61,0,0,1,12-6c7-1,14,5,18,8s6,10,6,10S122,31.15,120,36.15Z")
];

const hairstyles = [
  new Hair("","", []), // bald
  new Hair(
    /* base */
    "M156.1,7.15s-12-5-20-6-32-2-41,0-29,8-34,12-23,17-28,23-14,20-17,27-8,21-9,26c-.61,3-2.71,11.67-4.48,18.16-.27,1-.54,1.94-.79,2.81a24.67,24.67,0,0,1-1.74,5,65.8,65.8,0,0,0,9-9c3-4-3,8-4,12s0,20,1,25,2,9,3,11,7-19,6-17,1,14,2,17,5,9,8,13,9,8,13,9-2-2-2-2c-2-5-3-6-3-6s-2-2-3-8-1-18,0-23-2-12,0-20,10-9,14-17,8-13,15-15,12-9,12-9,6,2,10-1,9-1,12-2,24-10,27-12-2,4-2,4-7,9-8,10,0,1,0,1h12s9-2,12-4,7-5,8-7,5-7,6-9,4-7,4-7l1,3a87.9,87.9,0,0,0,5,10c2,3,8,8,10,9s7,4,8,4-4-11-4-13,0-4,1-5,1,5,2,6,10,12,16,12,27,27,27,27,5,7,4,14-3,14-3,17,1,15-1,21-11,26-11,26,12-8,14-11,8-10,8-12,3,8,3,8,4-9,5-14,3-20,3-23-1-7-1-9,5,5,5,7,1-8,0-14-7-35-8-39-10-31-12-34-15-18-19-21-19-10-26-11S156.1,7.15,156.1,7.15Z",
    /* shadow */
"M9.1,103.15c2-1,3,0,3,0l-1,18s5-8,9-13,7-11,8-12,1,8,1,8,14-21,24-25,25-12,25-13,2,4,1,5a3.1,3.1,0,0,0-1,2,44,44,0,0,0,9-1c4-1,17-5,19-6s15-9,16-10,2,5,1,6-3,8-4,9,3,0,8-2,16-6,18-10,4-10,5-11,4,0,4,0a87.9,87.9,0,0,0,5,10c2,3,13,11,14,11s-6-17-4-18,5,5,8,8,16,13,19,15,15,9,19,14-2-10-2-10,8,11,10,16,8,18,8,20,0-1,2-11l2-10v-1s5,18,7,21,2.17,12,2.17,12-4.17-8-5.17-8,1,7,1,11-3,23-4,25-3,9-4,10-2-7-2-7-5,8.53-7,10.26-16,14.74-16,13.74,7-14,8-17,4-17,4.5-19.5.17-15.5.83-17,3.67-10.83,1.17-17.17-14.17-21.33-16.33-22.83-13.17-9.5-18.17-12.5c-4.62-2.77-12-11-12-11l-2-6v3a18.54,18.54,0,0,0,2,7c1,2,2,8,2,8l-2.67-.67s-7.33-2.33-11.33-5.33-9-11-10-14a14.3,14.3,0,0,0-1.67-3.83,17.4,17.4,0,0,1-1.33,4.83c-1,2-5,10-7,11s-11,7-15,8-17,1-18,1,1-1.33,4-5.67,6-9.33,6-9.33a29.58,29.58,0,0,1-4,3,91.43,91.43,0,0,1-14,7c-3,1-17,4-19,4-1.36,0-4,1-6.5,1.52a5.81,5.81,0,0,1-3,0l-1.45-.48h-1s-6.33,6.67-8.17,7.33-9.83,4-10.33,4.83-5.5,4.83-8.5,9.83a108.91,108.91,0,0,1-6.5,9.5s-4.5,1.5-5.5,4.5a42.53,42.53,0,0,0-2,11c0,3,2,7,1,10s-2,5-2,8a115.62,115.62,0,0,0,1,17c.89,5.31,8.33,17,9,18s-3,0-3,0-11-7-13-10-7-12-7-14-1.5-13.75-1.25-14.37-1.75,2.38-1.75,4.38-3,11-3,12-3-7-4-11-1-21-1-23,4.25-11.75,4.13-12.37.88-2.12-2.13.63a87,87,0,0,0-7,7.75s3-11,4-12,2-4,2-4Z",
    /*contours/lines in the hair*/
    [
      "M147.1,10.15s-16-2-23-1-28,5-30,6",
      "M203.1,41.15s-4-6-7-8-10-7-13-8-13-3-17-3a77.21,77.21,0,0,0-10,1",
    ]),
  new Hair(
    /* base */  "M226,132.44s-48,6-70,6-54-2-54-2l-35-3s-2,22-5,28-16,29-17,30-2,6,0,12,17,29,17,28-10-3-14-6,8,17,8,17-13-8-17-11-27-24-36-55,5-84,5-84,23-45,43-58,23-21,53-31,91,5,91,5,60,26,71,55,26,73,24,92-12,51-25,61-24,23-29,26,7-18,7-18l2-4s-15,8-18,8,13-16,13-16a30.75,30.75,0,0,0,6-15c1-9-14-31-15-38s-5-24-5-24Z",
    /* shadow, on top of hair */ "",
    /*contours/lines in the hair*/ [],
  /*drop shadow, beneath the base hair*/ "M59,245.44l-13-12-6-16-3-26,4-54,28-25H216l32.75,14.5s9.25,54.5,9.25,55.5-2,28-2,28l-17,29-3,3-2,1,5-16-1-2-11,2h-2l14-17a16.85,16.85,0,0,0,4-8,25.73,25.73,0,0,0-1-15c-2-5-8-19-9-20s-7-21-8-24-2-8-2-8a83.67,83.67,0,0,1-12,1c-6,0-41,7-71,5s-69-6-69-6,1,9-1,16-12,27-14,29-9,14-8,18-1,7,3,12,10,16,10,16l2,4-4.17-.33L47,223.44l6,10Z", 0.88, 0.92, 3, 34),
  
  new Hair(
    /* base */  "M232,175.46s-20-41-22-49-20-50-20-50-51,4-58,4-61-2-63.5-2-19.5-2-19.5-2-7.67,13.67-9.33,18.33-12,34.33-14.33,41S6.19,175.46,6.19,175.46s-6.19-18-6.19-26,3-37,6-44,18-34,24-39,18-16,19-16,0-15,2-21,12-20,17-23,12-8,23-6,19,4,24,4,13-4,25-4,19,1,22,4,10,10,13,18,4,19,5,20,18,12,25,21,22,27,26,39,7,24,7,36-3,37-4,39S232,175.46,232,175.46Z",
    /* shadow, on top of hair */ "",
    /*contours/lines in the hair*/ [
      "M18,136.46s-7-13-5-24a122,122,0,0,1,5-19",
      "M34,65.46a104.06,104.06,0,0,0-6,15c-2,7,0,19,0,19",
      "M45,70.46s4-16,9-20",  "M54,65.46s-1-14,14-23",  "M74,33.46s-3-14,3-22",
      "M61,40.46s-4-15,4-25", "M54,44.46c1-2-2-8,0-11", "M94,63.46s0-23,10-30",
      "M104,63.46s2-24,9-30", "M148,63.46s2-25-12-34", "M119,27.46s1-11-3-16",
      "M155,30.46s2-16-7-22", "M159,30.46s10-10,0-19", "M172,40.46s3-9,0-13",
      "M192,67.46s-1-12-10-17", "M221,120.46s1-26-7-40", "M233,144.46s4-23-3-37"
    ],
  /*drop shadow, beneath the base hair*/ undefined,  0.88, 0.92, -18, 14), 
new Hair(
    /* base */  "M7,249.59s4-29,3-42-10-42-10-53,11-51,13-55,36-52,43-59,46-38,71-40,69,1,82,10,50,38,55,52,22,41,26,52,10,51,9,62.5a115.55,115.55,0,0,0,0,20.5l-6-16-.5,44,3.5,30s-13-24-14-30-5,3-5,3l5,17s-6-10-8-16.5-1-25.5-1-25.5l-3,7v-12.5s-6.75,11.5-13.87,15.5,7.88-10,9.88-28,1-62,1-62-7-32-8-34-16-25-16-25l-.38,20.14L237,81.59l1,7s-13.85-13-16.42-15.5S207,52.59,207,52.59s0,22,2,25l10,15s-32-20-32-22,9,14,9,14l-16-14s-1,9,4,14a66.05,66.05,0,0,1,9,12s-16-11-19-17-15-27-15-27l-19,32-14,15v-18l-3.48-17.43L117,81.59l-2-11s-16,22-21,24,5-9.25,6.5-14.63S105,54.59,105,54.59l-13,25-5.79-9L85,84.59s-11-2-11-7-8-7-8-7,1,11,2,14a15.77,15.77,0,0,1,1,4s-10-2-13-7-6-9-6-9-5,9-3,12,3,8,3,8l-9-4-1,13s-3,8-2,20,2,24,2,28v18l-5-13s-4.2,12-1.1,20.5S45,210.59,45,210.59l-1,3-16-14s3,15,0,21-9,21-9,21v-19Z",
    /* shadow, on top of hair */ "",
    /*contours/lines in the hair*/ [
      "M229,49.59s-35-32-54-33", "M180,11.59s-8-4-16-2", "M126,19.59s-13,2-18,8",
      "M113,16.59s-19,3-30,11", "M75,43.59a42.83,42.83,0,0,0-16,9", "M30,89.59s-22,14-19,49",
      "M26,128.59c0,1-1,4,2,19", "M16,164.59a108.94,108.94,0,0,0,2,20c2,9,5,17,2,26",
      "M281,190.59s-4,16-3,24", "M293,171.59s1-17-3-27", "M268,90.59s7,23,5,38",
      "M98,54.59s-4,13-7,16", "M148,54.59s0,11-11,27", "M166,44.59s8,11,15,20",
      "M223,67.59c1,1,9,8,12,11",      
    ],
  /*drop shadow, beneath the base hair*/ undefined, 0.88, 0.92, 8, -8),
  new Hair(
    /* base */  "M189,46s-12,18-28,26-38,15-38,15l10-15S112,87,95,97s-51.76,27-52.38,25.5,8.7-12.82,8.7-12.82S36,114,32,119s-7,9-7,9,2,14,2,16,7,24,8,27,17,26,17,26-10,9-13,11-11,3-11,3l14-22s-4-2-6-1-12,3-16,3-13-5-13-5l-3-3s12-3,15-4,8-8,8-8-7,3-12,2-15-8-15-8,16-3,19-6,4-8,4-12-2-41-2-46,9-39,13-45S66,21,74,17,113,0,124,0s40,1,53,5,40,16,46,23,22,22,28,38,10,33,10,41-3,29-3,34,3.25,13.25,7.13,15.63,15.71,7.23,18.29,7.8S264,173,261,173s18,7,20,7-9,7-11,7-17-2-18-1-7,0-7,2,4,8,6,10,9.08,9.38,9.08,9.38S251,207,249,206s-9-5-10-5-9-4-9-4,9-13,11-17,10.33-23.33,11.17-31.17A79,79,0,0,0,252,133s-13-14-16-15-29-19-35-30-9-25-10-30S189,46,189,46Z",
    /* shadow, on top of hair */ "",
    /*contours/lines in the hair*/ [],
  /*drop shadow, beneath the base hair*/ undefined, 0.88, 0.92, 0, -5),  
  new Hair(
    /* base */ "M177.15,45.34s-15-4-32,8-51,40-51,40-28,27-38,34a97.89,97.89,0,0,1-22,11s-3,16,0,30,20,50,28,58-11,6-11,6-23.79-11-29.9-17.5-20.1-40.5-21.1-56.5,3-61,9-75,23.32-47,45.16-57.5S108.15,1.34,132.15.34s60,0,73,6,54,29,61,41,31,50,30,78,1,58-11,72-33,33-40,35-16-3-11-6,15-18,15-18,9-21,10-24a87.7,87.7,0,0,0,5-29,195.21,195.21,0,0,0-3-31s-9-2-12-9.51-7-17.49-7-21.49-2-12-6-13-20-9-28-14S177.15,45.34,177.15,45.34Z",
    /* shadow, on top of hair */ "",
    /*contours/lines in the hair*/ [],
  /*drop shadow, beneath the base hair*/ "M266.15,131.34c1-1-12-8-12-8s-5.14-2-9.57-12-4.43-21-5.43-23-7-8-14-10-19-8-25-12-17-11-20-14l-5-5s-13,1-19,4-23.35,12-29.17,17a288.31,288.31,0,0,0-21.49,21c-4.33,5-21.33,21-29.33,26s-19,16-28,21-13,7-15,10-11,5-11,5l4-33s51.34-54,51.67-56,94.33-47,94.33-47l28,24,41,33,12,16c3,4,13,23,13,23Z", 0.88, 0.92, 7, 18), 
  
  
    new Hair(
    /* base */ "M160,61s1,3.19-10,14.09S129,99,128,102s0-18,0-18l-23,35v-9L89,123l3-8s-24,13.66-30,17.33-27,8.87-27,8.87S48,129,50,128s-4,0-4,0l9-8H41.64L34,142l1-18s-2,7-3,11,1,18,0,22-5,15-5,14,1-20,1-20l-2,13s-3,6-3,8,7,18,10,23,10,12,10,12-5,8-8,10-10,4-10,4l1-3-5.54,1S25,209,25,207s-6.36,6.12-8.68,7.56S19,208,19,208l-6,5,7-12L4,212l7-10-5,2s12-15,12-16-8,7-8,7l3-6s-9,6-10,6,7-12,7-12l-6,2s5-7,6-9,2-8,2-8l-7,7s3-11,3-12-5,6-5,6,2-8,2-11,2.75-27.5,1.38-31.75S5,105,6,103s1-9,1-9L0,104S10.95,64,18,57,39,36,44,32,77,13,82,10s19-6,27-7,31-3,38-3,26,2,31,6,22,14.5,25,15.25S232,39,246,68s11,18,13,31,2,30,0,42-1,33-1,33l-4-8s-1,6,0,7,2,4,2,4l-4-4,1,5,5,13-9-13s1.83,7.83,1.92,7.92S248,180,248,180v8s5,14,6,16-7-6-7-6a17.27,17.27,0,0,0,2,7c2,4,7.42,16.58,7.42,16.58S249,217,248,215a27.36,27.36,0,0,0-4-5,13.38,13.38,0,0,0,1,5c1,2,2.17,4.62,2.17,4.62S242,215,241,214l-4-4a4.38,4.38,0,0,0,.83,3.17A7.93,7.93,0,0,1,239,217l-4-5-1,6-2-6-1,8-10-11s7.8-12,8.9-14,7.1-12,8.1-16,5.25-15,5.13-16.5S244,127,244,127s-1,5-3,8-13,17-15,18-1,0-1,0l3-9c1-3,0-13,0-13l-4,13-2-15s-1-4-2-3-3,8-3,8-6,11-10,15l-12,12s2-10,3-14,2-25,2-28-10-30-16-36S160,61,160,61Z",
    /* shadow, on top of hair */ "",
    /*contours/lines in the hair*/ ["M244,165s-2,19,0,24",
"M235,188s-2,15-1,17","M236,192s3,10,4,11","M228,201s-1,11,1,13","M249,120s-1.25,27.75,2.88,40.38","M243,64s15,22,15,53",
"M199,24s58,30,36,98","M222,78a146.5,146.5,0,0,1,6,42","M222,108s0-27-1-29",
"M208,71s11.33,20.33,12.17,26.67","M209,112s5-16-11-44","M202,111s-1-19-7-29","M184,54c1,6,6,18,6,18","M181,20s-19,40-40,51",
"M153,25s3,13,0,21-10,15-10,15,3-7,1-18-5.33-14.83-5.33-14.83A26.09,26.09,0,0,1,137,42c-3,7-8,16-8,16",
"M123,63a74.93,74.93,0,0,1,2-16","M127,33s-6,14.67-7,17.83","M120,29a52.87,52.87,0,0,0-7,15c-2,7-5,17-7,18","M103,33s0,10,1,14","M105,54c-1,6-2,8-2,8","M102.38,30S93,36,91,47",
"M125,6S108,4,89,47","M99,49S96,77,62,99","M80.5,63.84S64,73,59,88","M83,16,70,26s0-5,2-7","M59,27.54S45,41,40,53,28,73,27,79s-7,29-7,29","M31,56S12,74,10,92","M63,49S45,73,46,96","M39,79s1,15,2,17",
"M31,90s-8,29-3,56.5","M109,74s-29,48-72,44","M80,106s29-17,33-24","M102,96s-9,16-16,20","M114.72,84S107,97,106,98","M133,63s-4,13-8,16","M117,88s-6,8-8,8","M12,94s-4,6,1,62","M34.83,201C35,201,35,212,32,213","M23,189s-3,13-4,15","M211,113s-4,27-9,31","M23,146v34"],
  /*drop shadow, beneath the base hair*/ "M239,182l3-20,1-37-17,29s-2-4-1-5,2-11,2-11V128l-2.28,13.2L224,144l-4-15-3,2-15,2-4-20a69.74,69.74,0,0,0-8-16,232.8,232.8,0,0,0-19-23c-5-5-10.46-13.54-14-10-1,1-7,12-7,12L139,89l-9,12-2,4-1-8-1-6-5,8-11,13-6,7-1-6L88,125l2-4.5,1.25-3.62L69,132l-13,6-10,3-6.87-.75L36,141l5-8,3-5,4-5H43l-2,9-7,11-1-1v18l-3,9-4,6-.62,4.25s-2.37,2-2.37,1.88S19,150,19,150l9-48L64,63c4-9,16-16,16-16,1,0,64-11,64-11l36,15s26,16,27,17,43,55,43,55v22Z", 0.91, 0.92, -4, 8),
  
];

// add buns to the hairstyle #4
hairstyles[4].extrasFill = "white";
hairstyles[4].extras = ["M40,113.59s-7-2-12-4-12.26-8-13.13-13,1.13-7,4.13-8,9,0,12,4,8,6,10,11S40,113.59,40,113.59Z", "M275,88.59s-10,5-13,10-5,9-3,11a9.59,9.59,0,0,0,9,2c3-1,13-8,15-10s2-5,2-7a6.22,6.22,0,0,0-4-6A10.56,10.56,0,0,0,275,88.59Z"];

let mainMenu     = new MainMenuView();
let clothesView  = new View("Clothes");
let capesColorSelector = clothesView.addState("Cape");
capesColorSelector.addChild(new ColorPicker(avatar.capeColor));

clothesView.addState("Shirt").addChild(new ColorPicker(avatar.shirtColor));
clothesView.addState("Pants").addChild(new ColorPicker(avatar.pantsColor));
clothesView.addState("Boots").addChild(new ColorPicker(avatar.bootsColor));
clothesView.addState("Hands").addChild(new ColorPicker(avatar.glovesColor));

let hairSelector = new View("Hair");
hairSelector.addState("Style").addChild(new HairPicker(avatar.hairStyle));
hairSelector.addState("Color").addChild(new ColorPicker(avatar.hairColor));

let skinSelector = new View("Skin");
skinSelector.addState("Color").addChild(new SkinPicker(avatar.skinColor));

let facialSelector = new View("Facial", "Facial Hair");
facialSelector.addState("Style").addChild(new FacialHairPicker(avatar.facialHairStyle));
facialSelector.addState("Color").addChild(new ColorPicker(avatar.facialHairColor));

let eyewearSelector = new View("Eyewear");
eyewearSelector.addState("Style").addChild(new EyewearPicker(avatar.eyewearStyle));
eyewearSelector.addState("Color").addChild(new ColorPicker(avatar.eyewearColor));

let makeupSelector = new View("Makeup");
makeupSelector.addState("Style").addChild(new MakeupPicker(avatar.makeupStyle));
makeupSelector.addState("Color").addChild(new ColorPicker(avatar.makeupColor));

let viewSelector = new ViewSelector([mainMenu, hairSelector, clothesView, skinSelector, facialSelector, eyewearSelector, makeupSelector]);
viewSelector.currentView = mainMenu;

setup(".le-canvas", draw, update, resize);

// ------------- functions
function lerp(v1,v2,a) {
  return v1 + (v2-v1) * a;
}

function drawBackground() {  
  const v = canvas.height/1.5;
  const x = canvas.width/2 - v;
  const y = canvas.height/2 - v;  
  ctx.save();  
  ctx.translate(x, y);
  var grd=ctx.createRadialGradient(v,v,v,v,v, 0);
  grd.addColorStop(0,"rgba(0,88,255,0)");
  grd.addColorStop(0.9,"rgb(87, 188, 208)");
  grd.addColorStop(1,"rgb(91, 194, 211)");  
  ctx.fillStyle=grd;
  ctx.fillRect(0,0,v*2,v*2);
  ctx.restore();
}

function drawTallText(text, x, y, size, rightToLeft, centerText) {
  rightToLeft = rightToLeft||false;  
  ctx.save();  
  ctx.font = size+"pt Electrolize";
  if (rightToLeft === true) {
    let size = ctx.measureText(text);
    x -= size.width;
  } else if (centerText === true) {
    let size = ctx.measureText(text);
    x -= size.width/2;
  }
  ctx.translate(x, y);
  ctx.scale(1, 2);
  
  ctx.beginPath();
  ctx.fillText(text, 0, 0);    
  ctx.restore();  
}

function draw() {
  clear();
  drawBackground();  
  viewSelector.draw();
  avatar.draw();
}

function update() {
  avatar.position.x = canvas.width/2-avatar.width/2;
  avatar.position.y = canvas.height/2-avatar.height/2;
  avatar.update();
  
  viewSelector.update();  
  if (viewSelector.currentView) {    
    let currentView = viewSelector.currentView;
    let state = currentView.states[currentView.currentState];    
    if (currentView.name === "Eyewear") {
      if (state.target === "Color") {
        avatar.eyewearColor = state.children[0].selectedColor;
      } else if (state.target === "Style") {
        avatar.eyewearStyle = state.children[0].selectedEyewear;
      }
    }
    else if (currentView.name === "Facial") {
      if (state.target === "Color") {
        avatar.facialHairColor = state.children[0].selectedColor;
      } else if (state.target === "Style") {
        avatar.facialHairStyle = state.children[0].selectedFacialHair;
      }
    }
    else if (currentView.name === "Makeup") {
      if (state.target === "Color") {
        avatar.makeupColor = state.children[0].selectedColor;
      } else if (state.target === "Style") {
        avatar.makeupStyle = state.children[0].selectedMakeup;
      }
    }
    else if (currentView.name === "Skin") {
      if (state.target === "Color") {
        avatar.skinColor = state.children[0].selectedSkin;
      }
    }
    else if (currentView.name === "Clothes") {
      if (state.target === "Cape") {
        avatar.capeColor = state.children[0].selectedColor; 
      } else if (state.target === "Hands") {
        avatar.glovesColor = state.children[0].selectedColor; 
      } else if (state.target === "Pants") {
        avatar.pantsColor = state.children[0].selectedColor; 
      } else if (state.target === "Boots") {
        avatar.bootsColor = state.children[0].selectedColor; 
      } else if (state.target === "Shirt") {
        avatar.shirtColor = state.children[0].selectedColor; 
      }
    } else if(currentView.name === "Hair") {    
      if (state.target === "Style") {
        // update hairstyle
        avatar.hairStyle = state.children[0].selectedHair;
      }
      else if (state.target === "Color") {
        avatar.hairColor = state.children[0].selectedColor; 
      }
    }    
  }
}

function resize() {
  canvas.width  = window.innerWidth-4;
  canvas.height = window.innerHeight-4;
}

window.addEventListener("touchmove", e => {
  e.preventDefault();
  const pos = getTouchPos(canvas, e);
  mouse.x = pos.x;
  mouse.y = pos.y;
  }, false);


window.addEventListener("touchstart", e => {
  e.preventDefault();
  const pos = getTouchPos(canvas, e);
  // alert("me bitchin")
  mouse.x = pos.x;
  mouse.y = pos.y;
  mouse.leftButton = true;
  }, false);

window.addEventListener("touchend", e => {
  e.preventDefault();
  // alert("its teh final countdown");
  mouse.leftButton = false;
  }, false);
(function(){
  const options = {
    glitchColors: ['#2b4539', '#61dca3', '#61b3dc'],
    glitchSpeed: 50,
    smooth: true
  };
  const canvases = [
    document.getElementById('glitch-left'),
    document.getElementById('glitch-right')
  ].filter(Boolean);

  canvases.forEach(startGlitch);

  function startGlitch(canvas){
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const charWidth = 10;
    const charHeight = 20;
    const fontSize = 16;
    const lettersAndSymbols = [
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
      '!','@','#','$','&','*','(',')','-','_','+','=','/',
      '[',']','{','}',';',':', '<','>', ',', '0','1','2','3','4','5','6','7','8','9'
    ];
    let letters = [];
    let columns = 0;
    let rows = 0;
    let lastGlitchTime = Date.now();

    function getRandomChar(){
      return lettersAndSymbols[Math.floor(Math.random()*lettersAndSymbols.length)];
    }
    function getRandomColor(){
      return options.glitchColors[Math.floor(Math.random()*options.glitchColors.length)];
    }
    function hexToRgb(hex){
      if(!hex) return null;
      if(hex.length === 4){
        hex = '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
      }
      const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return res ? {
        r: parseInt(res[1],16),
        g: parseInt(res[2],16),
        b: parseInt(res[3],16)
      } : null;
    }
    function interpolateColor(start,end,factor){
      const r = Math.round(start.r + (end.r - start.r)*factor);
      const g = Math.round(start.g + (end.g - start.g)*factor);
      const b = Math.round(start.b + (end.b - start.b)*factor);
      return `rgb(${r}, ${g}, ${b})`;
    }
    function calculateGrid(width,height){
      columns = Math.ceil(width/charWidth);
      rows = Math.ceil(height/charHeight);
    }
    function initializeLetters(){
      const total = columns * rows;
      letters = Array.from({length: total}, () => ({
        char: getRandomChar(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1
      }));
    }
    function resize(){
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      calculateGrid(rect.width, rect.height);
      initializeLetters();
      drawLetters();
    }
    function drawLetters(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.font = fontSize + 'px monospace';
      ctx.textBaseline = 'top';
      for(let i=0;i<letters.length;i++){
        const letter = letters[i];
        const x = (i % columns) * charWidth;
        const y = Math.floor(i / columns) * charHeight;
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char,x,y);
      }
    }
    function updateLetters(){
      const count = Math.max(1, Math.floor(letters.length * 0.05));
      for(let i=0;i<count;i++){
        const idx = Math.floor(Math.random()*letters.length);
        const letter = letters[idx];
        if(!letter) continue;
        letter.char = getRandomChar();
        letter.targetColor = getRandomColor();
        if(!options.smooth){
          letter.color = letter.targetColor;
          letter.colorProgress = 1;
        } else {
          letter.colorProgress = 0;
        }
      }
    }
    function handleSmooth(){
      let redraw = false;
      letters.forEach(letter => {
        if(letter.colorProgress < 1){
          letter.colorProgress += 0.05;
          if(letter.colorProgress > 1) letter.colorProgress = 1;
          const start = hexToRgb(letter.color);
          const end = hexToRgb(letter.targetColor);
          if(start && end){
            letter.color = interpolateColor(start,end,letter.colorProgress);
            redraw = true;
          }
        }
      });
      if(redraw) drawLetters();
    }
    function animate(){
      const now = Date.now();
      if(now - lastGlitchTime >= options.glitchSpeed){
        updateLetters();
        drawLetters();
        lastGlitchTime = now;
      }
      if(options.smooth) handleSmooth();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
  }
})();

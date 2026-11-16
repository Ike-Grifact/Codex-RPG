const { chromium } = require('playwright');
const assert = (test, msg) => {if(!test)throw new Error(msg)};
const cam = async map => map.evaluate(root=>{
 const text=root.querySelector('.fp-gene-viewport').getAttribute('transform');
 const m=/translate\(([-.\d]+) ([-.\d]+)\) scale\(([-.\d]+)\)/.exec(text);
 if(!m)throw new Error('Transform inválido: '+text);
 return {x:Number(m[1]),y:Number(m[2]),zoom:Number(m[3])};
});
const pointInSvg=async(map,x,y)=>map.evaluate((root,coord)=>{
 const svg=root.querySelector('svg'),point=svg.createSVGPoint();
 point.x=coord.x;point.y=coord.y;
 const out=point.matrixTransform(svg.getScreenCTM().inverse());
 return {x:out.x,y:out.y};
},{x,y});
const checkGeneSpacing=async(map,phase)=>map.evaluate(root=>{
 const svg=root.querySelector(".fp-gene-overview"),vb=svg.viewBox.baseVal;
 // A janela de zoom usa viewBox reduzido; o plano virtual inteiro fica no rect de fundo.
 const canvasHeight=Number(svg.querySelector(":scope > rect")?.getAttribute("height"))||vb.height;
 const nodes=[...root.querySelectorAll(".fp-gene-skill,.fp-gene-card")].map(node=>{
  const b=node.getBBox();
  return {id:node.getAttribute("data-gene-id"),skill:node.classList.contains("fp-gene-skill"),
   x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height};
 });
 const collisions=[],outside=[];
 for(let i=0;i<nodes.length;i++){
  const a=nodes[i];
  if(a.x<-.5||a.right>vb.width+.5||a.y<-.5||a.bottom>canvasHeight+.5)outside.push(a.id);
  for(let j=i+1;j<nodes.length;j++){
   const b=nodes[j];
   if(!(a.skill||b.skill))continue;
   const xx=Math.min(a.right,b.right)-Math.max(a.x,b.x);
   const yy=Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y);
   if(xx>2&&yy>2)collisions.push(a.id+" × "+b.id);
  }
 }
 const skills=nodes.filter(x=>x.skill);
 const families=[...root.querySelectorAll(".fp-gene-constellation")].map(n=>n.getAttribute("data-gene-family"));
 const placements=Object.fromEntries([...root.querySelectorAll(".fp-gene-skill")].map(n=>
  [n.getAttribute("data-gene-id"),n.getAttribute("data-gene-family")]));
 return {skills:skills.length,collisions:collisions.slice(0,10),outside,families,placements,
  furthest:Math.max(0,...skills.map(x=>x.bottom)),width:vb.width,height:canvasHeight};
}).then(result=>{
 assert(result.skills>0,phase+": nenhum nó de Perícia visível");
 assert(!result.collisions.length,phase+": Perícias sobrepostas "+result.collisions.join(", "));
 assert(!result.outside.length,phase+": Perícias fora do SVG "+result.outside.join(", "));
 return result;
});
const create=async page=>{
 await page.goto('http://127.0.0.1:8000/prototipo-ficha/',{waitUntil:'domcontentloaded'});
 await page.locator('[data-wizard-field="name"]').fill('Navegador do Codex');
 await page.locator('#wizard-controls [data-action="wizard-next"]').click();
 await page.locator('[data-action="wizard-starter-attr"][data-key="forca"]').click();
 await page.locator('[data-action="wizard-starter-training"][data-group="practice"][data-key="atletismo"]').click();
 await page.locator('#wizard-controls [data-action="wizard-next"]').click();
 await page.locator('#wizard-content [data-action="wizard-mode"][data-mode="genetic"]').click();
 await page.waitForSelector('#gene-builder-map .fp-gene-nav-float');
};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const desktop=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  desktop.on('pageerror',e=>errors.push(e.message));
  await create(desktop);
  const map=desktop.locator('#gene-builder-map');
  // Não reservar lacunas para Perícias bloqueadas, nem sobrepor nós.
  const normal=await checkGeneSpacing(map,"Caminhos atuais");
  if(normal.skills<=18)assert(normal.furthest<1850,"Constelações visíveis excessivamente distantes: "+JSON.stringify(normal));
  await desktop.locator('#wizard-content [data-action="gene-future"]').click();
  const all=await checkGeneSpacing(map,"Ramificações futuras");
  assert(all.skills>=normal.skills,"Alternar ramificações futuras reduziu os nós");
  assert(all.families.length>=10,"Constelações temáticas ausentes: "+JSON.stringify(all.families));
  const expected={terra:"elementos","pericia-druidica":"natureza",
   "domar-criatura-grande":"natureza","disparo-tatico":"disparos",
   "criar-antidoto":"alquimia","furtividade-avancada":"furtividade"};
  for(const [id,family] of Object.entries(expected))
   assert(all.placements[id]===family,"Constelação incorreta: "+id+" -> "+all.placements[id]);
  await desktop.locator('#wizard-content [data-action="gene-future"]').click();
  await checkGeneSpacing(map,"Caminhos restaurados");
  await map.scrollIntoViewIfNeeded();
  const box=await map.boundingBox();
  assert(box&&box.height>=450&&box.height<=730,'Mapa não é uma janela fixa: '+JSON.stringify(box));
  const x=box.x+box.width*.33,y=box.y+box.height*.42;
  const p=await pointInSvg(map,x,y),a=await cam(map);
  await desktop.mouse.move(x,y);await desktop.mouse.wheel(0,-245);
  const b=await cam(map),q=await pointInSvg(map,x,y);
  assert(b.zoom>a.zoom,'Roda do mouse não aproxima');
  assert(Math.hypot((p.x-a.x)/a.zoom-(q.x-b.x)/b.zoom,
       (p.y-a.y)/a.zoom-(q.y-b.y)/b.zoom)<1,
       'Zoom não mantém o ponto do cursor: '+JSON.stringify({a,b,p,q}));
  // Voltar à vista inicial antes de pegar o nó: o zoom anterior pode levá-lo para fora da janela.
  await desktop.locator('#gene-builder-map [data-gene-nav="0"]').click();
  const attr=desktop.locator('#gene-builder-map .fp-gene-card[data-gene-id="attr:forca"]');
  const attrBox=await attr.boundingBox();
  assert(attrBox,'Nó Força não está visível para arraste');
  const before=await cam(map);
  await desktop.mouse.move(attrBox.x+attrBox.width*.45,attrBox.y+attrBox.height*.50);
  await desktop.mouse.down();
  await desktop.mouse.move(attrBox.x+attrBox.width*.45+95,attrBox.y+attrBox.height*.50+66,{steps:8});
  await desktop.mouse.up();
  const after=await cam(map);
  assert(Math.hypot(after.x-before.x,after.y-before.y)>80,
     'Arrastar em cima de um nó não deslocou o grafo');
  assert(await desktop.locator('#gene-builder-detail').isHidden(),
     'O arraste selecionou Perícia indevidamente');
  assert((await desktop.locator('#wizard-summary').innerText()).includes('17 XP'),
     'O arraste alterou os investimentos');
  await desktop.locator('#gene-builder-map [data-gene-nav="0"]').click();
  assert(Math.abs((await cam(map)).zoom-1)<.001,'Centralizar não recuperou zoom inicial no desktop');
  await desktop.locator('#gene-builder-map [data-gene-nav="1"]').click();
  assert((await cam(map)).zoom>1,'Botão flutuante + não aplicou zoom');
  await desktop.locator('#gene-builder-map [data-gene-nav="-1"]').click();
  assert(Math.abs((await cam(map)).zoom-1)<.01,'Botão flutuante − não reduziu zoom');
  await map.focus();
  await desktop.keyboard.press('ArrowRight');
  assert((await cam(map)).x<0,'Tecla de direção não moveu o mapa');
  assert(!errors.length,'Erros Javascript no desktop: '+errors.join(' | '));
  console.log('PASS Desktop: zoom ancorado no mouse, arraste sobre nó, botões e teclado');

  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobile=await ctx.newPage(),merrors=[];
  mobile.on('pageerror',e=>merrors.push(e.message));
  await create(mobile);
  const m=mobile.locator('#gene-builder-map');
  await checkGeneSpacing(m,"Layout móvel");
  await m.scrollIntoViewIfNeeded();
  const rect=await m.boundingBox();
  assert(rect&&rect.width<=390&&rect.height>=390&&rect.height<600,
    'Mapa móvel excede viewport: '+JSON.stringify(rect));
  assert(await m.evaluate(el=>getComputedStyle(el).touchAction)==='none',
    'Touch-action não suporta gesto móvel personalizado');
  const first=await cam(m);
  assert(first.zoom>=1.8,'Zoom móvel inicial não é legível: '+first.zoom);
  const centerX=rect.x+rect.width/2,centerY=rect.y+rect.height/2;
  const session=await ctx.newCDPSession(mobile);
  const pt=(id,x,y)=>({id,x,y,radiusX:2,radiusY:2,force:1});
  const send=async(type,points)=>session.send('Input.dispatchTouchEvent',{type,touchPoints:points});
  const scrollBefore=await mobile.evaluate(()=>scrollY);
  await send('touchStart',[pt(1,centerX-35,centerY),pt(2,centerX+35,centerY)]);
  for(let i=1;i<=5;i++)await send('touchMove',[
   pt(1,centerX-35-i*13,centerY-i*2),pt(2,centerX+35+i*13,centerY+i*2)
  ]);
  await send('touchEnd',[]);
  const pinched=await cam(m);
  assert(pinched.zoom>first.zoom+.3,
    'Pinça de dois dedos não ampliou mapa: '+JSON.stringify({first,pinched}));
  const scrollAfter=await mobile.evaluate(()=>scrollY);
  assert(Math.abs(scrollBefore-scrollAfter)<4,
    'Pinça rolou a página em vez do mapa');
  const beforePan=await cam(m);
  await send('touchStart',[pt(3,centerX,centerY)]);
  for(let i=1;i<=5;i++)await send('touchMove',[pt(3,centerX-8*i,centerY+15*i)]);
  await send('touchEnd',[]);
  const afterPan=await cam(m);
  assert(Math.hypot(afterPan.x-beforePan.x,afterPan.y-beforePan.y)>70,
    'Arrastar com um dedo não deslocou o grafo');
  await mobile.evaluate(()=>{
    window.__geneTapTrace=[];
    const btn=document.querySelector('#gene-builder-map [data-gene-nav="0"]');
    for(const kind of ['pointerdown','pointerup','touchstart','touchend','click'])
      btn.addEventListener(kind,()=>window.__geneTapTrace.push(kind),true);
  });
  await mobile.locator('#gene-builder-map [data-gene-nav="0"]').tap();
  const resetMobile=await cam(m);
  const tapTrace=await mobile.evaluate(()=>window.__geneTapTrace);
  assert(Math.abs(resetMobile.zoom-2.25)<.01,
    'Centralizar não restaurou zoom móvel adequado: '+JSON.stringify({resetMobile,tapTrace}));
  assert(!merrors.length,'Erros Javascript no celular: '+merrors.join(' | '));
  console.log('PASS Mobile: pinça, um dedo arrasta, botões e zoom inicial legível');
  await ctx.close();
 } finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});

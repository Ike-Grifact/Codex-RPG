const {chromium}=require("playwright");
const check=(ok,message)=>{if(!ok)throw Error(message)};
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  for(const [screen,width,height] of [["desktop",1365,900],["celular",390,844]]){
   const context=await browser.newContext({viewport:{width,height}});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",error=>errors.push(String(error)));
   await page.goto("http://127.0.0.1:8000/prototipo-ficha/",{waitUntil:"domcontentloaded"});
   await page.evaluate(()=>{
    const items=[
      {id:"armor-ml",name:"Roupas Simples",type:"armadura",weight:"muito_leve",grade:1,qty:1,max:0,hp:0,equipped:false},
      {id:"armor-l",name:"Armadura Leve",type:"armadura",weight:"leve",grade:1,qty:1,max:10,hp:10,equipped:false},
      {id:"armor-m",name:"Armadura Média",type:"armadura",weight:"medio",grade:1,qty:1,max:15,hp:15,equipped:false},
      {id:"armor-h",name:"Armadura Pesada",type:"armadura",weight:"alto",grade:1,qty:1,max:20,hp:20,equipped:false}
    ];
    localStorage.setItem("codex-html-ficha-prototipo-v1",JSON.stringify({
     name:"Teste de Esquiva",level:1,creationLocked:true,
     attributes:{forca:1,agilidade:2,destreza:2,vigor:2},practices:{armas_conjuracao:1},
     items
    }));
   });
   await page.reload({waitUntil:"domcontentloaded"});
   const general=page.locator("#de-text"),dodge=page.locator("#de-dodge-text"),caption=page.locator("#de-dodge-caption");
   const expect=async(g,d,description)=>{
    check(await general.innerText()===String(g),screen+": DE geral incorreta ("+description+"): "+await general.innerText());
    check(await dodge.innerText()===String(d),screen+": DE Esquiva incorreta ("+description+"): "+await dodge.innerText());
   };
   await expect(4,4,"sem armadura");
   await page.locator('#sheet-navigation [data-sheet-page="inventory"]').click();
   const toggle=async id=>{
    const btn=page.locator('#inventory-list [data-action="equip"][data-id="'+id+'"]');
    check(await btn.count()===1,"Não encontrou botão Equipar "+id);
    await btn.click();
   };
   await toggle("armor-ml");await expect(4,6,"Muito Leve");
   check((await caption.innerText()).includes("+2"),screen+": não indicou bônus +2 em Esquiva");
   await page.reload({waitUntil:"domcontentloaded"});
   await expect(4,6,"Muito Leve persiste após recarregar");
   await page.locator('#sheet-navigation [data-sheet-page="inventory"]').click();
   await toggle("armor-l");await expect(4,5,"Leve");
   check((await caption.innerText()).includes("+1"),screen+": não indicou bônus +1");
   await toggle("armor-m");await expect(4,4,"Média");
   await toggle("armor-h");await expect(3,3,"Pesada");
   await toggle("armor-h");await expect(4,4,"desequipada");
   await toggle("armor-ml");await expect(4,6,"Muito Leve novamente");
   await page.locator('#inventory-list [data-item-field="weight"][data-id="armor-ml"]').selectOption("leve");
   await expect(4,5,"mudou categoria da armadura equipada");
   await page.locator('#inventory-list [data-item-field="weight"][data-id="armor-ml"]').selectOption("muito_leve");
   await expect(4,6,"voltou para Muito Leve");
   check(errors.length===0,screen+": erros JS: "+errors.join(" | "));
   console.log("PASS "+screen+": DE geral vs Esquiva, Muito Leve +2, Leve +1, Média, Pesada, desequipar, reload e trocar peso");
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});

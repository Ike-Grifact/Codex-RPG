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
   const value=page.locator("#de-text"),formula=page.locator("#de-caption"),condition=page.locator("#de-condition"),integrity=page.locator("#de-armor-panel");
   check(await page.locator("#de-dodge-text").count()===0,"Indicador de DE duplicado ainda existe");
   const expect=async(natural,final,description)=>{
    check(await value.innerText()===String(final),screen+": DE final incorreta ("+description+"): "+await value.innerText());
    const txt=await formula.innerText();
    check(txt.includes("Natural "+natural)&&txt.includes(" = "+final),
     screen+": cálculo incompleto ("+description+"): "+txt);
   };
   await expect(4,4,"sem armadura");
   check(await integrity.isHidden(),"Integridade de armadura ausente deve ficar oculta");
   await page.locator('#sheet-navigation [data-sheet-page="inventory"]').click();
   const toggle=async id=>{
    const btn=page.locator('#inventory-list [data-action="equip"][data-id="'+id+'"]');
    check(await btn.count()===1,"Não encontrou botão Equipar "+id);
    await btn.click();
   };
   await toggle("armor-ml");await expect(4,6,"Muito Leve");
   check((await formula.innerText()).includes("+ 2 (Muito Leve)"),"Falta origem do modificador Muito Leve");
   check((await condition.innerText()).includes("ao esquivar"),"Falta condição de Esquiva");
   check((await integrity.innerText()).includes("Sem Integridade"),"Muito Leve não informa ausência de Integridade");
   await page.reload({waitUntil:"domcontentloaded"});
   await expect(4,6,"Muito Leve persiste após recarregar");
   await page.locator('#sheet-navigation [data-sheet-page="inventory"]').click();
   await toggle("armor-l");await expect(4,5,"Leve");
   check((await formula.innerText()).includes("+ 1 (Leve)"),"Falta origem do modificador Leve");
   check((await integrity.innerText()).includes("10 / 10"),"Integridade Leve não aparece no mesmo cartão da DE");
   await integrity.locator('[data-action="integrity"][data-delta="-1"]').click();
   check((await integrity.innerText()).includes("9 / 10"),"Botão no cartão não reduz Integridade");
   check((await page.locator("#inventory-list").innerText()).includes("9/10"),"Inventário não sincronizado com cartão");
   await toggle("armor-m");await expect(4,4,"Média");
   await toggle("armor-h");await expect(4,3,"Pesada");
   await toggle("armor-h");await expect(4,4,"desequipada");
   check(await integrity.isHidden(),"Armadura desequipada deixou Integridade visível");
   await toggle("armor-ml");await expect(4,6,"Muito Leve novamente");
   await page.locator('#inventory-list [data-item-field="weight"][data-id="armor-ml"]').selectOption("leve");
   await expect(4,5,"mudou categoria da armadura equipada");
   await page.locator('#inventory-list [data-item-field="weight"][data-id="armor-ml"]').selectOption("muito_leve");
   await expect(4,6,"voltou para Muito Leve");
   // Armas leves cadastradas manualmente podem ter Integridade 0/0:
   // não preencher máximo experimental automaticamente; oferecer atalho para ajuste.
   await page.evaluate(()=>{
    const key="codex-html-ficha-prototipo-v1",data=JSON.parse(localStorage.getItem(key));
    const ml=data.items.find(x=>x.id==="armor-ml"),light=data.items.find(x=>x.id==="armor-l");
    ml.equipped=false;light.equipped=true;light.max=0;light.hp=0;
    localStorage.setItem(key,JSON.stringify(data));
   });
   await page.reload({waitUntil:"domcontentloaded"});
   await expect(4,5,"Leve sem máximo de Integridade configurado");
   check((await integrity.innerText()).includes("0 / 0")&&
    (await integrity.innerText()).includes("Integridade máxima não definida"),
    screen+": equipamento 0/0 não é explicado no cartão defensivo");
   const settings=integrity.locator('[data-sheet-page="inventory"]');
   check(await settings.isVisible(),screen+": atalho para configurar integridade ausente");
   await settings.click();
   check(await page.locator("#inventory-list").isVisible(),
    screen+": atalho não abriu o Inventário");
   check(errors.length===0,screen+": erros JS: "+errors.join(" | "));
   console.log("PASS "+screen+": DE geral vs Esquiva, Muito Leve +2, Leve +1, Média, Pesada, desequipar, reload e trocar peso");
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});

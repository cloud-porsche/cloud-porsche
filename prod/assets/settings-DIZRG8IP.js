import{_ as Ne}from"./ProTier-C1NKFxdl.js";import{a6 as G,a7 as ce,by as ze,aa as N,aM as me,bz as Oe,ad as z,l as a,p as ve,v as Fe,bA as je,aJ as xe,a8 as qe,aF as He,bl as pe,ac as Xe,h as T,aH as Ke,aD as Ee,X as ee,bb as Ye,aE as Qe,ba as Je,a9 as fe,aG as Ze,bg as ea,bk as aa,bf as ta,aO as la,bB as na,bC as oa,aR as sa,bD as ia,aU as Ae,bd as k,aL as De,bE as da,bh as ra,r as w,s as $,S as X,ay as j,aA as ua,bF as ca,bG as ma,ar as _e,bH as va,bI as pa,bJ as fa,b7 as ga,bK as ba,d as xa,ae as ya,f as ye,bL as Va,aW as ka,o as C,k as q,w as o,m as Pa,u as i,Q as _,c as B,ak as wa,M as Q,a as Sa,bM as H,_ as ie,F as V,t as M,V as Ca,b as R,x as Ve,bN as Ta,L as J,bO as de,bP as ke,q as ha,I as Ma,K as Z,T as Ia,O as Pe,D as we,E as Se,G as Ce,N as Te,bQ as Ua,bR as Ea,bS as Aa,a0 as Da}from"./index-CY7nOk5p.js";import{m as _a,V as he,a as Ba,b as Me}from"./VWindowItem-C4Rw-CbG.js";import{m as Ra,b as Ie}from"./VChip-PKdmnwD0.js";import{V as Ue}from"./VSelect-DnwuabJ-.js";import{V as $a}from"./VDataTable-DUDUTxIE.js";import"./VPagination-CrSuduao.js";const K=Symbol.for("vuetify:v-expansion-panel"),Be=G({...ce(),...ze()},"VExpansionPanelText"),re=N()({name:"VExpansionPanelText",props:Be(),setup(e,m){let{slots:n}=m;const t=me(K);if(!t)throw new Error("[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel");const{hasContent:f,onAfterLeave:p}=Oe(e,t.isSelected);return z(()=>a(je,{onAfterLeave:p},{default:()=>{var d;return[ve(a("div",{class:["v-expansion-panel-text",e.class],style:e.style},[n.default&&f.value&&a("div",{class:"v-expansion-panel-text__wrapper"},[(d=n.default)==null?void 0:d.call(n)])]),[[Fe,t.isSelected.value]])]}})),{}}}),Re=G({color:String,expandIcon:{type:xe,default:"$expand"},collapseIcon:{type:xe,default:"$collapse"},hideActions:Boolean,focusable:Boolean,static:Boolean,ripple:{type:[Boolean,Object],default:!1},readonly:Boolean,...ce(),...qe()},"VExpansionPanelTitle"),ue=N()({name:"VExpansionPanelTitle",directives:{Ripple:He},props:Re(),setup(e,m){let{slots:n}=m;const t=me(K);if(!t)throw new Error("[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel");const{backgroundColorClasses:f,backgroundColorStyles:p}=pe(e,"color"),{dimensionStyles:d}=Xe(e),v=T(()=>({collapseIcon:e.collapseIcon,disabled:t.disabled.value,expanded:t.isSelected.value,expandIcon:e.expandIcon,readonly:e.readonly})),g=T(()=>t.isSelected.value?e.collapseIcon:e.expandIcon);return z(()=>{var b;return ve(a("button",{class:["v-expansion-panel-title",{"v-expansion-panel-title--active":t.isSelected.value,"v-expansion-panel-title--focusable":e.focusable,"v-expansion-panel-title--static":e.static},f.value,e.class],style:[p.value,d.value,e.style],type:"button",tabindex:t.disabled.value?-1:void 0,disabled:t.disabled.value,"aria-expanded":t.isSelected.value,onClick:e.readonly?void 0:t.toggle},[a("span",{class:"v-expansion-panel-title__overlay"},null),(b=n.default)==null?void 0:b.call(n,v.value),!e.hideActions&&a(Ee,{defaults:{VIcon:{icon:g.value}}},{default:()=>{var I;return[a("span",{class:"v-expansion-panel-title__icon"},[((I=n.actions)==null?void 0:I.call(n,v.value))??a(ee,null,null)])]}})]),[[Ke("ripple"),e.ripple]])}),{}}}),$e=G({title:String,text:String,bgColor:String,...Ye(),...Qe(),...Je(),...fe(),...Re(),...Be()},"VExpansionPanel"),La=N()({name:"VExpansionPanel",props:$e(),emits:{"group:selected":e=>!0},setup(e,m){let{slots:n}=m;const t=Ze(e,K),{backgroundColorClasses:f,backgroundColorStyles:p}=pe(e,"bgColor"),{elevationClasses:d}=ea(e),{roundedClasses:v}=aa(e),g=T(()=>(t==null?void 0:t.disabled.value)||e.disabled),b=T(()=>t.group.items.value.reduce((u,r,y)=>(t.group.selected.value.includes(r.id)&&u.push(y),u),[])),I=T(()=>{const u=t.group.items.value.findIndex(r=>r.id===t.id);return!t.isSelected.value&&b.value.some(r=>r-u===1)}),x=T(()=>{const u=t.group.items.value.findIndex(r=>r.id===t.id);return!t.isSelected.value&&b.value.some(r=>r-u===-1)});return ta(K,t),z(()=>{const u=!!(n.text||e.text),r=!!(n.title||e.title),y=ue.filterProps(e),S=re.filterProps(e);return a(e.tag,{class:["v-expansion-panel",{"v-expansion-panel--active":t.isSelected.value,"v-expansion-panel--before-active":I.value,"v-expansion-panel--after-active":x.value,"v-expansion-panel--disabled":g.value},v.value,f.value,e.class],style:[p.value,e.style]},{default:()=>[a("div",{class:["v-expansion-panel__shadow",...d.value]},null),a(Ee,{defaults:{VExpansionPanelTitle:{...y},VExpansionPanelText:{...S}}},{default:()=>{var h;return[r&&a(ue,{key:"title"},{default:()=>[n.title?n.title():e.title]}),u&&a(re,{key:"text"},{default:()=>[n.text?n.text():e.text]}),(h=n.default)==null?void 0:h.call(n)]}})]})}),{groupItem:t}}}),Wa=["default","accordion","inset","popout"],Ga=G({flat:Boolean,...la(),...na($e(),["bgColor","collapseIcon","color","eager","elevation","expandIcon","focusable","hideActions","readonly","ripple","rounded","tile","static"]),...oa(),...ce(),...fe(),variant:{type:String,default:"default",validator:e=>Wa.includes(e)}},"VExpansionPanels"),Na=N()({name:"VExpansionPanels",props:Ga(),emits:{"update:modelValue":e=>!0},setup(e,m){let{slots:n}=m;const{next:t,prev:f}=sa(e,K),{themeClasses:p}=ia(e),d=T(()=>e.variant&&`v-expansion-panels--variant-${e.variant}`);return Ae({VExpansionPanel:{bgColor:k(e,"bgColor"),collapseIcon:k(e,"collapseIcon"),color:k(e,"color"),eager:k(e,"eager"),elevation:k(e,"elevation"),expandIcon:k(e,"expandIcon"),focusable:k(e,"focusable"),hideActions:k(e,"hideActions"),readonly:k(e,"readonly"),ripple:k(e,"ripple"),rounded:k(e,"rounded"),static:k(e,"static")}}),z(()=>a(e.tag,{class:["v-expansion-panels",{"v-expansion-panels--flat":e.flat,"v-expansion-panels--tile":e.tile},p.value,d.value,e.class],style:e.style},{default:()=>{var v;return[(v=n.default)==null?void 0:v.call(n,{prev:f,next:t})]}})),{next:t,prev:f}}}),ge=Symbol.for("vuetify:v-tabs"),za=G({fixed:Boolean,sliderColor:String,hideSlider:Boolean,direction:{type:String,default:"horizontal"},...De(da({selectedClass:"v-tab--selected",variant:"text"}),["active","block","flat","location","position","symbol"])},"VTab"),Le=N()({name:"VTab",props:za(),setup(e,m){let{slots:n,attrs:t}=m;const{textColorClasses:f,textColorStyles:p}=ra(e,"sliderColor"),d=w(),v=w(),g=T(()=>e.direction==="horizontal"),b=T(()=>{var x,u;return((u=(x=d.value)==null?void 0:x.group)==null?void 0:u.isSelected.value)??!1});function I(x){var r,y;let{value:u}=x;if(u){const S=(y=(r=d.value)==null?void 0:r.$el.parentElement)==null?void 0:y.querySelector(".v-tab--selected .v-tab__slider"),h=v.value;if(!S||!h)return;const O=getComputedStyle(S).color,U=S.getBoundingClientRect(),E=h.getBoundingClientRect(),A=g.value?"x":"y",F=g.value?"X":"Y",Y=g.value?"right":"bottom",D=g.value?"width":"height",L=U[A],ae=E[A],W=L>ae?U[Y]-E[Y]:U[A]-E[A],te=Math.sign(W)>0?g.value?"right":"bottom":Math.sign(W)<0?g.value?"left":"top":"center",le=(Math.abs(W)+(Math.sign(W)<0?U[D]:E[D]))/Math.max(U[D],E[D])||0,c=U[D]/E[D]||0,l=1.5;ca(h,{backgroundColor:[O,"currentcolor"],transform:[`translate${F}(${W}px) scale${F}(${c})`,`translate${F}(${W/l}px) scale${F}(${(le-1)/l+1})`,"none"],transformOrigin:Array(3).fill(te)},{duration:225,easing:ma})}}return z(()=>{const x=$.filterProps(e);return a($,j({symbol:ge,ref:d,class:["v-tab",e.class],style:e.style,tabindex:b.value?0:-1,role:"tab","aria-selected":String(b.value),active:!1},x,t,{block:e.fixed,maxWidth:e.fixed?300:void 0,"onGroup:selected":I}),{...n,default:()=>{var u;return a(X,null,[((u=n.default)==null?void 0:u.call(n))??e.text,!e.hideSlider&&a("div",{ref:v,class:["v-tab__slider",f.value],style:p.value},null)])}})}),ua({},d)}}),Oa=G({...De(_a(),["continuous","nextIcon","prevIcon","showArrows","touch","mandatory"])},"VTabsWindow"),We=N()({name:"VTabsWindow",props:Oa(),emits:{"update:modelValue":e=>!0},setup(e,m){let{slots:n}=m;const t=me(ge,null),f=_e(e,"modelValue"),p=T({get(){var d;return f.value!=null||!t?f.value:(d=t.items.value.find(v=>t.selected.value.includes(v.id)))==null?void 0:d.value},set(d){f.value=d}});return z(()=>{const d=he.filterProps(e);return a(he,j({_as:"VTabsWindow"},d,{modelValue:p.value,"onUpdate:modelValue":v=>p.value=v,class:["v-tabs-window",e.class],style:e.style,mandatory:!1,touch:!1}),n)}),{}}}),Fa=G({...Ba()},"VTabsWindowItem"),Ge=N()({name:"VTabsWindowItem",props:Fa(),setup(e,m){let{slots:n}=m;return z(()=>{const t=Me.filterProps(e);return a(Me,j({_as:"VTabsWindowItem"},t,{class:["v-tabs-window-item",e.class],style:e.style}),n)}),{}}});function ja(e){return e?e.map(m=>ba(m)?m:{text:m,value:m}):[]}const qa=G({alignTabs:{type:String,default:"start"},color:String,fixedTabs:Boolean,items:{type:Array,default:()=>[]},stacked:Boolean,bgColor:String,grow:Boolean,height:{type:[Number,String],default:void 0},hideSlider:Boolean,sliderColor:String,...Ra({mandatory:"force",selectedClass:"v-tab-item--selected"}),...va(),...fe()},"VTabs"),Ha=N()({name:"VTabs",props:qa(),emits:{"update:modelValue":e=>!0},setup(e,m){let{attrs:n,slots:t}=m;const f=_e(e,"modelValue"),p=T(()=>ja(e.items)),{densityClasses:d}=pa(e),{backgroundColorClasses:v,backgroundColorStyles:g}=pe(k(e,"bgColor")),{scopeId:b}=fa();return Ae({VTab:{color:k(e,"color"),direction:k(e,"direction"),stacked:k(e,"stacked"),fixed:k(e,"fixedTabs"),sliderColor:k(e,"sliderColor"),hideSlider:k(e,"hideSlider")}}),z(()=>{const I=Ie.filterProps(e),x=!!(t.window||e.items.length>0);return a(X,null,[a(Ie,j(I,{modelValue:f.value,"onUpdate:modelValue":u=>f.value=u,class:["v-tabs",`v-tabs--${e.direction}`,`v-tabs--align-tabs-${e.alignTabs}`,{"v-tabs--fixed-tabs":e.fixedTabs,"v-tabs--grow":e.grow,"v-tabs--stacked":e.stacked},d.value,v.value,e.class],style:[{"--v-tabs-height":ga(e.height)},g.value,e.style],role:"tablist",symbol:ge},b,n),{default:()=>{var u;return[((u=t.default)==null?void 0:u.call(t))??p.value.map(r=>{var y;return((y=t.tab)==null?void 0:y.call(t,{item:r}))??a(Le,j(r,{key:r.text,value:r.value}),{default:t[`tab.${r.value}`]?()=>{var S;return(S=t[`tab.${r.value}`])==null?void 0:S.call(t,{item:r})}:void 0})})]}}),x&&a(We,j({modelValue:f.value,"onUpdate:modelValue":u=>f.value=u,key:"tabs-window"},b),{default:()=>{var u;return[p.value.map(r=>{var y;return((y=t.item)==null?void 0:y.call(t,{item:r}))??a(Ge,{value:r.value},{default:()=>{var S;return(S=t[`item.${r.value}`])==null?void 0:S.call(t,{item:r})}})}),(u=t.window)==null?void 0:u.call(t)]}})])}),{}}}),Xa={class:"pb-4"},Ka={class:"d-flex justify-space-between pb-10"},Ya={class:"d-flex justify-end"},Qa={key:0,class:"pl-4"},Ja={class:"headline"},st=xa({__name:"settings",setup(e){const m=ya(),n=ye(),t=Va(),f=ka(),p=T(()=>Sa.currentRoute.value.params.tenantId),d=w(!1),v=w(!1),g=w(""),b=w("user"),I=w(""),x=w(""),u=w(""),r=w(""),y=w(""),S=w(""),h=w(""),O=w(void 0),U=w(!1),E=w(void 0),A=w(void 0),F=async()=>{var c;if(m){A.value=void 0,U.value=!0,setTimeout(()=>{U.value&&(E.value="Migration is taking longer than expected. Please be patient.")},15e3),O.value=void 0;try{const l=await((c=m.currentUser)==null?void 0:c.getIdToken());if(!l){console.error("Currently not logged in!");return}const ne=Ua({projectId:"cloud-porsche",apiKey:"AIzaSyBMKjAnTXRxswz9NFQlDRXMieSyBDLZepk",authDomain:"cloud-porsche.firebaseapp.com"},"temp"),P=Ea(ne);["free","free-tier"].includes(y.value)||(P.tenantId=y.value);const oe=await(await Aa(P,S.value,h.value)).user.getIdToken(),se=new Headers;se.set("authorization-old",oe),se.set("authorization-new",l),await Da(`/v1/tenants/${y.value}/migrate/${p.value}`,void 0,{headers:se},"tenantManagement"),A.value="Migration successful!",await f.fetchProperties()}catch(l){O.value="Migration failed: "+l}finally{E.value=void 0,U.value=!1}}},Y=[{title:"Email",key:"email"},{title:"UID",key:"uid"},{title:"Current Role",key:"role"},{title:"Actions",key:"action",sortable:!1,maxWidth:"100px"}],D=T(()=>[{title:"General",text:"General settings for the Cloud Porsche application.",selections:[{title:"Material Design",advanced:!1,text:"You can choose between the 3 Material Design variants of Googles Material Design.",chips:!0,options:[H.NONE,H.MD1,H.MD2,H.MD3],initial:localStorage.getItem("material")??H.NONE,valueChange:c=>{localStorage.setItem("material",c),window.location.reload()}}],migration:!["free-tier","free"].includes(p.value)&&n.hasAdminAccess},{title:"User Management",text:"Manage users for the current tenant."},{title:"Property Management",text:"Settings for the Property Management Module.",selections:[{title:"API Endpoint",advanced:!0,text:"This will be the communication endpoint for Defects.",options:[...new Set([..."".split(","),void 0,n.api.propertyManagement])],initial:n.api.propertyManagement,valueChange:c=>{n.changePropertyManagementApiURL(c)}}]},{title:"Parking Management",text:"Settings for the Parking Management Module.",selections:[{title:"API Endpoint",advanced:!0,text:"This will be the communication endpoint for Parking spots.",options:[...new Set([..."".split(","),void 0,n.api.parkingManagement])],initial:n.api.parkingManagement,valueChange:c=>{n.changeParkingManagementApiURL(c)}}]},{title:"Monitoring Management",text:"Settings for the Monitoring Management Module.",selections:[{title:"API Endpoint",advanced:!0,text:"This will be the communication endpoint for the Monitoring.",options:[...new Set([..."".split(","),void 0,n.api.monitoringManagement])],initial:n.api.monitoringManagement,valueChange:c=>{n.changeMonitoringManagementApiURL(c)}}]},{title:"Tenant Management",text:"Settings for the Tenant Management Module.",selections:[{title:"API Endpoint",advanced:!0,text:"This will be the communication endpoint for tenant management.",options:[...new Set([..."".split(","),"https://tenant-management.prod.cloud-porsche.com",n.api.tenantManagement])],initial:n.api.tenantManagement,valueChange:c=>{n.changeTenantManagementApiURL(c)}}]}]),L=w(D.value[0]),ae=c=>{d.value=!0,x.value=c.uid,g.value=c.email,b.value=c.role,I.value=c.role},W=c=>{v.value=!0,u.value=c.uid,r.value=c.email},te=async()=>{try{x.value?await t.updateUserRole(p.value,x.value,b.value):await t.addUser(p.value,g.value,b.value)}catch(c){console.error("Error in adding or updating user:",c)}finally{d.value=!1}},be=async()=>{try{await t.deleteUser(p.value,u.value)}catch(c){console.error("Error deleting user:",c)}finally{v.value=!1}},le=()=>{g.value="",b.value="user",x.value="",d.value=!0};return(c,l)=>{const ne=Ne;return C(),q("div",null,[a(Pa,{density:"comfortable"},{default:o(()=>[a(Ha,{modelValue:i(L),"onUpdate:modelValue":l[0]||(l[0]=P=>_(L)?L.value=P:null)},{default:o(()=>[(C(!0),q(X,null,ie(i(D),P=>(C(),B(Le,{key:P.title,value:P.title},{default:o(()=>[V(M(P.title),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(We,{modelValue:i(L),"onUpdate:modelValue":l[12]||(l[12]=P=>_(L)?L.value=P:null)},{default:o(()=>[(C(!0),q(X,null,ie(i(D),P=>(C(),B(Ge,{key:P.title,value:P.title},{default:o(()=>[a(Ca,null,{default:o(()=>[R("p",Xa,M(P.text),1),a(Ve,{class:"pa-2"}),a(Ta,{rounded:""},{default:o(()=>[P.selections?(C(!0),q(X,{key:0},ie(P.selections,s=>(C(),B(J,{disabled:s.advanced,key:s.title,class:"pa-5"},{default:o(()=>[a(de,null,{default:o(()=>[V(M((s.advanced?"Disabled: ":"")+s.title),1)]),_:2},1024),a(ke,{class:"d-block pb-5"},{default:o(()=>[V(M(s.text),1)]),_:2},1024),a(Ue,{"model-value":s.initial,"onUpdate:modelValue":s.valueChange,items:s.options,outlined:""},null,8,["model-value","onUpdate:modelValue","items"])]),_:2},1032,["disabled"]))),128)):P.title==="User Management"&&i(ye)().hasAdminAccess?(C(),B(ne,{key:1},{default:o(()=>[a(J,{class:"pa-5"},{default:o(()=>[R("div",Ka,[l[15]||(l[15]=R("h2",null,"User Management",-1)),R("div",Ya,[a($,{color:"primary",onClick:l[1]||(l[1]=s=>i(t).fetchUsers(i(p),i(n).currUser.uid))},{default:o(()=>l[13]||(l[13]=[V(" Refresh ")])),_:1}),a(ha,{class:"pl-5"}),a($,{color:"primary",onClick:le},{default:o(()=>l[14]||(l[14]=[V(" Add User ")])),_:1})])]),a($a,{class:"data-table rounded",density:"comfortable",items:i(t).users,headers:Y,"items-per-page-options":[{value:5,title:"5"},{value:10,title:"10"},{value:25,title:"25"},{value:-1,title:"All"}],"item-value":"email",dense:"",outlined:""},{"item.email":o(({item:s})=>[V(M(s.email),1)]),"item.uid":o(({item:s})=>[V(M(s.uid),1)]),"item.role":o(({item:s})=>[V(M(s.role),1)]),"item.action":o(({item:s})=>[R("div",null,[a(ee,{class:"me-3",onClick:oe=>ae(s)},{default:o(()=>l[16]||(l[16]=[V(" mdi-pencil ")])),_:2},1032,["onClick"]),a(ee,{color:"red",onClick:oe=>W(s)},{default:o(()=>l[17]||(l[17]=[V(" mdi-delete ")])),_:2},1032,["onClick"])])]),_:1},8,["items"])]),_:1})]),_:1})):(C(),B(J,{key:2,class:"pa-5"},{default:o(()=>[a(de,null,{default:o(()=>l[18]||(l[18]=[V("No settings available.")])),_:1})]),_:1}))]),_:2},1024),P.migration?(C(),B(Na,{key:0,rounded:"",class:"mt-4"},{default:o(()=>[a(La,null,{default:o(()=>[a(ue,null,{default:o(()=>[a(J,null,{default:o(()=>[a(de,null,{default:o(()=>l[19]||(l[19]=[V("Data Migration")])),_:1}),a(ke,null,{default:o(()=>l[20]||(l[20]=[V(" Migrating from a different tenant? Enter your details below and start the migration process. ")])),_:1})]),_:1})]),_:1}),a(re,null,{default:o(()=>[a(Ma,{onSubmit:l[5]||(l[5]=s=>F()),class:"ma-2"},{default:o(()=>[a(Z,{modelValue:i(y),"onUpdate:modelValue":l[2]||(l[2]=s=>_(y)?y.value=s:null),label:"Old Tenant ID",required:""},{append:o(()=>[ve((C(),B(ee,null,{default:o(()=>l[21]||(l[21]=[V("mdi-help-circle-outline ")])),_:1})),[[Ia,"You can find your tenant id in the path of your URL (e.g. yourname-y71nc)","top"]])]),_:1},8,["modelValue"]),a(Z,{modelValue:i(S),"onUpdate:modelValue":l[3]||(l[3]=s=>_(S)?S.value=s:null),label:"Old Tenant Email",required:""},null,8,["modelValue"]),a(Z,{modelValue:i(h),"onUpdate:modelValue":l[4]||(l[4]=s=>_(h)?h.value=s:null),label:"Old Tenant Password",required:"",type:"password"},null,8,["modelValue"]),a(Ve,{class:"pb-4"}),R("span",null,[a($,{onClick:F,color:i(O)?"error":"primary",loading:i(U),disabled:!i(y)||!i(S)||!i(h)},{default:o(()=>l[22]||(l[22]=[V(" Confirm & Start Migration ")])),_:1},8,["color","loading","disabled"]),i(E)?(C(),q("span",Qa,M(i(E)),1)):Q("",!0)])]),_:1})]),_:1})]),_:1})]),_:1})):Q("",!0),a(Pe,{modelValue:i(d),"onUpdate:modelValue":l[9]||(l[9]=s=>_(d)?d.value=s:null),"max-width":"500px"},{default:o(()=>[a(we,null,{default:o(()=>[a(Se,null,{default:o(()=>[R("span",Ja,M(i(x)?"Edit User Role":"Add New User"),1)]),_:1}),a(Ce,null,{default:o(()=>[i(x)?Q("",!0):(C(),B(Z,{key:0,modelValue:i(g),"onUpdate:modelValue":l[6]||(l[6]=s=>_(g)?g.value=s:null),label:"User Email",outlined:"",required:"",editable:"true",rules:[s=>/.+@.+\..+/.test(s)||"E-mail must be valid"]},null,8,["modelValue","rules"])),a(Ue,{modelValue:i(b),"onUpdate:modelValue":l[7]||(l[7]=s=>_(b)?b.value=s:null),label:"Role",items:["admin","user","manager"],outlined:"",required:""},null,8,["modelValue"])]),_:1}),a(Te,null,{default:o(()=>[a($,{onClick:l[8]||(l[8]=s=>d.value=!1)},{default:o(()=>l[23]||(l[23]=[V(" Cancel")])),_:1}),a($,{color:"primary",disabled:!!i(x)&&i(I)===i(b)||!i(x)&&!/.+@.+\..+/.test(i(g)),onClick:te},{default:o(()=>[V(M(i(x)?"Update":"Add User"),1)]),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),a(Pe,{modelValue:i(v),"onUpdate:modelValue":l[11]||(l[11]=s=>_(v)?v.value=s:null),"max-width":"500px"},{default:o(()=>[a(we,null,{default:o(()=>[a(Se,null,{default:o(()=>l[24]||(l[24]=[R("span",{class:"headline"},"Delete User",-1)])),_:1}),a(Ce,null,{default:o(()=>[R("p",null," Are you sure you want to delete the user "+M(i(r))+"? ",1)]),_:1}),a(Te,null,{default:o(()=>[a($,{color:"blue",onClick:l[10]||(l[10]=s=>v.value=!1)},{default:o(()=>l[25]||(l[25]=[V(" Cancel ")])),_:1}),a($,{color:"red",onClick:be},{default:o(()=>l[26]||(l[26]=[V("Delete")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:2},1024)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"]),i(A)||i(O)?(C(),B(wa,{key:0,closable:"",type:i(A)?"success":"error",class:"ms-8 me-8 mb-8"},{default:o(()=>[V(M(i(A)||i(O)),1)]),_:1},8,["type"])):Q("",!0)])}}});export{st as default};

import We from"./ParkingSpotComponent-De3fuUHj.js";import{_ as Oe}from"./ProTier-Cg7PlTn4.js";import{a5 as q,a9 as oe,ap as je,ac as re,k as t,aC as ke,M as _,aD as Fe,aE as Ge,aF as Ke,g as T,n as X,aG as qe,aH as He,ah as Me,W as ze,aI as K,aJ as Je,aK as Xe,aL as Ye,aq as Ze,ax as pe,aM as Qe,aN as et,aO as tt,aP as lt,aQ as at,O as Re,aR as nt,aS as Se,aT as ot,aU as Pe,R as le,K as ae,d as rt,S as ut,aV as Ce,f as it,e as fe,af as st,aW as dt,r as G,s as C,aX as Te,aY as pt,i as mt,z as ft,o as c,j as J,w as l,V as ct,N as xe,b as u,C as y,p as we,T as Q,u as o,A as ie,B as Ie,Z as se,J as ee,c as I,E as ce,F as de,G as te,t as v,I as vt,au as Vt,l as _e,aZ as Ae,D as gt,L as yt,a_ as he,a$ as bt,X as kt,b0 as St}from"./index-C41_NqNp.js";import{m as Pt,V as De,a as Ct,b as Ue}from"./VWindowItem-CK5kE5vK.js";import{V as L,a as V}from"./VRow-D-N1wjV3.js";import{V as Tt}from"./VTextarea-BxNY92Vb.js";import{V as $e}from"./VSelect-DoUWraXr.js";import{V as ve}from"./VChip-9zWF-8GI.js";import{V as Le}from"./VDataTable-C9DPK_mi.js";import"./index-DTmZ7FKq.js";import"./VPagination-gTsTvW7P.js";const Ne=q({color:String,disabled:{type:[Boolean,String],default:!1},prevText:{type:String,default:"$vuetify.stepper.prev"},nextText:{type:String,default:"$vuetify.stepper.next"}},"VStepperActions"),xt=oe()({name:"VStepperActions",props:Ne(),emits:{"click:prev":()=>!0,"click:next":()=>!0},setup(n,D){let{emit:r,slots:i}=D;const{t:k}=je();function x(){r("click:prev")}function d(){r("click:next")}return re(()=>{const A={onClick:x},h={onClick:d};return t("div",{class:"v-stepper-actions"},[t(ke,{defaults:{VBtn:{disabled:["prev",!0].includes(n.disabled),text:k(n.prevText),variant:"text"}}},{default:()=>{var S;return[((S=i.prev)==null?void 0:S.call(i,{props:A}))??t(_,A,null)]}}),t(ke,{defaults:{VBtn:{color:n.color,disabled:["next",!0].includes(n.disabled),text:k(n.nextText),variant:"tonal"}}},{default:()=>{var S;return[((S=i.next)==null?void 0:S.call(i,{props:h}))??t(_,h,null)]}})])}),{}}}),Ve=Symbol.for("vuetify:v-stepper"),wt=q({color:String,title:String,subtitle:String,complete:Boolean,completeIcon:{type:K,default:"$complete"},editable:Boolean,editIcon:{type:K,default:"$edit"},error:Boolean,errorIcon:{type:K,default:"$error"},icon:K,ripple:{type:[Boolean,Object],default:!0},rules:{type:Array,default:()=>[]}},"StepperItem"),It=q({...wt(),...Fe()},"VStepperItem"),_t=oe()({name:"VStepperItem",directives:{Ripple:Ge},props:It(),emits:{"group:selected":n=>!0},setup(n,D){let{slots:r}=D;const i=Ke(n,Ve,!0),k=T(()=>(i==null?void 0:i.value.value)??n.value),x=T(()=>n.rules.every(R=>R()===!0)),d=T(()=>!n.disabled&&n.editable),A=T(()=>!n.disabled&&n.editable),h=T(()=>n.error||!x.value),S=T(()=>n.complete||n.rules.length>0&&x.value),U=T(()=>h.value?n.errorIcon:S.value?n.completeIcon:i.isSelected.value&&n.editable?n.editIcon:n.icon),E=T(()=>({canEdit:A.value,hasError:h.value,hasCompleted:S.value,title:n.title,subtitle:n.subtitle,step:k.value,value:n.value}));return re(()=>{var $,g,w;const R=(!i||i.isSelected.value||S.value||A.value)&&!h.value&&!n.disabled,B=!!(n.title!=null||r.title),H=!!(n.subtitle!=null||r.subtitle);function N(){i==null||i.toggle()}return X(t("button",{class:["v-stepper-item",{"v-stepper-item--complete":S.value,"v-stepper-item--disabled":n.disabled,"v-stepper-item--error":h.value},i==null?void 0:i.selectedClass.value],disabled:!n.editable,onClick:N},[d.value&&He(!0,"v-stepper-item"),t(Me,{key:"stepper-avatar",class:"v-stepper-item__avatar",color:R?n.color:void 0,size:24},{default:()=>{var P;return[((P=r.icon)==null?void 0:P.call(r,E.value))??(U.value?t(ze,{icon:U.value},null):k.value)]}}),t("div",{class:"v-stepper-item__content"},[B&&t("div",{key:"title",class:"v-stepper-item__title"},[(($=r.title)==null?void 0:$.call(r,E.value))??n.title]),H&&t("div",{key:"subtitle",class:"v-stepper-item__subtitle"},[((g=r.subtitle)==null?void 0:g.call(r,E.value))??n.subtitle]),(w=r.default)==null?void 0:w.call(r,E.value)])]),[[qe("ripple"),n.ripple&&n.editable,null]])}),{}}}),At=Je("v-stepper-header"),ht=q({...Xe(Pt(),["continuous","nextIcon","prevIcon","showArrows","touch","mandatory"])},"VStepperWindow"),Be=oe()({name:"VStepperWindow",props:ht(),emits:{"update:modelValue":n=>!0},setup(n,D){let{slots:r}=D;const i=Ye(Ve,null),k=Ze(n,"modelValue"),x=T({get(){var d;return k.value!=null||!i?k.value:(d=i.items.value.find(A=>i.selected.value.includes(A.id)))==null?void 0:d.value},set(d){k.value=d}});return re(()=>{const d=De.filterProps(n);return t(De,pe({_as:"VStepperWindow"},d,{modelValue:x.value,"onUpdate:modelValue":A=>x.value=A,class:["v-stepper-window",n.class],style:n.style,mandatory:!1,touch:!1}),r)}),{}}}),Dt=q({...Ct()},"VStepperWindowItem"),ne=oe()({name:"VStepperWindowItem",props:Dt(),setup(n,D){let{slots:r}=D;return re(()=>{const i=Ue.filterProps(n);return t(Ue,pe({_as:"VStepperWindowItem"},i,{class:["v-stepper-window-item",n.class],style:n.style}),r)}),{}}}),Ut=q({altLabels:Boolean,bgColor:String,completeIcon:K,editIcon:K,editable:Boolean,errorIcon:K,hideActions:Boolean,items:{type:Array,default:()=>[]},itemTitle:{type:String,default:"title"},itemValue:{type:String,default:"value"},nonLinear:Boolean,flat:Boolean,...Qe()},"Stepper"),$t=q({...Ut(),...et({mandatory:"force",selectedClass:"v-stepper-item--selected"}),...tt(),...lt(Ne(),["prevText","nextText"])},"VStepper"),Lt=oe()({name:"VStepper",props:$t(),emits:{"update:modelValue":n=>!0},setup(n,D){let{slots:r}=D;const{items:i,next:k,prev:x,selected:d}=at(n,Ve),{displayClasses:A,mobile:h}=Re(n),{completeIcon:S,editIcon:U,errorIcon:E,color:R,editable:B,prevText:H,nextText:N}=nt(n),$=T(()=>n.items.map((P,O)=>{const j=Se(P,n.itemTitle,P),p=Se(P,n.itemValue,O+1);return{title:j,value:p,raw:P}})),g=T(()=>i.value.findIndex(P=>d.value.includes(P.id))),w=T(()=>n.disabled?n.disabled:g.value===0?"prev":g.value===i.value.length-1?"next":!1);return ot({VStepperItem:{editable:B,errorIcon:E,completeIcon:S,editIcon:U,prevText:H,nextText:N},VStepperActions:{color:R,disabled:w,prevText:H,nextText:N}}),re(()=>{const P=Pe.filterProps(n),O=!!(r.header||n.items.length),j=n.items.length>0,p=!n.hideActions&&!!(j||r.actions);return t(Pe,pe(P,{color:n.bgColor,class:["v-stepper",{"v-stepper--alt-labels":n.altLabels,"v-stepper--flat":n.flat,"v-stepper--non-linear":n.nonLinear,"v-stepper--mobile":h.value},A.value,n.class],style:n.style}),{default:()=>{var m,Y;return[O&&t(At,{key:"stepper-header"},{default:()=>[$.value.map((W,M)=>{let{raw:Z,...F}=W;return t(le,null,[!!M&&t(ae,null,null),t(_t,F,{default:r[`header-item.${F.value}`]??r.header,icon:r.icon,title:r.title,subtitle:r.subtitle})])})]}),j&&t(Be,{key:"stepper-window"},{default:()=>[$.value.map(W=>t(ne,{value:W.value},{default:()=>{var M,Z;return((M=r[`item.${W.value}`])==null?void 0:M.call(r,W))??((Z=r.item)==null?void 0:Z.call(r,W))}}))]}),(m=r.default)==null?void 0:m.call(r,{prev:x,next:k}),p&&(((Y=r.actions)==null?void 0:Y.call(r,{next:k,prev:x}))??t(xt,{key:"stepper-actions","onClick:prev":x,"onClick:next":k},r))]}})}),{prev:x,next:k}}}),Rt={class:"d-flex pa-4"},Nt={id:"property-panel-container"},Bt={key:0,class:"d-flex pb-8 w-100 h-100 align-center justify-center"},Et={class:"pl-2 pb-8 text-h6"},Wt={class:"d-flex justify-space-between pa-4"},Ot=rt({__name:"index",async setup(n){let D,r;const i=ut(),k=T(()=>i.params.tenantId),x=Re().mobile,d=Ce(),A=it(),h=fe();[D,r]=st(()=>A.fetchMonitoringData()),await D,r();const{parkingSpots:S}=dt(d),U=f=>!!f||"This field is required.",E=T(()=>f=>m.length>0||"At least one layer must exist."),R=G(!1),B=G("");function H(f){const e=d.properties.find(b=>b.name===f);e?d.deleteProperty(e.id):d.error=!0,B.value="",R.value=!1}const N=T(()=>["General Information","Parking Spots",...m.map(f=>`Layer ${f.floor}`),"Confirm"]),$=G(!1),g=G(1),w=G(!1),P=G(!1),O=()=>{w.value&&(g.value===N.value.length?ge():g.value+=1)},j={name:"",location:"",description:"",pricePerHour:1,parkingType:C.ParkingPropertyType.TRACK_INDIVIDUAL};let p=Te({...j}),m=Te([]);const Y=pt("layer-form");mt(m,()=>{Y.value&&Y.value.validate()});function W(f){g.value===2?m.map(e=>{e.parkingSpots=M(e.spotCount)}):g.value+1===N.value.length&&p.parkingType===C.ParkingPropertyType.TRACK_INDIVIDUAL&&m.forEach(e=>e.parkingSpots.map((b,z)=>(b.id=b.placeholder?crypto.randomUUID():e.idPattern.replace("${index}",z.toString()).replace("${layer}",e.floor.toString()),b))),f()}function M(f){return Array.from({length:f},e=>({id:crypto.randomUUID(),state:C.ParkingSpotState.FREE,electricCharging:!1,placeholder:!1,customer:null,lastStateChange:new Date}))}function Z(f,e){if(e.electricCharging=!1,e.placeholder)f.parkingSpots=f.parkingSpots.filter(b=>b.placeholder||b.id!==e.id),e.placeholder=!e.placeholder;else{const b=Object.assign({},e);e.placeholder=!e.placeholder,f.parkingSpots.push(b)}}const F=G(!1);async function ge(){P.value=!0,F.value=!0;const f={...p,lastModified:new Date,layers:m,defects:[],tenantId:""};await d.addProperty(f),$.value=!1,p={...j},m=[],g.value=1,F.value=!1,P.value=!1}function ye(f){const e=Ce().parkingSpots(f.id);if(e.length<=0)return;const b=e.filter(z=>z.state===C.ParkingSpotState.OCCUPIED).length;return b===e.length?"tomato":b>=e.length*.65?"darkgoldenrod":"green"}function me(f){switch(f){case C.ParkingPropertyType.TRACK_INDIVIDUAL:return"Individual";case C.ParkingPropertyType.TRACK_TOTAL:return"Total";default:return"Unknown"}}function be(){var f;switch((f=h.tenant.info)==null?void 0:f.tier){case C.TenantTier.FREE:return d.properties.length>=1;case C.TenantTier.PRO:return d.properties.length>=5;case C.TenantTier.ENTERPRISE:return!1;default:return!0}}return window.onbeforeunload=()=>{if($.value)return"Progress will be lost! Are you sure?"},(f,e)=>{const b=ft("v-number-input"),z=Oe,Ee=We;return c(),J("div",null,[t(ct,{id:"property-management-page"},{default:l(()=>[u("h1",null,[u("span",Rt,[e[21]||(e[21]=y("Property Management Page ")),t(we),X(t(_,{class:"ml-4",icon:"mdi-plus",onClick:e[0]||(e[0]=a=>$.value=!0),disabled:!o(h).hasAdminAccess||be()},null,8,["disabled"]),[[Q,o(fe)().hasAdminAccess?be()?"Maximum Properties Reached!":"Add new Property":"Admin only!"]]),X(t(_,{class:"ml-4",icon:"mdi-delete",color:"error",disabled:o(d).properties.length<=0||!o(h).hasAdminAccess,onClick:e[1]||(e[1]=a=>R.value=!0)},null,8,["disabled"]),[[Q,o(fe)().hasAdminAccess?"Delete":"Admin only!"]]),X(t(_,{class:"ml-4",icon:"mdi-refresh",color:o(d).error?"error":void 0,onClick:e[2]||(e[2]=a=>o(d).fetchProperties())},null,8,["color"]),[[Q,"Refresh"]])])]),t(ae,{class:"pa-4"}),t(ie,{loading:o(d).loading||F.value},{default:l(()=>[t(Ie,null,{default:l(()=>e[22]||(e[22]=[y("Your Properties:")])),_:1}),u("div",Nt,[(c(!0),J(le,null,se(o(d).properties,a=>(c(),I(ie,{key:a.id,to:`/${o(k)}/property/${a.id}`,value:a.id,style:he({backgroundColor:ye(a),color:ye(a)?"white":void 0}),class:"pa-4 d-flex flex-column justify-space-evenly align-center"},{default:l(()=>[u("b",null,v(a.name),1),u("small",null,v(a.location),1),t(ve,null,{default:l(()=>[y(v(o(S)(a.id).filter(s=>s.state===o(C.ParkingSpotState).OCCUPIED||s.state===o(C.ParkingSpotState).CHARGING).length)+" / "+v(o(S)(a.id).length),1)]),_:2},1024)]),_:2},1032,["to","value","style"]))),128))]),o(d).properties.length<=0?(c(),J("div",Bt," No Property present. ")):ee("",!0)]),_:1},8,["loading"])]),_:1}),t(xe,{modelValue:$.value,"onUpdate:modelValue":e[16]||(e[16]=a=>$.value=a),persistent:g.value!==1},{default:l(()=>[t(Lt,{modelValue:g.value,"onUpdate:modelValue":e[15]||(e[15]=a=>g.value=a),items:o(N),mobile:o(x),"show-actions":""},{actions:l(({next:a,prev:s})=>[u("span",Wt,[g.value>1?(c(),I(_,{key:0,onClick:s},{default:l(()=>e[36]||(e[36]=[y("Previous")])),_:2},1032,["onClick"])):g.value<=1?(c(),I(_,{key:1,onClick:e[13]||(e[13]=ue=>$.value=!1)},{default:l(()=>e[37]||(e[37]=[y("Cancel ")])),_:1})):ee("",!0),g.value<o(N).length?(c(),I(_,{key:2,disabled:!w.value,onClick:ue=>W(a)},{default:l(()=>e[38]||(e[38]=[y("Next")])),_:2},1032,["disabled","onClick"])):g.value>=o(N).length?(c(),I(_,{key:3,disabled:!w.value||P.value,onClick:e[14]||(e[14]=ue=>ge())},{default:l(()=>e[39]||(e[39]=[y("Save")])),_:1},8,["disabled"])):ee("",!0)])]),default:l(()=>[t(Be,null,{default:l(()=>[t(ne,{value:1},{default:l(()=>[t(ce,{class:"pa-2",modelValue:w.value,"onUpdate:modelValue":e[8]||(e[8]=a=>w.value=a),onSubmit:de(O,["prevent"])},{default:l(()=>[t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[t(te,{modelValue:o(p).name,"onUpdate:modelValue":e[3]||(e[3]=a=>o(p).name=a),label:"Name",required:"",variant:"outlined",rules:[U]},null,8,["modelValue","rules"])]),_:1}),t(V,null,{default:l(()=>[t(te,{modelValue:o(p).location,"onUpdate:modelValue":e[4]||(e[4]=a=>o(p).location=a),label:"Location",required:"",variant:"outlined",rules:[U]},null,8,["modelValue","rules"])]),_:1})]),_:1}),t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[t(Tt,{modelValue:o(p).description,"onUpdate:modelValue":e[5]||(e[5]=a=>o(p).description=a),label:"Description",variant:"outlined",rules:[]},null,8,["modelValue"])]),_:1})]),_:1}),t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[t(b,{modelValue:o(p).pricePerHour,"onUpdate:modelValue":e[6]||(e[6]=a=>o(p).pricePerHour=a),label:"Price per Hour",min:1,variant:"outlined",rules:[U]},null,8,["modelValue","rules"])]),_:1}),t(V,null,{default:l(()=>[t($e,{modelValue:o(p).parkingType,"onUpdate:modelValue":e[7]||(e[7]=a=>o(p).parkingType=a),label:"Parking Type - Track each spot or total",items:[o(C.ParkingPropertyType).TRACK_INDIVIDUAL,o(C.ParkingPropertyType).TRACK_TOTAL],density:"comfortable",variant:"outlined",rules:[]},{selection:l(({item:a})=>[t(ve,null,{default:l(()=>[y(v(me(a.raw)),1)]),_:2},1024)]),item:l(({props:a,item:s})=>[t(vt,pe(a,{title:""}),{default:l(()=>[t(ve,null,{default:l(()=>[y(v(me(s.raw)),1)]),_:2},1024)]),_:2},1040)]),_:1},8,["modelValue","items"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),t(ne,{value:2},{default:l(()=>[t(ce,{class:"pa-2","validate-on":"eager",modelValue:w.value,"onUpdate:modelValue":e[11]||(e[11]=a=>w.value=a),ref:"layer-form",onSubmit:de(O,["prevent"])},{default:l(()=>[o(m).length<=0?(c(),I(Vt,{key:0,class:"pb-2 d-flex justify-center align-center",rules:[o(E)],disabled:""},null,8,["rules"])):ee("",!0),(c(!0),J(le,null,se(o(m),a=>(c(),I(L,{key:a.floor},{default:l(()=>[t(V,{class:"d-flex flex-grow-0 text-no-wrap justify-center align-center"},{default:l(()=>[u("span",Et,"Layer "+v(a.floor),1)]),_:2},1024),t(V,null,{default:l(()=>[t(te,{modelValue:a.name,"onUpdate:modelValue":s=>a.name=s,label:"Name",required:"",variant:"outlined",rules:[U],"hide-details":""},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),t(V,null,{default:l(()=>[t(te,{modelValue:a.description,"onUpdate:modelValue":s=>a.description=s,label:"Description",variant:"outlined",rules:[],"hide-details":""},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),t(V,null,{default:l(()=>[t(b,{modelValue:a.columns,"onUpdate:modelValue":s=>a.columns=s,label:"Number of columns",required:"",variant:"outlined",rules:[U],"hide-details":"",min:1},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),t(V,null,{default:l(()=>[t(b,{modelValue:a.spotCount,"onUpdate:modelValue":s=>a.spotCount=s,label:"Number of spots in this layer",required:"",variant:"outlined",rules:[U],"validate-on":"eager",min:1},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),t(V,{class:"flex-grow-0 align-center"},{default:l(()=>[X(t(_,{icon:"mdi-delete",variant:"outlined",color:"error",onClick:s=>o(m).splice(o(m).indexOf(a),1)},null,8,["onClick"]),[[Q,"Delete this layer","bottom"]])]),_:2},1024)]),_:2},1024))),128)),t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[o(m).length>0?(c(),I(ae,{key:0})):ee("",!0)]),_:1})]),_:1}),t(L,null,{default:l(()=>[t(V,{class:"d-flex justify-center"},{default:l(()=>[o(m).length>0?(c(),I(z,{key:0},{default:l(()=>[t(_,{"prepend-icon":"mdi-plus",onClick:e[9]||(e[9]=a=>o(m).push({floor:o(m).length+1,name:"",description:"",spotCount:100,columns:25,idPattern:"${layer}-${index}",parkingSpots:[]}))},{default:l(()=>e[23]||(e[23]=[y(" Add Layer ")])),_:1})]),_:1})):(c(),I(_,{key:1,"prepend-icon":"mdi-plus",onClick:e[10]||(e[10]=a=>o(m).push({floor:o(m).length+1,name:"",description:"",spotCount:100,columns:25,idPattern:"${layer}-${index}",parkingSpots:[]}))},{default:l(()=>e[24]||(e[24]=[y(" Add Layer ")])),_:1}))]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),(c(!0),J(le,null,se(o(m),a=>(c(),I(ne,{key:a.floor,name:"Layer "+a.floor,value:a.floor+2},{default:l(()=>[t(ce,{class:"pa-2",modelValue:w.value,"onUpdate:modelValue":e[12]||(e[12]=s=>w.value=s),onSubmit:de(O,["prevent"])},{default:l(()=>[t(L,null,{default:l(()=>[X((c(),I(V,null,{default:l(()=>[t(te,{disabled:o(p).parkingType===o(C.ParkingPropertyType).TRACK_TOTAL,modelValue:a.idPattern,"onUpdate:modelValue":s=>a.idPattern=s,label:"Spot Id Generation Pattern (f.e. 'PS-${index}', '${index}')",required:"",variant:"outlined",rules:[U]},null,8,["disabled","modelValue","onUpdate:modelValue","rules"])]),_:2},1024)),[[Q,o(p).parkingType===o(C.ParkingPropertyType).TRACK_TOTAL?"This field is disabled when tracking total parking spots.":void 0,"bottom"]])]),_:2},1024),t(z,null,{default:l(()=>[t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[t(ae),e[25]||(e[25]=u("small",{class:"pa-2 d-flex justify-center align-center text-grey text-center"},[y("Left click a spot to replace it with a placeholder."),u("br"),y(" Right click to mark it as electric charger. ")],-1))]),_:1})]),_:1}),t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[u("div",{id:"spot-container",style:he({gridTemplateColumns:`repeat(${a.columns}, 1fr)`})},[(c(),I(bt,null,{fallback:l(()=>[t(kt,{indeterminate:""})]),default:l(()=>[(c(!0),J(le,null,se(a.parkingSpots,s=>(c(),I(Ee,{key:s.id,spot:s,"disable-dialog":"",onClick:ue=>Z(a,s),onContextmenu:de(ue=>s.electricCharging=!s.electricCharging,["prevent"])},null,8,["spot","onClick","onContextmenu"]))),128))]),_:2},1024))],4)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1032,["modelValue"])]),_:2},1032,["name","value"]))),128)),t(ne,{value:o(N).length},{default:l(()=>[t(ie,{loading:F.value},{default:l(()=>[t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[t(Le,{items:Object.entries(o(p)),density:"compact","disable-sort":"","hide-default-header":"","hide-default-footer":"",dense:""},{top:l(()=>[t(_e,{flat:"",rounded:""},{default:l(()=>[t(Ae,null,{default:l(()=>e[26]||(e[26]=[y("Property Details")])),_:1})]),_:1})]),"body.prepend":l(()=>e[27]||(e[27]=[u("tr",null,[u("th",null,"Attribute"),u("th",null,"Value")],-1)])),body:l(()=>[u("tr",null,[e[28]||(e[28]=u("td",null,"Name",-1)),u("td",null,v(o(p).name),1)]),u("tr",null,[e[29]||(e[29]=u("td",null,"Description",-1)),u("td",null,v(o(p).description),1)]),u("tr",null,[e[30]||(e[30]=u("td",null,"Location",-1)),u("td",null,v(o(p).location),1)]),u("tr",null,[e[31]||(e[31]=u("td",null,"Price / h",-1)),u("td",null,v(o(p).pricePerHour)+" €",1)]),u("tr",null,[e[32]||(e[32]=u("td",null,"Spot counting",-1)),u("td",null,v(me(o(p).parkingType)),1)])]),_:1},8,["items"])]),_:1})]),_:1}),t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[t(Le,{items:o(m),"hide-default-header":"","hide-default-footer":"",dense:""},{top:l(()=>[t(_e,{flat:"",rounded:""},{default:l(()=>[t(Ae,null,{default:l(()=>e[33]||(e[33]=[y("Layers")])),_:1})]),_:1})]),"body.prepend":l(()=>e[34]||(e[34]=[u("tr",null,[u("th",null,"Layer"),u("th",null,"Name"),u("th",null,"Description"),u("th",null,"Columns"),u("th",null,"Spot Count")],-1)])),item:l(({item:a})=>[u("tr",null,[u("td",null,v(a.floor),1),u("td",null,v(a.name),1),u("td",null,v(a.description),1),u("td",null,v(a.columns),1),u("td",null,v(a.spotCount),1)])]),"body.append":l(()=>[t(ae),u("tr",null,[u("td",null,v(o(m).length)+" layers in total ",1),e[35]||(e[35]=u("td",{colspan:"3"},null,-1)),u("td",null,v(o(m).reduce((a,s)=>a+s.spotCount,0))+" spots in total ",1)])]),_:1},8,["items"])]),_:1})]),_:1})]),_:1},8,["loading"])]),_:1},8,["value"])]),_:1})]),_:1},8,["modelValue","items","mobile"])]),_:1},8,["modelValue","persistent"]),t(xe,{modelValue:R.value,"onUpdate:modelValue":e[20]||(e[20]=a=>R.value=a),"max-width":"50%"},{default:l(()=>[t(ie,null,{default:l(()=>[t(Ie,null,{default:l(()=>e[40]||(e[40]=[y("Delete Properties")])),_:1}),t(gt,null,{default:l(()=>[t(L,null,{default:l(()=>[t(V,null,{default:l(()=>[t($e,{modelValue:B.value,"onUpdate:modelValue":e[17]||(e[17]=a=>B.value=a),items:o(d).properties.map(a=>a.name),label:"Select Property to delete"},null,8,["modelValue","items"])]),_:1})]),_:1})]),_:1}),t(yt,null,{default:l(()=>{var a;return[t(we),t(_,{variant:"tonal",onClick:e[18]||(e[18]=s=>{R.value=!1,B.value=""})},{default:l(()=>e[41]||(e[41]=[y("Cancel ")])),_:1}),t(_,{variant:"tonal",color:"error",disabled:((a=B.value)==null?void 0:a.length)<=0,onClick:e[19]||(e[19]=s=>H(B.value))},{default:l(()=>e[42]||(e[42]=[y(" Delete ")])),_:1},8,["disabled"])]}),_:1})]),_:1})]),_:1},8,["modelValue"])])}}}),Zt=St(Ot,[["__scopeId","data-v-6ba7cf74"]]);export{Zt as default};

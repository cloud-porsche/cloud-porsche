import{d as H,o as p,c as E,z as k,A as pe,B as be,h as G,j as se,r as f,C as we,w as l,l as e,D as ie,E as De,F as S,t as W,u as n,G as he,I as ke,J as Se,K,L as Ue,M as q,b as w,x as P,N as Ve,q as xe,s as R,O as re,P as ye,k as I,p as L,T,f as _,Q as fe,R as Ie,S as Ce,U as _e,W as ee,V as Re,X as te,Y as ae,Z as le,_ as Ne,$ as $e,a0 as me,a1 as ve,a2 as oe,a3 as Ee,a4 as ne,a5 as Fe}from"./index-Bsw1IfI-.js";import{V as M,a as Ae}from"./VChip-C1Wy9kug.js";import{V as Le,a as A}from"./VRow-B3RHJn6Z.js";import{V as Te}from"./VTextarea-C0vX1J_m.js";import{V as Oe}from"./VSelect-CNMU9u9T.js";import{V as We}from"./VFileInput-Du-ThA9F.js";import{V as Ye}from"./VDataTable-CojhYOMw.js";import{u as ge}from"./index-BAhiIYZO.js";import"./VPagination-CqCj4r71.js";const de=H({__name:"StatusChip",props:{defect:{}},setup(O){function F(o){switch(o){case k.DefectState.OPEN:return"Open";case k.DefectState.IN_WORK:return"In Work";case k.DefectState.REJECTED:return"Rejected";case k.DefectState.DONE:return"Done";default:return"Unknown"}}function r(o){switch(o){case k.DefectState.OPEN:return"green";case k.DefectState.IN_WORK:return"blue";case k.DefectState.REJECTED:return"red";case k.DefectState.DONE:return"grey";default:return"black"}}return(o,U)=>(p(),E(M,{color:r(o.defect.status),text:F(o.defect.status),class:"text-uppercase",size:"small",label:""},null,8,["color","text"]))}}),Me=H({__name:"AddDefectPopup",props:pe({defect:{},patch:{type:Boolean}},{modelValue:{type:Boolean},modelModifiers:{}}),emits:pe(["save","patch","close"],["update:modelValue"]),setup(O,{emit:F}){const r=be(O,"modelValue"),o=O,U=G(()=>o.defect),m=G(()=>o.patch??!1);se(U,()=>{C.value=o.defect.name??"",N.value=o.defect.location??"",v.value=o.defect.descriptionShort??"",V.value=o.defect.descriptionLong??"",y.value=o.defect.reportedDate?new Date(o.defect.reportedDate):new Date,d.value=o.defect.status,h.value=o.defect.image?new File([],o.defect.image,{type:"image/png"}):void 0});const C=f(o.defect.name??""),N=f(o.defect.location??""),v=f(o.defect.descriptionShort??""),V=f(o.defect.descriptionLong??""),y=f(o.defect.reportedDate?new Date(o.defect.reportedDate):new Date),h=f(o.defect.image?new File([],o.defect.image,{type:"image/png"}):void 0),d=f(o.defect.status),u=f(!1),g=c=>!!c||"This field is required.",Y=F;function j(){u.value&&B()}const Q=[c=>!c||!c.length||c[0].size<2e6||"File size should be less than 2MB",c=>!c||!c.length||c[0].type.startsWith("image/")||"File must be an image"];function B(){var s;const c={name:C.value,location:N.value,descriptionShort:v.value,descriptionLong:V.value,reportedDate:X(y.value),image:h.value?h.value.name===o.defect.image?o.defect.image:crypto.randomUUID()+"."+((s=h.value)==null?void 0:s.name.split(".").pop()):""};m.value?Y("patch",[{...c,status:d.value},h.value,o.defect.image]):Y("save",c,h.value),z()}function z(){r.value=!1}function X(c){const s=c.getTimezoneOffset();return new Date(c.getTime()-s*60*1e3)}return(c,s)=>{const Z=we("v-date-input"),J=de;return p(),E(re,{modelValue:r.value,"onUpdate:modelValue":s[8]||(s[8]=a=>r.value=a),"max-width":"600"},{default:l(()=>[e(ie,null,{default:l(()=>[e(De,null,{default:l(()=>[S(W(n(m)?"Change":"Add New")+" Defect ",1)]),_:1}),e(he,null,{default:l(()=>[e(ke,{modelValue:u.value,"onUpdate:modelValue":s[7]||(s[7]=a=>u.value=a),onSubmit:Se(j,["prevent"])},{default:l(()=>[e(Le,{dense:""},{default:l(()=>[e(A,{cols:"12",md:"6"},{default:l(()=>[e(K,{label:"Defect Name*",modelValue:C.value,"onUpdate:modelValue":s[0]||(s[0]=a=>C.value=a),rules:[g]},null,8,["modelValue","rules"])]),_:1}),e(A,{cols:"12",md:"6"},{default:l(()=>[e(K,{label:"Location*",modelValue:N.value,"onUpdate:modelValue":s[1]||(s[1]=a=>N.value=a),rules:[g]},null,8,["modelValue","rules"])]),_:1}),e(A,{cols:"12"},{default:l(()=>[e(K,{label:"Short Description*",modelValue:v.value,"onUpdate:modelValue":s[2]||(s[2]=a=>v.value=a),rules:[g]},null,8,["modelValue","rules"])]),_:1}),e(A,{cols:"12"},{default:l(()=>[e(Te,{label:"Long Description*",modelValue:V.value,"onUpdate:modelValue":s[3]||(s[3]=a=>V.value=a),rules:[g]},null,8,["modelValue","rules"])]),_:1}),e(A,{cols:n(m)?6:12},{default:l(()=>[e(Z,{label:"Select a date*",modelValue:y.value,"onUpdate:modelValue":s[4]||(s[4]=a=>y.value=a),rules:[g]},null,8,["modelValue","rules"])]),_:1},8,["cols"]),n(m)?(p(),E(A,{key:0,cols:"6"},{default:l(()=>[e(Oe,{label:"Status",items:[n(k.DefectState).OPEN,n(k.DefectState).IN_WORK,n(k.DefectState).DONE,n(k.DefectState).REJECTED],modelValue:d.value,"onUpdate:modelValue":s[5]||(s[5]=a=>d.value=a)},{selection:l(({item:a})=>[e(J,{defect:{status:a.raw}},null,8,["defect"])]),item:l(({props:a,item:t})=>[e(Ue,{props:a,onClick:a.onClick},{default:l(()=>[e(J,{defect:{status:t.raw}},null,8,["defect"])]),_:2},1032,["props","onClick"])]),_:1},8,["items","modelValue"])]),_:1})):q("",!0),e(A,{cols:"12"},{default:l(()=>[e(We,{label:"Upload Image",rules:Q,"validate-on":"eager",modelValue:h.value,"onUpdate:modelValue":s[6]||(s[6]=a=>h.value=a),accept:"image/*","prepend-icon":"mdi-image"},null,8,["modelValue"])]),_:1})]),_:1}),s[9]||(s[9]=w("small",{class:"text-caption"},"*indicates required field",-1))]),_:1},8,["modelValue"])]),_:1}),e(P),e(Ve,null,{default:l(()=>[e(xe),e(R,{text:"Cancel",onClick:z},{default:l(()=>s[10]||(s[10]=[S("Cancel")])),_:1}),e(R,{disabled:!u.value,color:"primary",onClick:j},{default:l(()=>s[11]||(s[11]=[S(" Save ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"])}}}),Pe={class:"d-flex w-100 pb-1"},je=H({__name:"SearchFilter",props:{loading:{type:Boolean},error:{type:Boolean}},emits:["updateList","refresh","add","deleteAllDone"],setup(O,{emit:F}){const{mobile:r}=ye(),o=f(""),U=f("name"),m=F,C=O,N=G(()=>C.error);function v(){y()}function V(){y()}function y(){m("updateList",o.value,U.value)}return(h,d)=>(p(),I(Ce,null,[w("h1",Pe,[d[6]||(d[6]=S(" Defects ")),e(xe),L(e(R,{"prepend-icon":n(r)?void 0:"mdi-delete",icon:n(r)?"mdi-delete":void 0,onClick:d[0]||(d[0]=u=>m("deleteAllDone")),class:"me-2",text:n(r)?"":"Clear all done",disabled:n(_)().isUserRole},null,8,["prepend-icon","icon","text","disabled"]),[[T,n(_)().isUserRole?"Not enough permissions!":"Clear all done"]]),L(e(R,{"prepend-icon":n(r)?void 0:"mdi-plus",icon:n(r)?"mdi-plus":void 0,onClick:d[1]||(d[1]=u=>m("add")),class:"me-2",text:n(r)?"":"Add Defect",disabled:n(_)().isUserRole},null,8,["prepend-icon","icon","text","disabled"]),[[T,n(_)().isUserRole?"Not enough permissions!":"Add Defect"]]),L(e(R,{"prepend-icon":n(r)?void 0:"mdi-refresh",icon:n(r)?"mdi-refresh":void 0,onClick:d[2]||(d[2]=u=>m("refresh")),loading:h.loading,color:n(N)?"error":"primary",text:n(r)?"":"Refresh"},null,8,["prepend-icon","icon","loading","color","text"]),[[T,"Refresh"]])]),e(P,{class:"pa-1",thickness:"0"}),e(K,{loading:h.loading,modelValue:n(o),"onUpdate:modelValue":d[3]||(d[3]=u=>fe(o)?o.value=u:null),density:"comfortable",label:"Search","prepend-inner-icon":"mdi-magnify",variant:"solo-filled",flat:"","hide-details":"","single-line":"",onInput:v,onKeydown:Ie(v,["enter"]),clearable:"","onClick:clear":d[4]||(d[4]=u=>{o.value="",v()}),error:n(N)},null,8,["loading","modelValue","error"]),e(P,{class:"pa-1",thickness:"0"}),e(Ae,{filter:"",modelValue:n(U),"onUpdate:modelValue":d[5]||(d[5]=u=>fe(U)?U.value=u:null),"selected-class":"text-primary",mandatory:"",onChange:V},{default:l(()=>[e(M,{text:"ID",value:"id",variant:"outlined"}),e(M,{text:"Name",value:"name",variant:"outlined"}),e(M,{text:"Location",value:"location",variant:"outlined"}),L(e(M,{text:"Date",value:"reportedDate",variant:"outlined"},null,512),[[T,"e.g. YYYY-MM-DD"]])]),_:1},8,["modelValue"]),e(P,{class:"pa-1",thickness:"0"})],64))}}),Be={class:"d-flex align-center justify-center fill-height"},ze={class:"d-flex align-center justify-center fill-height"},Je=["colspan"],Ke={key:0},qe={key:1},Ge={key:2},He={class:"d-flex align-center justify-start fill-height"},Qe={class:"d-flex align-center justify-start fill-height"},Xe={key:1},Ze={key:3},et={key:4},tt={class:"d-flex flex-column align-center justify-center fill-height"},at={class:"d-flex align-center justify-center fill-height"},pt=H({__name:"[id]",setup(O){const{mobile:F}=ye(),r=f(!0),o=f(!1),U=f([]),m=f(!1),C=f(!1),N=_e(),v=G(()=>N.params.id),V=f({open:!1,src:void 0});se(m,a=>{a||Q()});const y=f({}),h=f(void 0),d=[{title:"ID",value:"id",sortable:!0,maxWidth:"100px"},{title:"Name",value:"name",sortable:!0,maxWidth:"100px",nowrap:!0},{title:"Location",value:"location",sortable:!0,maxWidth:"100px",nowrap:!0},{title:"Description Short",value:"descriptionShort",sortable:!0,maxWidth:"120px",nowrap:!0},{title:"Description Long",value:"descriptionLong",sortable:!0,maxWidth:"100px",nowrap:!0},{title:"Reported Date",value:"reportedDate",nowrap:!0},{title:"Status",value:"status",sortable:!0,maxWidth:"100px"},{title:"Image",value:"signedImage",sortable:!1,nowrap:!0,maxWidth:"150px"},{title:"Actions",value:"actions",sortable:!1,nowrap:!0,maxWidth:"100px"}];g(),se(v,()=>{g()});function u(a){r.value=!1,o.value=!0}function g(){if(!v.value){console.error("Property ID is missing");return}r.value=!0,ee(`/v1/defects?propertyId=${v.value}`).json().then(async a=>{U.value=await Promise.all(a.map(async t=>(t.signedImage=await Y(t.image),t))),r.value=!1,o.value=!1}).catch(u)}async function Y(a){if(!a)return"";try{const t=await ee(`/v1/storage/${a}`);if(!t.ok)throw new Error("Failed to fetch signed URL");const{signedUrl:b}=await t.json();return b}catch(t){return console.error("Error fetching signed URL:",t),""}}function j(){m.value=!0}function Q(){m.value=!1,setTimeout(()=>y.value={},100)}function B(a){y.value=a,m.value=!0}function z(a){if(!a){console.error("No defect to delete");return}h.value=a,C.value=!0}function X(a,t){if(a.propertyId=v.value,r.value=!0,t){const b=new File([t],a.image,{type:t.type}),x=new FormData;x.append("file",b),me("/v1/storage/upload",x).then(()=>ve("/v1/defects",a).then(()=>{g()})).catch(u)}else ve("/v1/defects",a).then(()=>{g()}).catch(u);m.value=!1}function c(a,t){if(!v.value){console.error("Property ID is missing");return}r.value=!0,ee(`/v1/defects/search?search=${a}&filter=${t}&propertyId=${v.value}`).json().then(async b=>{U.value=await Promise.all(b.map(async x=>(x.signedImage=await Y(x.image),x))),r.value=!1,o.value=!1}).catch(u)}function s(a){r.value=!0,oe(`/v1/defects/${a}`).then(()=>{g()}),C.value=!1}function Z(){r.value=!0,oe(`/v1/defects/clearAllDone?propertyId=${v.value}`).then(()=>{g()})}function J(a,t,b,x){if(r.value=!0,b&&t.image&&x!==t.image){const i=new File([b],t.image,{type:b.type}),D=new FormData;D.append("file",i),(x?Ee(`/v1/storage/upload/${x}`,D):me("/v1/storage/upload",D)).then(()=>ne(`/v1/defects/${a}`,t).then(()=>{g()})).catch(u)}else!b&&x?oe(`/v1/storage/${x}`).then(()=>{ne(`/v1/defects/${a}`,t).then(()=>{g()})}).catch(u):ne(`/v1/defects/${a}`,t).then(()=>{g()}).catch(u)}return(a,t)=>{const b=je,x=Me;return p(),I("div",null,[e(Re,null,{default:l(()=>[e(b,{onUpdateList:c,onRefresh:t[0]||(t[0]=i=>g()),onAdd:j,onDeleteAllDone:Z,error:o.value,loading:r.value},null,8,["error","loading"]),e(Ye,{class:"data-table rounded",mobile:n(F),density:"comfortable","no-data-text":o.value?"A network error occurred ⚡":"No defects found",items:U.value,headers:d,"items-per-page-options":[{value:5,title:"5"},{value:10,title:"10"},{value:25,title:"25"},{value:-1,title:"All"}],"show-expand":"","multi-sort":""},{"item.status":l(({item:i})=>[e(de,{defect:i},null,8,["defect"])]),"item.reportedDate":l(({item:i})=>[S(W(n(ge)(i.reportedDate,"MM.DD.YYYY")),1)]),"item.signedImage":l(({item:i})=>{var D;return[((D=i.signedImage)==null?void 0:D.length)>0?(p(),E(le,{key:0,src:i.signedImage,class:"cursor-pointer","aspect-ratio":"1",contain:"",onClick:$=>V.value={open:!0,src:i.signedImage}},{error:l(()=>[w("div",Be,[e(te,{color:"error",icon:"mdi-image-broken-variant"})])]),placeholder:l(()=>[w("div",ze,[e(ae,{size:"24",indeterminate:""})])]),_:2},1032,["src","onClick"])):q("",!0)]}),"item.actions":l(({item:i})=>[L(e(R,{icon:"mdi-pencil",onClick:D=>B(i),variant:"plain",disabled:n(_)().isUserRole},null,8,["onClick","disabled"]),[[T,n(_)().isUserRole?"Not enough permissions!":"Edit"]])]),"expanded-row":l(({columns:i,item:D})=>[w("tr",null,[w("td",{colspan:i.length,class:"pa-5"},[(p(!0),I(Ce,null,Ne(i,$=>{var ue;return p(),I("div",{key:$.value,class:"expanded-defect pa-2"},[w("strong",null,W($.title),1),$.value==="reportedDate"?(p(),I("div",Ke,W(n(ge)(D.reportedDate,"MM.DD.YYYY HH:mm")),1)):$.value==="status"?(p(),I("div",qe,[e(de,{defect:D},null,8,["defect"])])):$.value==="signedImage"?(p(),I("div",Ge,[((ue=D.signedImage)==null?void 0:ue.length)>0?(p(),E(le,{key:0,src:D.signedImage,class:"cursor-pointer",contain:"",position:"left","max-height":"300",onClick:ce=>V.value={open:!0,src:D.signedImage}},{error:l(()=>[w("div",He,[L(e(te,{color:"error",size:"50",icon:"mdi-image-broken-variant"},null,512),[[T,"Corrupted or missing Image"]])])]),placeholder:l(()=>[w("div",Qe,[e(ae,{indeterminate:""})])]),_:2},1032,["src","onClick"])):(p(),I("i",Xe,"No image."))])):$.value==="actions"?(p(),I("div",Ze,[L((p(),E(R,{"prepend-icon":"mdi-pencil",class:"me-2",onClick:ce=>B(D),variant:"tonal",disabled:n(_)().isUserRole},{default:l(()=>t[8]||(t[8]=[S("Edit ")])),_:2},1032,["onClick","disabled"])),[[T,n(_)().isUserRole?"Not enough permissions!":"Edit"]]),e(R,{"prepend-icon":"mdi-delete",color:"error",onClick:ce=>z(D),variant:"flat",disabled:n(_)().isUserRole},{default:l(()=>[t[9]||(t[9]=S("Delete ")),e(Fe,{disabled:!n(_)().isUserRole,activator:"parent",text:"Not enough permissions!"},null,8,["disabled"])]),_:2},1032,["onClick","disabled"])])):(p(),I("div",et,W(D[$.value]),1)),$.title!==""?(p(),E(P,{key:5,class:"mt-2"})):q("",!0)])}),128))],8,Je)])]),_:1},8,["mobile","no-data-text","items"]),e(re,{modelValue:V.value.open,"onUpdate:modelValue":t[2]||(t[2]=i=>V.value.open=i),"max-width":"50%","max-height":"80%"},{default:l(()=>[e(ie,{rounded:"",class:"d-flex flex-row overflow-hidden"},{default:l(()=>[V.value.src?(p(),E(le,{key:0,src:V.value.src,contain:"","max-height":"100%","min-height":"300",rounded:"",onClick:t[1]||(t[1]=i=>V.value={open:!1,src:void 0})},{error:l(()=>[w("div",tt,[e(te,{color:"error",size:"100",icon:"mdi-image-broken-variant"}),t[10]||(t[10]=w("i",{class:"pa-2 text-red-lighten-3"},"Corrupted or missing Image.",-1))])]),placeholder:l(()=>[w("div",at,[e(ae,{indeterminate:""})])]),_:1},8,["src"])):q("",!0)]),_:1})]),_:1},8,["modelValue"]),e(x,{modelValue:m.value,"onUpdate:modelValue":t[3]||(t[3]=i=>m.value=i),defect:y.value,patch:!!y.value.id,onSave:X,onPatch:t[4]||(t[4]=i=>J(y.value.id,i[0],i[1],i[2]))},null,8,["modelValue","defect","patch"])]),_:1}),e(re,{modelValue:C.value,"onUpdate:modelValue":t[7]||(t[7]=i=>C.value=i),"max-width":"400"},{default:l(()=>[e(ie,null,{default:l(()=>[e(De,null,{default:l(()=>t[11]||(t[11]=[S("Confirm Delete")])),_:1}),e($e,null,{default:l(()=>[S("Defect name: "+W(h.value.name),1)]),_:1}),e(he,null,{default:l(()=>t[12]||(t[12]=[S("Are you sure you want to delete this defect?")])),_:1}),e(Ve,null,{default:l(()=>[e(R,{variant:"text",onClick:t[5]||(t[5]=i=>C.value=!1)},{default:l(()=>t[13]||(t[13]=[S("Cancel")])),_:1}),e(R,{color:"error",variant:"flat",onClick:t[6]||(t[6]=i=>s(h.value.id)),autofocus:""},{default:l(()=>t[14]||(t[14]=[S(" Delete ")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])])}}});export{pt as default};

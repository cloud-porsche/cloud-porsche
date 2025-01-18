import{d as K,j as k,_ as G,o as c,c as U,s as re,x as _e,f as J,h as ae,r as u,y as Ve,w as l,l as a,z as oe,A as ce,B as S,t as A,C as ue,D as Se,E as be,F as M,G as xe,I as Y,b as V,J as O,K as fe,q as me,L as I,M as le,N as pe,u as ge,k as w,p as L,T,O as ye,P as ve,Q as Ce,R as X,S as ie,U as se,W as de,X as we,Y as Z,V as ke,Z as $,$ as ee,a0 as te,a1 as Ie,a2 as Ue,a3 as Fe}from"./index-9WrTN1Ev.js";import{V as z,a as Ne}from"./VChip-D4sclpbQ.js";import{V as Re,a as N}from"./VRow-BtE0aTqm.js";import{V as Ae}from"./VTextarea-CRIN8sQx.js";import{V as Ee}from"./VSelect-CW528sZX.js";import{V as Oe}from"./VFileInput-IXkzaXfL.js";import{u as Le}from"./index-fUuoYNPw.js";import{V as Te}from"./VDataTable-De4YzEB4.js";import"./VPagination-C25dc1D4.js";const je=K({__name:"StatusChip",props:{defect:{type:Object,required:!0}},setup(y,{expose:t}){t();function v(f){switch(f){case k.DefectState.OPEN:return"Open";case k.DefectState.IN_WORK:return"In Work";case k.DefectState.REJECTED:return"Rejected";case k.DefectState.DONE:return"Done";default:return"Unknown"}}function e(f){switch(f){case k.DefectState.OPEN:return"green";case k.DefectState.IN_WORK:return"blue";case k.DefectState.REJECTED:return"red";case k.DefectState.DONE:return"grey";default:return"black"}}const n={toStatusText:v,toStatusColor:e};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}});function Pe(y,t,v,e,n,f){return c(),U(z,{color:e.toStatusColor(v.defect.status),text:e.toStatusText(v.defect.status),class:"text-uppercase",size:"small",label:""},null,8,["color","text"])}const he=G(je,[["render",Pe],["__file","/home/runner/work/cloud-porsche/cloud-porsche/cloud-dev-ui/src/components/StatusChip.vue"]]),qe=K({__name:"AddDefectPopup",props:re({defect:{type:Object,required:!0},patch:{type:Boolean,required:!0}},{modelValue:{type:Boolean},modelModifiers:{}}),emits:re(["save","patch","close"],["update:modelValue"]),setup(y,{expose:t,emit:v}){t();const e=_e(y,"modelValue"),n=y,f=J(()=>n.defect),s=J(()=>n.patch??!1);ae(f,()=>{h.value=n.defect.name??"",o.value=n.defect.location??"",r.value=n.defect.descriptionShort??"",m.value=n.defect.descriptionLong??"",D.value=n.defect.reportedDate?new Date(n.defect.reportedDate):new Date,E.value=n.defect.status,g.value=n.defect.image?new File([],n.defect.image,{type:"image/png"}):void 0});const h=u(n.defect.name??""),o=u(n.defect.location??""),r=u(n.defect.descriptionShort??""),m=u(n.defect.descriptionLong??""),D=u(n.defect.reportedDate?new Date(n.defect.reportedDate):new Date),g=u(n.defect.image?new File([],n.defect.image,{type:"image/png"}):void 0),E=u(n.defect.status),b=u(!1),x=p=>!!p||"This field is required.",F=v;function H(){b.value&&P()}const j=[p=>!p||!p.length||p[0].size<2e6||"File size should be less than 2MB",p=>!p||!p.length||p[0].type.startsWith("image/")||"File must be an image"];function P(){var R;const p={name:h.value,location:o.value,descriptionShort:r.value,descriptionLong:m.value,reportedDate:W(D.value),image:g.value?g.value.name===n.defect.image?n.defect.image:crypto.randomUUID()+"."+((R=g.value)==null?void 0:R.name.split(".").pop()):""};s.value?F("patch",[{...p,status:E.value},g.value,n.defect.image]):F("save",p,g.value),q()}function q(){e.value=!1}function W(p){const R=p.getTimezoneOffset();return new Date(p.getTime()-R*60*1e3)}const B={dialog:e,props:n,defectSubscription:f,patchSubscription:s,defectName:h,location:o,shortDescription:r,longDescription:m,defectDate:D,imageFile:g,status:E,valid:b,required:x,emit:F,validateForm:H,fileRules:j,saveDefect:P,closeDialog:q,toGmt0:W,get DefectState(){return k.DefectState}};return Object.defineProperty(B,"__isScriptSetup",{enumerable:!1,value:!0}),B}});function We(y,t,v,e,n,f){const s=Ve("v-date-input"),h=he;return c(),U(le,{modelValue:e.dialog,"onUpdate:modelValue":t[8]||(t[8]=o=>e.dialog=o),"max-width":"600"},{default:l(()=>[a(oe,null,{default:l(()=>[a(ce,null,{default:l(()=>[S(A(e.patchSubscription?"Change":"Add New")+" Defect ",1)]),_:1}),a(ue,null,{default:l(()=>[a(Se,{modelValue:e.valid,"onUpdate:modelValue":t[7]||(t[7]=o=>e.valid=o),onSubmit:be(e.validateForm,["prevent"])},{default:l(()=>[a(Re,{dense:""},{default:l(()=>[a(N,{cols:"12",md:"6"},{default:l(()=>[a(M,{label:"Defect Name*",modelValue:e.defectName,"onUpdate:modelValue":t[0]||(t[0]=o=>e.defectName=o),rules:[e.required]},null,8,["modelValue","rules"])]),_:1}),a(N,{cols:"12",md:"6"},{default:l(()=>[a(M,{label:"Location*",modelValue:e.location,"onUpdate:modelValue":t[1]||(t[1]=o=>e.location=o),rules:[e.required]},null,8,["modelValue","rules"])]),_:1}),a(N,{cols:"12"},{default:l(()=>[a(M,{label:"Short Description*",modelValue:e.shortDescription,"onUpdate:modelValue":t[2]||(t[2]=o=>e.shortDescription=o),rules:[e.required]},null,8,["modelValue","rules"])]),_:1}),a(N,{cols:"12"},{default:l(()=>[a(Ae,{label:"Long Description*",modelValue:e.longDescription,"onUpdate:modelValue":t[3]||(t[3]=o=>e.longDescription=o),rules:[e.required]},null,8,["modelValue","rules"])]),_:1}),a(N,{cols:e.patchSubscription?6:12},{default:l(()=>[a(s,{label:"Select a date*",modelValue:e.defectDate,"onUpdate:modelValue":t[4]||(t[4]=o=>e.defectDate=o),rules:[e.required]},null,8,["modelValue","rules"])]),_:1},8,["cols"]),e.patchSubscription?(c(),U(N,{key:0,cols:"6"},{default:l(()=>[a(Ee,{label:"Status",items:[e.DefectState.OPEN,e.DefectState.IN_WORK,e.DefectState.DONE,e.DefectState.REJECTED],modelValue:e.status,"onUpdate:modelValue":t[5]||(t[5]=o=>e.status=o)},{selection:l(({item:o})=>[a(h,{defect:{status:o.raw}},null,8,["defect"])]),item:l(({props:o,item:r})=>[a(xe,{props:o,onClick:o.onClick},{default:l(()=>[a(h,{defect:{status:r.raw}},null,8,["defect"])]),_:2},1032,["props","onClick"])]),_:1},8,["items","modelValue"])]),_:1})):Y("",!0),a(N,{cols:"12"},{default:l(()=>[a(Oe,{label:"Upload Image",rules:e.fileRules,"validate-on":"eager",modelValue:e.imageFile,"onUpdate:modelValue":t[6]||(t[6]=o=>e.imageFile=o),accept:"image/*","prepend-icon":"mdi-image"},null,8,["modelValue"])]),_:1})]),_:1}),t[9]||(t[9]=V("small",{class:"text-caption"},"*indicates required field",-1))]),_:1},8,["modelValue"])]),_:1}),a(O),a(fe,null,{default:l(()=>[a(me),a(I,{text:"Cancel",onClick:e.closeDialog},{default:l(()=>t[10]||(t[10]=[S("Cancel")])),_:1}),a(I,{disabled:!e.valid,color:"primary",onClick:e.validateForm},{default:l(()=>t[11]||(t[11]=[S(" Save ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"])}const Be=G(qe,[["render",We],["__file","/home/runner/work/cloud-porsche/cloud-porsche/cloud-dev-ui/src/components/AddDefectPopup.vue"]]),Me=K({__name:"SearchFilter",props:{loading:{type:Boolean,required:!0},error:{type:Boolean,required:!0}},emits:["updateList","refresh","add"],setup(y,{expose:t,emit:v}){t();const{mobile:e}=pe(),n=u(""),f=u("name"),s=v,h=y,o=J(()=>h.error);function r(){D()}function m(){D()}function D(){s("updateList",n.value,f.value)}const g={mobile:e,search:n,filter:f,emit:s,props:h,error:o,onInputChange:r,onFilterChange:m,emitUpdate:D,get useAppStore(){return ge}};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}}),Ye={class:"d-flex w-100 pb-1"};function ze(y,t,v,e,n,f){return c(),w(ve,null,[V("h1",Ye,[t[5]||(t[5]=S(" Defects ")),a(me),L(a(I,{"prepend-icon":e.mobile?void 0:"mdi-plus",icon:e.mobile?"mdi-plus":void 0,onClick:t[0]||(t[0]=s=>e.emit("add")),class:"me-2",text:e.mobile?"":"Add Defect",disabled:e.useAppStore().isUserRole},null,8,["prepend-icon","icon","text","disabled"]),[[T,e.useAppStore().isUserRole?"Not enough permissions!":"Add Defect"]]),L(a(I,{"prepend-icon":e.mobile?void 0:"mdi-refresh",icon:e.mobile?"mdi-refresh":void 0,onClick:t[1]||(t[1]=s=>e.emit("refresh")),loading:v.loading,color:e.error?"error":"primary",text:e.mobile?"":"Refresh"},null,8,["prepend-icon","icon","loading","color","text"]),[[T,"Refresh"]])]),a(O,{class:"pa-1",thickness:"0"}),a(M,{loading:v.loading,modelValue:e.search,"onUpdate:modelValue":t[2]||(t[2]=s=>e.search=s),density:"comfortable",label:"Search","prepend-inner-icon":"mdi-magnify",variant:"solo-filled",flat:"","hide-details":"","single-line":"",onInput:e.onInputChange,onKeydown:ye(e.onInputChange,["enter"]),clearable:"","onClick:clear":t[3]||(t[3]=s=>{e.search="",e.onInputChange()}),error:e.error},null,8,["loading","modelValue","error"]),a(O,{class:"pa-1",thickness:"0"}),a(Ne,{filter:"",modelValue:e.filter,"onUpdate:modelValue":t[4]||(t[4]=s=>e.filter=s),"selected-class":"text-primary",mandatory:"",onChange:e.onFilterChange},{default:l(()=>[a(z,{text:"ID",value:"id",variant:"outlined"}),a(z,{text:"Name",value:"name",variant:"outlined"}),a(z,{text:"Location",value:"location",variant:"outlined"})]),_:1},8,["modelValue"]),a(O,{class:"pa-1",thickness:"0"})],64)}const Je=G(Me,[["render",ze],["__file","/home/runner/work/cloud-porsche/cloud-porsche/cloud-dev-ui/src/components/SearchFilter.vue"]]),Ke=K({__name:"[id]",setup(y,{expose:t}){t();const{mobile:v}=pe(),e=u(!0),n=u(!1),f=u([]),s=u(!1),h=u(!1),o=Ce(),r=J(()=>o.params.id),m=u({open:!1,src:void 0});ae(s,i=>{i||j()});const D=u({}),g=u(void 0),E=[{title:"ID",value:"id",sortable:!0,maxWidth:"100px"},{title:"Name",value:"name",sortable:!0,maxWidth:"100px",nowrap:!0},{title:"Location",value:"location",sortable:!0,maxWidth:"100px",nowrap:!0},{title:"Description Short",value:"descriptionShort",sortable:!0,maxWidth:"120px",nowrap:!0},{title:"Description Long",value:"descriptionLong",sortable:!0,maxWidth:"100px",nowrap:!0},{title:"Reported Date",value:"reportedDate",nowrap:!0},{title:"Status",value:"status",sortable:!0,maxWidth:"100px"},{title:"Image",value:"signedImage",sortable:!1,nowrap:!0,maxWidth:"150px"},{title:"Actions",value:"actions",sortable:!1,nowrap:!0,maxWidth:"100px"}];x(),ae(r,()=>{x()});function b(i){e.value=!1,n.value=!0}function x(){if(!r.value){console.error("Property ID is missing");return}e.value=!0,X(`/v1/defects?propertyId=${r.value}`).json().then(async i=>{f.value=await Promise.all(i.map(async d=>(d.signedImage=await F(d.image),d))),e.value=!1,n.value=!1}).catch(b)}async function F(i){if(!i)return"";try{const d=await X(`/v1/storage/${i}`);if(!d.ok)throw new Error("Failed to fetch signed URL");const{signedUrl:C}=await d.json();return C}catch(d){return console.error("Error fetching signed URL:",d),""}}function H(){s.value=!0}function j(){s.value=!1,setTimeout(()=>D.value={},100)}function P(i){D.value=i,s.value=!0}function q(i){if(!i){console.error("No defect to delete");return}g.value=i,h.value=!0}function W(i,d){if(i.propertyId=r.value,e.value=!0,d){const C=new File([d],i.image,{type:d.type}),_=new FormData;_.append("file",C),ie("/v1/storage/upload",_).then(()=>se("/v1/defects",i).then(()=>{x()})).catch(b)}else se("/v1/defects",i).then(()=>{x()}).catch(b);s.value=!1}function B(i,d){if(!r.value){console.error("Property ID is missing");return}e.value=!0,X(`/v1/defects/search?search=${i}&filter=${d}&propertyId=${r.value}`).json().then(async C=>{f.value=await Promise.all(C.map(async _=>(_.signedImage=await F(_.image),_))),e.value=!1,n.value=!1}).catch(b)}function p(i){e.value=!0,de(`/v1/defects/${i}`).then(()=>{x()}),h.value=!1}function R(i,d,C,_){if(e.value=!0,C&&d.image&&_!==d.image){const De=new File([C],d.image,{type:C.type}),Q=new FormData;Q.append("file",De),(_?we(`/v1/storage/upload/${_}`,Q):ie("/v1/storage/upload",Q)).then(()=>Z(`/v1/defects/${i}`,d).then(()=>{x()})).catch(b)}else!C&&_?de(`/v1/storage/${_}`).then(()=>{Z(`/v1/defects/${i}`,d).then(()=>{x()})}).catch(b):Z(`/v1/defects/${i}`,d).then(()=>{x()}).catch(b)}const ne={mobile:v,loading:e,error:n,defects:f,dialog:s,confirmDialog:h,route:o,id:r,inspectedImage:m,activeDefect:D,toDelete:g,headers:E,errHandler:b,refetch:x,fetchImage:F,openDialog:H,closeDialog:j,editDialog:P,initiateDeletion:q,handleSave:W,handleUpdateList:B,deleteDefect:p,patchDefect:R,StatusChip:he,get useDateFormat(){return Le},get useAppStore(){return ge}};return Object.defineProperty(ne,"__isScriptSetup",{enumerable:!1,value:!0}),ne}}),Ge={class:"d-flex align-center justify-center fill-height"},He={class:"d-flex align-center justify-center fill-height"},Qe=["colspan"],Xe={key:0},Ze={key:1},$e={key:2},et={class:"d-flex align-center justify-start fill-height"},tt={class:"d-flex align-center justify-start fill-height"},at={key:1},ot={key:3},lt={key:4},nt={class:"d-flex flex-column align-center justify-center fill-height"},rt={class:"d-flex align-center justify-center fill-height"};function it(y,t,v,e,n,f){const s=Je,h=Be;return c(),w("div",null,[a(ke,null,{default:l(()=>[a(s,{onUpdateList:e.handleUpdateList,onRefresh:t[0]||(t[0]=o=>e.refetch()),onAdd:e.openDialog,error:e.error,loading:e.loading},null,8,["error","loading"]),a(Te,{class:"data-table rounded",mobile:e.mobile,density:"comfortable","no-data-text":e.error?"A network error occurred ⚡":"No defects found",items:e.defects,headers:e.headers,"items-per-page-options":[{value:5,title:"5"},{value:10,title:"10"},{value:25,title:"25"},{value:-1,title:"All"}],"show-expand":"","multi-sort":""},{"item.status":l(({item:o})=>[a(e.StatusChip,{defect:o},null,8,["defect"])]),"item.reportedDate":l(({item:o})=>[S(A(e.useDateFormat(o.reportedDate,"MM.DD.YYYY")),1)]),"item.signedImage":l(({item:o})=>{var r;return[((r=o.signedImage)==null?void 0:r.length)>0?(c(),U(te,{key:0,src:o.signedImage,class:"cursor-pointer","aspect-ratio":"1",contain:"",onClick:m=>e.inspectedImage={open:!0,src:o.signedImage}},{error:l(()=>[V("div",Ge,[a($,{color:"error",icon:"mdi-image-broken-variant"})])]),placeholder:l(()=>[V("div",He,[a(ee,{size:"24",indeterminate:""})])]),_:2},1032,["src","onClick"])):Y("",!0)]}),"item.actions":l(({item:o})=>[L(a(I,{icon:"mdi-pencil",onClick:r=>e.editDialog(o),variant:"plain",disabled:e.useAppStore().isUserRole},null,8,["onClick","disabled"]),[[T,e.useAppStore().isUserRole?"Not enough permissions!":"Edit"]])]),"expanded-row":l(({columns:o,item:r})=>[V("tr",null,[V("td",{colspan:o.length,class:"pa-5"},[(c(!0),w(ve,null,Ie(o,m=>{var D;return c(),w("div",{key:m.value,class:"expanded-defect pa-2"},[V("strong",null,A(m.title),1),m.value==="reportedDate"?(c(),w("div",Xe,A(e.useDateFormat(r.reportedDate,"MM.DD.YYYY HH:mm")),1)):m.value==="status"?(c(),w("div",Ze,[a(e.StatusChip,{defect:r},null,8,["defect"])])):m.value==="signedImage"?(c(),w("div",$e,[((D=r.signedImage)==null?void 0:D.length)>0?(c(),U(te,{key:0,src:r.signedImage,class:"cursor-pointer",contain:"",position:"left","max-height":"300",onClick:g=>e.inspectedImage={open:!0,src:r.signedImage}},{error:l(()=>[V("div",et,[L(a($,{color:"error",size:"50",icon:"mdi-image-broken-variant"},null,512),[[T,"Corrupted or missing Image"]])])]),placeholder:l(()=>[V("div",tt,[a(ee,{indeterminate:""})])]),_:2},1032,["src","onClick"])):(c(),w("i",at,"No image."))])):m.value==="actions"?(c(),w("div",ot,[L((c(),U(I,{"prepend-icon":"mdi-pencil",class:"me-2",onClick:g=>e.editDialog(r),variant:"tonal",disabled:e.useAppStore().isUserRole},{default:l(()=>[...t[8]||(t[8]=[S("Edit ")])]),_:2},1032,["onClick","disabled"])),[[T,e.useAppStore().isUserRole?"Not enough permissions!":"Edit"]]),a(I,{"prepend-icon":"mdi-delete",color:"error",onClick:g=>e.initiateDeletion(r),variant:"flat",disabled:e.useAppStore().isUserRole},{default:l(()=>[t[9]||(t[9]=S("Delete ")),a(Fe,{disabled:!e.useAppStore().isUserRole,activator:"parent",text:"Not enough permissions!"},null,8,["disabled"])]),_:2},1032,["onClick","disabled"])])):(c(),w("div",lt,A(r[m.value]),1)),m.title!==""?(c(),U(O,{key:5,class:"mt-2"})):Y("",!0)])}),128))],8,Qe)])]),_:1},8,["mobile","no-data-text","items"]),a(le,{modelValue:e.inspectedImage.open,"onUpdate:modelValue":t[2]||(t[2]=o=>e.inspectedImage.open=o),"max-width":"50%","max-height":"80%"},{default:l(()=>[a(oe,{rounded:"",class:"d-flex flex-row overflow-hidden"},{default:l(()=>[e.inspectedImage.src?(c(),U(te,{key:0,src:e.inspectedImage.src,contain:"","max-height":"100%","min-height":"300",rounded:"",onClick:t[1]||(t[1]=o=>e.inspectedImage={open:!1,src:void 0})},{error:l(()=>[V("div",nt,[a($,{color:"error",size:"100",icon:"mdi-image-broken-variant"}),t[10]||(t[10]=V("i",{class:"pa-2 text-red-lighten-3"},"Corrupted or missing Image.",-1))])]),placeholder:l(()=>[V("div",rt,[a(ee,{indeterminate:""})])]),_:1},8,["src"])):Y("",!0)]),_:1})]),_:1},8,["modelValue"]),a(h,{modelValue:e.dialog,"onUpdate:modelValue":t[3]||(t[3]=o=>e.dialog=o),defect:e.activeDefect,patch:!!e.activeDefect.id,onSave:e.handleSave,onPatch:t[4]||(t[4]=o=>e.patchDefect(e.activeDefect.id,o[0],o[1],o[2]))},null,8,["modelValue","defect","patch"])]),_:1}),a(le,{modelValue:e.confirmDialog,"onUpdate:modelValue":t[7]||(t[7]=o=>e.confirmDialog=o),"max-width":"400"},{default:l(()=>[a(oe,null,{default:l(()=>[a(ce,null,{default:l(()=>t[11]||(t[11]=[S("Confirm Delete")])),_:1}),a(Ue,null,{default:l(()=>[S("Defect name: "+A(e.toDelete.name),1)]),_:1}),a(ue,null,{default:l(()=>t[12]||(t[12]=[S("Are you sure you want to delete this defect?")])),_:1}),a(fe,null,{default:l(()=>[a(I,{variant:"text",onClick:t[5]||(t[5]=o=>e.confirmDialog=!1)},{default:l(()=>t[13]||(t[13]=[S("Cancel")])),_:1}),a(I,{color:"error",variant:"flat",onClick:t[6]||(t[6]=o=>e.deleteDefect(e.toDelete.id)),autofocus:""},{default:l(()=>t[14]||(t[14]=[S(" Delete ")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])])}const ht=G(Ke,[["render",it],["__file","/home/runner/work/cloud-porsche/cloud-porsche/cloud-dev-ui/src/pages/[tenantId]/defects/[id].vue"]]);export{ht as default};

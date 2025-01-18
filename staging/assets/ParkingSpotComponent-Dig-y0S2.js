import{d as b,r as v,j as s,u as R,_ as y,o as i,k as S,l as o,w as r,c as u,a3 as O,I as p,br as w,z as V,A as h,b as l,B as f,q as T,L as F,Z as D,J as I,C as A,t as c,G as U,M as B}from"./index-9WrTN1Ev.js";import{u as N}from"./index-fUuoYNPw.js";import{V as z}from"./VDataTable-De4YzEB4.js";import{V as G}from"./VSelect-CW528sZX.js";import{V as C}from"./VChip-D4sclpbQ.js";import{V as j,a as q}from"./VRow-BtE0aTqm.js";import"./VPagination-C25dc1D4.js";const H=b({__name:"ParkingSpotComponent",props:{spot:{type:Object,required:!0},disableDialog:{type:Boolean,required:!1},explanation:{type:String,required:!1}},emits:["stateChange"],setup(_,{expose:t,emit:e}){t();const a=e,g=v(!1);function k(d){switch(d){case s.ParkingSpotState.FREE:return;case s.ParkingSpotState.OCCUPIED:return"green";case s.ParkingSpotState.RESERVED:return"yellow";case s.ParkingSpotState.OUT_OF_ORDER:return"red";case s.ParkingSpotState.CHARGING:return"blue";default:return"black"}}function n(d){switch(d){case s.ParkingSpotState.FREE:return"Free";case s.ParkingSpotState.OCCUPIED:return"Occupied";case s.ParkingSpotState.RESERVED:return"Reserved";case s.ParkingSpotState.OUT_OF_ORDER:return"Out of Order";case s.ParkingSpotState.CHARGING:return"Charging";default:return"Unknown"}}function m(d){a("stateChange",d)}function P(){g.value=!0}function E(){g.value=!1}const x={emit:a,inspectDialog:g,getStateColor:k,toStatusText:n,emitStateChange:m,openDialog:P,closeDialog:E,get ParkingSpotState(){return s.ParkingSpotState},get useDateFormat(){return N},get useAppStore(){return R}};return Object.defineProperty(x,"__isScriptSetup",{enumerable:!1,value:!0}),x}}),Y={key:1,class:"mdi mdi-flash text-yellow"},L={class:"d-flex text-center align-center"},M={key:0},J={key:1};function Z(_,t,e,a,g,k){return i(),S("div",null,[o(V,{color:a.getStateColor(e.spot.state),onClick:t[0]||(t[0]=n=>e.disableDialog?void 0:a.openDialog()),disabled:e.spot.placeholder,border:"",flat:"",class:w([e.spot.placeholder?"disabled-spot":"","spot d-flex align-center justify-center"])},{default:r(()=>[e.explanation?(i(),u(O,{key:0,activator:"parent",text:e.explanation,location:"bottom"},null,8,["text"])):p("",!0),e.spot.electricCharging?(i(),S("i",Y)):p("",!0)]),_:1},8,["color","disabled","class"]),o(B,{modelValue:a.inspectDialog,"onUpdate:modelValue":t[3]||(t[3]=n=>a.inspectDialog=n),"max-width":"50%","max-height":"80%"},{default:r(()=>[o(V,{rounded:"",class:"overflow-hidden"},{default:r(()=>[o(h,null,{default:r(()=>[l("span",L,[t[5]||(t[5]=f("Parking Spot Details ")),o(T),o(F,{icon:"",variant:"flat",onClick:t[1]||(t[1]=n=>a.closeDialog())},{default:r(()=>[o(D,null,{default:r(()=>t[4]||(t[4]=[f("mdi-close")])),_:1})]),_:1})])]),_:1}),o(I),o(A,null,{default:r(()=>[e.spot?(i(),u(z,{key:0,density:"compact","hide-default-header":"","hide-default-footer":""},{body:r(()=>[l("tr",null,[t[6]||(t[6]=l("td",null,"ID",-1)),l("td",null,c(e.spot.id),1)]),l("tr",null,[t[7]||(t[7]=l("td",null,"State",-1)),l("td",null,[a.useAppStore().hasAdminAccess?(i(),u(G,{key:0,variant:"plain","model-value":e.spot.state,"onUpdate:modelValue":t[2]||(t[2]=n=>a.emitStateChange(n)),items:[a.ParkingSpotState.FREE,a.ParkingSpotState.RESERVED,a.ParkingSpotState.OUT_OF_ORDER],"menu-icon":"mdi-pencil"},{selection:r(({item:n})=>[o(C,{color:a.getStateColor(n.raw),text:a.toStatusText(n.raw),class:"text-uppercase",size:"small",label:""},null,8,["color","text"])]),item:r(({props:n,item:m})=>[o(U,{props:n,onClick:n.onClick},{default:r(()=>[o(C,{color:a.getStateColor(m.raw),text:a.toStatusText(m.raw),class:"text-uppercase",size:"small",label:""},null,8,["color","text"])]),_:2},1032,["props","onClick"])]),_:1},8,["model-value","items"])):(i(),u(C,{key:1,color:a.getStateColor(e.spot.state),text:a.toStatusText(e.spot.state),class:"text-uppercase",size:"small",label:""},null,8,["color","text"]))])]),l("tr",null,[t[8]||(t[8]=l("td",null,"Last State Change",-1)),l("td",null,c(a.useDateFormat(e.spot.lastStateChange,"DD.MM.YYYY HH:mm:ss")),1)]),l("tr",null,[t[9]||(t[9]=l("td",null,"Is electric charging spot?",-1)),l("td",null,[o(D,{color:e.spot.electricCharging?"green":"red"},{default:r(()=>[f(c(e.spot.electricCharging?"mdi-check-circle":"mdi-minus-circle"),1)]),_:1},8,["color"])])]),e.spot.currentCharge?(i(),S("tr",M,[t[10]||(t[10]=l("td",null,"Current charge",-1)),l("td",null,c(e.spot.currentCharge)+"%",1)])):p("",!0),e.spot.customer?(i(),S("tr",J,[t[11]||(t[11]=l("td",null,"Parked Car",-1)),l("td",null,c(e.spot.customer.licensePlate),1)])):p("",!0)]),_:1})):(i(),u(j,{key:1},{default:r(()=>[o(q,null,{default:r(()=>t[12]||(t[12]=[f(" No parking spot selected.")])),_:1})]),_:1}))]),_:1})]),_:1})]),_:1},8,["modelValue"])])}const at=y(H,[["render",Z],["__scopeId","data-v-df6771a3"],["__file","/home/runner/work/cloud-porsche/cloud-porsche/cloud-dev-ui/src/components/ParkingSpotComponent.vue"]]);export{at as default};

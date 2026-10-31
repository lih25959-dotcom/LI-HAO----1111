import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {ArrowLeft,ArrowRight,RotateCcw,RotateCw,Maximize2,Check,Menu, X} from 'lucide-react';
import './gundam-app.css';

const steps=[
 ['01','脚掌组件 01-1','从 B2 取出脚掌关节骨架，按说明书 FRONT 标记确定朝向。先装上 G2 连接件，再将关节翻转到图示角度。','右脚掌关节',['B2 × 1','G2 × 1'],'说明书第 4 页 · 01-1'],
 ['02','脚掌组件 01-2','将脚掌内构与踝关节接合；再依次扣上 A10、D1、F1 等外甲。左右脚用相同流程各制作一组。','脚掌外甲',['E1 22','H1 3 / H1 4','A1 10','D1 1','F1 0'],'说明书第 4 页 · 01-2'],
 ['03','右腿骨架 02-1','将 B3 预装骨架沿箭头方向展开。安装 G1 与 G2 关节件，注意关节朝前且左右件方向不同。','右腿内构',['B3','G1 × 1','G2 × 1','G2 0 × 1'],'说明书第 5 页 · 02-1'],
 ['04','右腿膝部 02-2','在膝关节内侧先装 A1 12，再按顺序安装 D1 10、F1 6、D1 1 等小型连接甲片。','右膝关节',['A1 12','D1 10','F1 6','D1 1'],'说明书第 5 页 · 02-2'],
 ['05','右小腿装甲 02-3','合拢膝部连接，确认关节可以弯曲。将 E1 5 与 G2 4 装到小腿下方。','右小腿下段',['E1 5','G2 4'],'说明书第 5 页 · 02-3'],
 ['06','右腿外甲 02-4','把 H5、H6 侧甲扣到小腿两侧，接入 B1 连接件。对齐卡榫后再压紧，避免扭转关节。','右小腿侧甲',['H5','H6','B1'],'说明书第 5 页 · 02-4'],
 ['07','右腿完成 02-5 至 02-8','补齐外侧甲片与脚踝装饰件，按图检查左右活动方向。此处说明书提示先轻柔活动关节。','完成的右腿',['A1 10','G2 5','D1 5','F1 2','G1 8 / G1 9'],'说明书第 5–6 页 · 02-5—02-8'],
 ['08','左腿骨架 03-1','按右腿镜像组装左腿。注意零件编号与朝向并非全部左右通用，逐项对照图示。','左腿内构',['B3','G1','G2 1','G2 2'],'说明书第 6 页 · 03-1'],
 ['09','左腿外甲 03-2 至 03-6','依次安装膝部结构、小腿前后甲和侧甲，再接上脚掌。完成后轻轻弯曲关节确认活动。','完成的左腿',['D1 10','A1 16','A1 18 / A1 19','E1 15','D1 32'],'说明书第 6–7 页 · 03-2—03-6'],
 ['10','腰部组件 04-1','组合腰部中央骨架和前裙甲。核对左右活动件的方向，确认裙甲转轴没有被夹住。','腰部组件',['G4 1','G4 6 / G4 7','A1 35 / A1 36','G4 2'],'说明书第 7 页 · 04-1'],
 ['11','下半身连接检查','将双腿安装到腰部关节，检查脚掌朝前、左右腿对称，关节活动顺畅。后续步骤请继续以官方说明书为准。','双腿与腰部',['已完成右腿','已完成左腿','腰部组件'],'说明书第 7 页起'],
];

function makeModel(scene,step){
 const root=new THREE.Group(), parts=[];scene.add(root);
 const mat=(c,m=.3)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:.32});
 const white=mat(0xe9e9e4),navy=mat(0x172b46,.55),red=mat(0xc91d36,.45),gold=mat(0xdcae52,.65),gray=mat(0x67727d,.65);
 const box=(x,y,z,a,b,c,m,g)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),m);o.position.set(x,y,z);o.userData.part=g;root.add(o);parts.push(o);return o;};
 const sph=(x,y,z,a,b,c,m,g)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(1,20,16),m);o.scale.set(a,b,c);o.position.set(x,y,z);o.userData.part=g;root.add(o);parts.push(o);return o;};
 const cyl=(x,y,z,r,R,h,m,g)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,R,h,8),m);o.position.set(x,y,z);o.userData.part=g;root.add(o);parts.push(o);return o;};
 // Feet, legs, waist, torso
 for(const s of [-1,1]){box(s*.43,-2.02,.16,.5,.22,.78,white,'feet');box(s*.43,-1.54,0,.38,.91,.42,white,'legs');box(s*.43,-1.5,.23,.25,.52,.07,red,'legs');box(s*.43,-.98,0,.44,.25,.48,navy,'legs');}
 box(0,-.63,0,.88,.42,.55,navy,'waist');box(0,-.63,.3,.5,.3,.1,gold,'waist');box(0,.05,0,1.02,1.05,.62,white,'torso');box(0,.1,.34,.68,.55,.16,navy,'torso');box(0,.11,.44,.28,.28,.06,red,'torso');
 for(const s of [-1,1]){sph(s*.87,.5,0,.43,.35,.4,white,'arms');box(s*1.1,.04,0,.32,.83,.38,white,'arms');box(s*1.1,-.42,.05,.29,.28,.32,navy,'arms');box(s*1.1,.02,.23,.19,.48,.06,red,'arms');}
 // head and V fin
 box(0,.96,0,.46,.5,.4,white,'head');box(0,.87,.22,.3,.27,.12,navy,'head');box(0,.96,.3,.22,.055,.035,red,'head');for(const s of [-1,1]){const h=cyl(s*.22,1.31,0,.025,.14,.68,gold,'head');h.rotation.z=-s*.5;}
 // backpack and shield
 box(0,.05,-.48,.65,.88,.35,navy,'backpack');for(const s of [-1,1]){box(s*.42,-.05,-.62,.23,.82,.25,gray,'backpack');box(s*1.38,.32,-.03,.18,1.2,.38,white,'shield');box(s*1.38,.3,.18,.12,.72,.04,red,'shield');}
 // Step visibility: previous parts are subdued ghost parts; current operation highlighted.
 const ranges={feet:[0,2],legs:[1,2],waist:[1,3],torso:[4,5],arms:[6,7],shield:[7,7],head:[8,8],backpack:[9,9]};
 const stepGroup=step===0?'tools':step<=1?'legs':step<=2?'feet':step<=3?'waist':step<=5?'torso':step<=7?'arms':step===8?'head':step===9?'backpack':'all';
 parts.forEach(p=>{const range=ranges[p.userData.part];p.visible=step===0||step===10||step>=range?.[0];if(step>0&&step<10&&p.userData.part===stepGroup){p.material=p.material.clone();p.material.emissive=new THREE.Color('#1f9aa5');p.material.emissiveIntensity=.42;} });
 root.rotation.y=-.25;return {root,parts};
}
function Viewer({step,turn}){const ref=useRef(null);useEffect(()=>{const host=ref.current;if(!host)return;const scene=new THREE.Scene();scene.background=new THREE.Color('#111619');scene.fog=new THREE.Fog('#111619',9,18);const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(4,2.2,7);const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;host.appendChild(renderer.domElement);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,-.25,0);scene.add(new THREE.HemisphereLight(0xe6f2ff,0x25313a,2));const l=new THREE.DirectionalLight(0xffffff,3);l.position.set(4,6,5);scene.add(l);const rim=new THREE.PointLight(0x27c8d4,24,9);rim.position.set(-3,1,3);scene.add(rim);const floor=new THREE.Mesh(new THREE.CircleGeometry(3,64),new THREE.MeshStandardMaterial({color:0x192226,roughness:.8}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.3;scene.add(floor);const grid=new THREE.GridHelper(8,32,0x34464a,0x263438);grid.position.y=-2.29;scene.add(grid);const model=makeModel(scene,step);model.root.rotation.y+=turn*Math.PI/2;let frame;const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};resize();const ro=new ResizeObserver(resize);ro.observe(host);const draw=()=>{frame=requestAnimationFrame(draw);controls.update();renderer.render(scene,camera);};draw();return()=>{cancelAnimationFrame(frame);ro.disconnect();controls.dispose();renderer.dispose();model.parts.forEach(p=>p.geometry.dispose());host.replaceChildren();};},[step,turn]);return <div ref={ref} className="viewer-canvas"/>;}
function App(){const [step,setStep]=useState(0),[turn,setTurn]=useState(0),[list,setList]=useState(true);const current=steps[step];return <div className="app-shell"><header className="app-header"><div className="brand"><span className="brand-mark">RX<span>0</span></span><div><b>GUNPLA STUDIO</b><small>RG 1/144 · BUILD ALONG</small></div></div><div className="header-center"><span>独角兽高达</span><i>/</i><span>RX-0 UNICORN GUNDAM · RG #25</span></div><button className="header-button" onClick={()=>setList(v=>!v)}>{list?<X size={16}/>:<Menu size={16}/>}<span>{list?'收起步骤':'步骤目录'}</span></button></header><main className="app-main"><aside className={`step-sidebar ${list?'':'collapsed'}`}><div className="sidebar-title"><span>OFFICIAL MANUAL ORDER</span><b>组装步骤 <small>{String(step+1).padStart(2,'0')} / {steps.length}</small></b></div><div className="steps-scroll">{steps.map(([n,title],i)=><button key={n} className={`step-row ${i===step?'selected':''} ${i<step?'done':''}`} onClick={()=>setStep(i)}><span className="step-number">{i<step?<Check size={13}/>:n}</span><span>{title}</span><i/></button>)}</div><div className="sidebar-note"><span className="live-dot"/> 根据万代说明书整理</div></aside><section className="work-area"><div className="work-top"><div><span>STEP {current[0]}　/　{steps.length}　·　{current[5]}</span><h1>{current[1]}</h1></div><div className="view-tools"><button title="向左旋转" onClick={()=>setTurn(t=>t-1)}><RotateCcw size={16}/></button><button title="向右旋转" onClick={()=>setTurn(t=>t+1)}><RotateCw size={16}/></button><button title="重置视角" onClick={()=>setTurn(0)}><Maximize2 size={15}/></button></div></div><div className="model-frame"><Viewer step={step} turn={turn}/><div className="model-caption"><span>RX-0 / UNICORN GUNDAM</span><span>拖动旋转　·　滚轮缩放</span></div><div className="model-axis"><span>X</span><span>Y</span><span>Z</span></div><div className="model-disclaimer">3D 示意模型　·　零件外形为近似重建，请以说明书图示为准</div></div><div className="instruction-card"><div className="instruction-icon">{current[0]}</div><div className="instruction-copy"><span>本步说明　/　{current[3]}</span><p>{current[2]}</p><a href="https://manual.bandai-hobby.net/pdf/674.pdf" target="_blank" rel="noreferrer">打开万代官方说明书 ↗</a></div><div className="parts-card"><small>本步零件编号</small><b>{current[4].join(' · ')}</b><span>编号按说明书板件标注；左右件和装配朝向请对照原图。</span></div></div><footer className="work-footer"><span>步骤已按官方手册顺序整理，3D 细节会逐步补齐。</span><div><button disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}><ArrowLeft size={15}/> 上一步</button><button className="next-button" onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))}>{step===steps.length-1?'完成组装':'下一步'} <ArrowRight size={15}/></button></div></footer></section></main></div>;}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

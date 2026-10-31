import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import './GundamLab.css';

const steps = ['头部与独角', '躯干与胸甲', '双臂与护肩', '腿部与推进器', '完成：觉醒形态'];

function makeMecha(scene, step, awakened) {
  const root = new THREE.Group(); scene.add(root);
  const white = new THREE.MeshStandardMaterial({ color: awakened ? 0xe9f4ff : 0xe9e8df, metalness: .32, roughness: .28 });
  const navy = new THREE.MeshStandardMaterial({ color: 0x18283d, metalness: .48, roughness: .3 });
  const red = new THREE.MeshStandardMaterial({ color: awakened ? 0x46e6ff : 0xc91e38, emissive: awakened ? 0x10a9d5 : 0x240008, emissiveIntensity: awakened ? 1.6 : .35, metalness: .3, roughness: .3 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe8ad3e, metalness: .7, roughness: .24 });
  const parts = [];
  const box = (x,y,z,sx,sy,sz,mat,group='body',bevel=.12) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat); mesh.position.set(x,y,z); mesh.userData.group=group; root.add(mesh); parts.push(mesh); return mesh; };
  const sphere = (x,y,z,sx,sy,sz,mat,group='body') => { const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),mat); mesh.scale.set(sx,sy,sz); mesh.position.set(x,y,z); mesh.userData.group=group; root.add(mesh); parts.push(mesh); return mesh; };
  const cylinder = (x,y,z,r1,r2,h,mat,group='body') => {const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,6),mat);m.position.set(x,y,z);m.userData.group=group;root.add(m);parts.push(m);return m;};
  const show = group => step >= ({head:0,body:1,arms:2,legs:3}[group] ?? 0);
  // Legs
  for (const s of [-1,1]) {box(s*.48,-1.55,0,.38,1.15,.48,white,'legs');box(s*.48,-1.9,.12,.43,.48,.62,navy,'legs');box(s*.48,-1.5,.26,.32,.45,.08,red,'legs');box(s*.48,-2.17,.12,.55,.2,.8,white,'legs');box(s*.48,-.95,0,.46,.3,.52,navy,'legs');}
  // Torso and waist
  box(0,.1,0,1.04,1.12,.62,white); box(0,.25,.34,.68,.62,.18,navy); box(0,.24,.45,.27,.31,.08,red); box(0,-.62,0,.86,.38,.58,navy); box(0,-.62,.33,.5,.3,.12,gold);
  // Shoulders and arms
  for(const s of [-1,1]){sphere(s*.86,.53,0,.46,.38,.43,white,'arms');box(s*1.12,-.08,0,.34,.88,.4,white,'arms');box(s*1.12,-.62,.04,.3,.32,.34,navy,'arms');box(s*1.12,-.08,.23,.22,.56,.09,red,'arms');}
  // Head, face, V-fin
  box(0,.98,0,.48,.55,.42,white,'head');box(0,.87,.23,.32,.29,.12,navy,'head');box(0,.96,.31,.25,.06,.04,red,'head');
  for(const s of [-1,1]){const horn=cylinder(s*.27,1.35,.02,.035,.17,.72,gold,'head');horn.rotation.z=s*-.48;box(s*.19,1.17,.11,.1,.22,.12,gold,'head');}
  if(awakened){ for(let i=0;i<5;i++) {const shard=box((i-2)*.32,-.05, -.45,.08,.9,.05,red,'arms');shard.rotation.z=(i-2)*.14;} }
  root.position.y=.05;
  parts.forEach(p=>{const g=p.userData.group;p.visible=show(g); if(!p.visible){p.position.y+=g==='head'?1.4:g==='arms'?(p.position.x>0?.45:-.45):g==='legs'?-1.1:0;} });
  root.rotation.y=-.24;
  return {root,parts};
}

export default function GundamLab(){
  const mount=useRef(null), [step,setStep]=useState(4), [awakened,setAwakened]=useState(false), [running,setRunning]=useState(false);
  useEffect(()=>{
    if(!mount.current)return;
    const scene=new THREE.Scene(); scene.background=new THREE.Color('#111619'); scene.fog=new THREE.Fog('#111619',8,18);
    const camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(4.2,2.7,7.5);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;mount.current.appendChild(renderer.domElement);
    const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=4;controls.maxDistance=11;controls.target.set(0,-.15,0);
    scene.add(new THREE.HemisphereLight(0xddeeff,0x29333a,2));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(4,7,5);scene.add(key);const rim=new THREE.PointLight(0x39dff0,32,10);rim.position.set(-3,1,3);scene.add(rim);
    const floor=new THREE.Mesh(new THREE.CircleGeometry(3,64),new THREE.MeshStandardMaterial({color:0x172024,roughness:.7}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.32;scene.add(floor);
    const grid=new THREE.GridHelper(8,32,0x36535a,0x23343a);grid.position.y=-2.3;scene.add(grid);
    let model=makeMecha(scene,step,awakened), frame;const resize=()=>{const w=mount.current.clientWidth,h=mount.current.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};resize();const ro=new ResizeObserver(resize);ro.observe(mount.current);
    const render=()=>{frame=requestAnimationFrame(render);controls.update();renderer.render(scene,camera);};render();
    return()=>{cancelAnimationFrame(frame);ro.disconnect();controls.dispose();renderer.dispose();model.parts.forEach(p=>{p.geometry.dispose();});mount.current?.replaceChildren();};
  },[step,awakened]);
  useEffect(()=>{if(!running)return;const timer=setInterval(()=>setStep(v=>{if(v>=4){setRunning(false);return 4;}return v+1;}),1100);return()=>clearInterval(timer);},[running]);
  return <section className="gundam-lab" id="model-lab"><div className="lab-top"><a href="#home"><ArrowLeft size={15}/> 返回作品集</a><span>INTERACTIVE BUILD / 01</span></div><div className="lab-heading"><div><span className="lab-kicker">模型组装可视化　·　3D EXPERIENCE</span><h1>UNICORN<br/><em>GUNDAM</em></h1></div><p>从零件到觉醒。<br/>亲手完成你的独角兽组装。</p></div><div className="lab-stage"><div className="lab-canvas" ref={mount}/><div className="lab-hud"><span>RX-0　/　UNICORN MODE</span><span>DRAG TO ROTATE　·　SCROLL TO ZOOM</span></div><div className="lab-badge"><i/> {awakened?'DESTROY MODE':'UNICORN MODE'}</div></div><div className="lab-controls"><div className="step-list">{steps.map((s,i)=><button key={s} className={step===i?'active':''} onClick={()=>{setRunning(false);setStep(i);}}><small>0{i+1}</small><span>{s}</span></button>)}</div><div className="lab-actions"><button onClick={()=>setStep(v=>Math.max(0,v-1))} aria-label="上一步"><ArrowLeft size={17}/></button><button className="assemble" onClick={()=>{if(step===4)setStep(0);setRunning(true);}}>{running?'ASSEMBLING...':'开始组装　/　ASSEMBLE'} <ArrowRight size={16}/></button><button onClick={()=>{setStep(4);setRunning(false);}} aria-label="重置"><RotateCcw size={16}/></button><button className={`mode-toggle ${awakened?'on':''}`} onClick={()=>setAwakened(v=>!v)}>{awakened?'觉醒模式 ON':'觉醒模式 OFF'}</button></div></div><div className="lab-foot"><span>※ 造型为程序化几何体搭建的交互演示模型</span><span>THREE.JS　/　BUILT FOR CURIOSITY</span></div></section>;
}

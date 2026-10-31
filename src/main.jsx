import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, X } from 'lucide-react';
import { AuroraSurface, DeferredCarousel, MotionVideo } from './components/DeferredMedia';
import Masonry from './components/Masonry';
import SpotlightCard from './components/SpotlightCard';
import PillNav from './components/PillNav';
import './style.css';
import './hero.css';

const portfolioImages = [
  { src: '/images/li-ling-01.webp', alt: '红白队服造型的人像摄影，城市天台场景', title: '人物肖像 01', subtitle: 'Portrait / Outdoor' },
  { src: '/images/li-ling-02.webp', alt: '红白队服与护具造型的人像摄影', title: '电竞风格人像 01', subtitle: 'Portrait / Editorial' },
  { src: '/images/li-ling-03.webp', alt: '红白服装造型与天台栏杆背景的人像摄影', title: '人物肖像 02', subtitle: 'Portrait / Daylight' },
  { src: '/images/li-ling-04.webp', alt: '低机位拍摄的红白服装角色人像', title: '角色影像 01', subtitle: 'Character / Perspective' },
  { src: '/images/li-ling-05.webp', alt: '红白队服与银色道具的人像摄影', title: '电竞风格人像 02', subtitle: 'Portrait / Detail' },
  { src: '/images/li-ling-06.webp', alt: '黑红舞台造型与近景手势的人像摄影', title: '舞台肖像 01', subtitle: 'Portrait / Stage' },
  { src: '/images/li-ling-07.webp', alt: '黑色礼服造型与暗色网格背景的人像摄影', title: '舞台肖像 02', subtitle: 'Portrait / Low-key' },
  { src: '/images/li-ling-08.webp', alt: '蓝白角色造型与舞台灯光的人像摄影', title: '角色影像 02', subtitle: 'Character / Stage' },
  { src: '/images/li-ling-09.webp', alt: '黑色衬衫造型的近景人像摄影', title: '人物肖像 03', subtitle: 'Portrait / Close-up' },
  { src: '/images/li-ling-10.webp', alt: '黑红服装造型与网格背景的全身人像摄影', title: '舞台肖像 03', subtitle: 'Portrait / Full-length' },
];
const skills = [
  ['01', '影像叙事', '从洞察到镜头语言，让每一帧都有它存在的理由。', 'STORY / DIRECTION'],
  ['02', '摄影摄像', '熟悉现场调度与光线控制，适应多类型拍摄环境。', 'CAMERA / LIGHT'],
  ['03', '剪辑节奏', '用节奏、声音与细节，建立作品的情绪曲线。', 'EDIT / SOUND'],
  ['04', '内容策划', '兼顾表达与传播，让创意自然落在真实需求里。', 'IDEA / STRATEGY'],
];
const experiences = [
  { period: '2019.03 — 2020.06', company: '成都禾沐阳光文化传媒', role: '摄像 / 后期主管', details: ['负责活动宣传、广告 TVC 等项目的摄影与后期制作。', '服务成都市公安局、武侯消防、成都银行、贝壳找房、电子科技大学等客户。'] },
  { period: '2020.06 — 2023.03', company: '成都市龙泉驿区人民法院', role: '政治部宣传岗工作人员', details: ['策划并导演单位各类宣传片及普法视频。', '策划并开展各类普法教育活动。'] },
  { period: '2023.03 — 2024.03', company: '深圳市飒和电竞科技有限公司（4AM）', role: '摄像 / 后期', details: ['拍摄明星选手 33Svan，制作抖音短视频、直播切片与日常 VLOG。', '拍摄剪辑俱乐部宣传片、出征片及 VLOG。'] },
  { period: '2024.03 — 2024.10', company: '全玩汇网络科技有限公司（AG）', role: '视频编导 / 摄影剪辑', details: ['负责 33Svan、诚C 的抖音内容规划，完成热点选题、创意策划、脚本撰写与拍摄统筹。', '完成后期剪辑，拍摄俱乐部宣传片、出征片及 VLOG。'] },
  { period: '2024.10 — 2025.02', company: '杭州艾及帝文化创意有限公司（LGD）', role: '视频编导 / 摄像后期', details: ['负责和平精英分部抖音短视频、直播切片、活动切片与日常 VLOG。'] },
  { period: '2025.02 — 至今', company: '竞颖文化传媒（上海）有限公司', role: '视频编导 / 摄影剪辑', details: ['负责选手诚C的抖音内容规划、热点选题、创意脚本与拍摄统筹，完成后期剪辑。', '拍摄俱乐部宣传片、出征片及 VLOG。'] },
];
const videos = [
  { title: '拍摄日常 VLOG 01', type: '拍摄 VLOG', category: 'vlog', format: '横屏 · 16:9', duration: '03:44', src: '/videos/vlog-01.mp4', cover: '/video-covers/vlog-01.webp' },
  { title: '拍摄日常 VLOG 02', type: '拍摄 VLOG', category: 'vlog', format: '横屏 · 16:9', duration: '03:45', src: '/videos/vlog-02.mp4', cover: '/video-covers/vlog-02.webp' },
  { title: '拍摄日常 VLOG 03', type: '拍摄 VLOG', category: 'vlog', format: '横屏 · 16:9', duration: '02:36', src: '/videos/vlog-03.mp4', cover: '/video-covers/vlog-03.webp' },
  { title: '拍摄现场完整记录', type: '拍摄 VLOG', category: 'vlog', format: '横屏 · 16:9', duration: '16:38', src: '/videos/vlog-04.mp4', cover: '/video-covers/vlog-04.webp' },
  { title: '33Svan 拍摄日常', type: '拍摄 VLOG', category: 'vlog', format: '横屏 · 16:9', duration: '03:47', src: '/videos/vlog-05.mp4', cover: '/video-covers/vlog-05.webp' },
  { title: '诚C 生日特别企划', type: '拍摄 VLOG', category: 'vlog', format: '横屏 · 16:9', duration: '02:05', src: '/videos/vlog-06.mp4', cover: '/video-covers/vlog-06.webp' },
  { title: '春决大屏拍摄 VLOG', type: '拍摄 VLOG', category: 'vlog', format: '横屏 · 16:9', duration: '04:17', src: '/videos/vlog-07.mp4', cover: '/video-covers/vlog-07.webp' },
  { title: '人物高光剪辑', type: '颜值短视频', category: 'portrait', format: '横屏 · 3:2', duration: '00:14', src: '/videos/portrait-01.mp4', cover: '/video-covers/portrait-01.webp' },
  { title: 'YZZ · 人物短片', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:16', duration: '00:12', src: '/videos/portrait-02.mp4', cover: '/video-covers/portrait-02.webp' },
  { title: '狼队联动视频', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:16', duration: '02:22', src: '/videos/portrait-03.mp4', cover: '/video-covers/portrait-03.webp' },
  { title: '33Svan · 镜头片段 01', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:16', duration: '00:08', src: '/videos/portrait-04.mp4', cover: '/video-covers/portrait-04.webp' },
  { title: '33Svan · 镜头片段 02', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:16', duration: '00:13', src: '/videos/portrait-05.mp4', cover: '/video-covers/portrait-05.webp' },
  { title: '33Svan · 镜头片段 03', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:16', duration: '00:08', src: '/videos/portrait-06.mp4', cover: '/video-covers/portrait-06.webp' },
  { title: '33Svan · 镜头片段 06', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:16', duration: '00:10', src: '/videos/portrait-07.mp4', cover: '/video-covers/portrait-07.webp' },
  { title: '33Svan · 镜头片段 08', type: '颜值短视频', category: 'portrait', format: '横屏 · 4:3', duration: '00:23', src: '/videos/portrait-08.mp4', cover: '/video-covers/portrait-08.webp' },
  { title: '33Svan · 镜头片段 10', type: '颜值短视频', category: 'portrait', format: '横屏 · 4:3', duration: '00:13', src: '/videos/portrait-09.mp4', cover: '/video-covers/portrait-09.webp' },
  { title: '33Svan · 镜头片段 11', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:19', duration: '00:10', src: '/videos/portrait-10.mp4', cover: '/video-covers/portrait-10.webp' },
  { title: '33Svan · 镜头片段 13', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:19', duration: '00:19', src: '/videos/portrait-11.mp4', cover: '/video-covers/portrait-11.webp' },
  { title: '33Svan · 镜头片段 14', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:19', duration: '00:10', src: '/videos/portrait-12.mp4', cover: '/video-covers/portrait-12.webp' },
  { title: '诚C · 短视频 01', type: '颜值短视频', category: 'portrait', format: '方形 · 1:1', duration: '00:15', src: '/videos/portrait-13.mp4', cover: '/video-covers/portrait-13.webp' },
  { title: '诚C · 镜头片段 04', type: '颜值短视频', category: 'portrait', format: '横屏 · 3:2', duration: '00:17', src: '/videos/portrait-14.mp4', cover: '/video-covers/portrait-14.webp' },
  { title: '诚C · 短视频 02', type: '颜值短视频', category: 'portrait', format: '横屏 · 16:9', duration: '00:11', src: '/videos/portrait-15.mp4', cover: '/video-covers/portrait-15.webp' },
  { title: '诚C · 短视频 03', type: '颜值短视频', category: 'portrait', format: '横屏 · 16:9', duration: '00:08', src: '/videos/portrait-16.mp4', cover: '/video-covers/portrait-16.webp' },
  { title: '诚C · 短视频 05', type: '颜值短视频', category: 'portrait', format: '横屏 · 4:3', duration: '00:11', src: '/videos/portrait-17.mp4', cover: '/video-covers/portrait-17.webp' },
  { title: '诚C · 短视频 06', type: '颜值短视频', category: 'portrait', format: '竖屏 · 9:16', duration: '00:12', src: '/videos/portrait-18.mp4', cover: '/video-covers/portrait-18.webp' },
  { title: '麦克人形雷达锁定成功', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '00:53', src: '/videos/game-01.mp4', cover: '/video-covers/game-01.webp' },
  { title: '要奥义还是要紫甲', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '00:36', src: '/videos/game-02.mp4', cover: '/video-covers/game-02.webp' },
  { title: '武田信忠：玩的少熟练度越高', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '00:49', src: '/videos/game-03.mp4', cover: '/video-covers/game-03.webp' },
  { title: '糕手胡桃：夺得天选只需击败一人', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '00:44', src: '/videos/game-04.mp4', cover: '/video-covers/game-04.webp' },
  { title: '无伤回阳境？砍我一刀算我输', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '00:28', src: '/videos/game-05.mp4', cover: '/video-covers/game-05.webp' },
  { title: '麦克和妹妹双排', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '01:02', src: '/videos/game-06.mp4', cover: '/video-covers/game-06.webp' },
  { title: '麦克进货来了', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '00:42', src: '/videos/game-07.mp4', cover: '/video-covers/game-07.webp' },
  { title: '麦克「冠军皮肤」上线？', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '00:39', src: '/videos/game-08.mp4', cover: '/video-covers/game-08.webp' },
  { title: '红皮胡为「斩马刀」首次实战', type: '游戏内容剪辑', category: 'game', format: '竖屏 · 9:16', duration: '01:04', src: '/videos/game-09.mp4', cover: '/video-covers/game-09.webp' },
];
const siteNav = [
  ['home', '首页', 'HOME'],
  ['resume-cover', '关于我', 'ABOUT'],
  ['experience', '工作经历', 'CAREER'],
  ['work', '图片作品', 'PHOTO'],
  ['videos', '视频作品', 'FILM'],
  ['strengths', '个人能力', 'CAPABILITIES'],
];

function AuroraLayer() {
  return <AuroraSurface
      speed={0.28}
      scale={1.9}
      brightness={1.3}
      color1="#ef3151"
      color2="#315dff"
      bandHeight={0.52}
      bandSpread={0.88}
      noiseAmplitude={1.8}
      noiseFrequency={2.15}
      enableMouseInteraction
      mouseInfluence={0.12}
      spectrum={0.55}
      colorSpeed={0.9}
      tilt={12}
      octaveDecay={0.18}
      layerOffset={0.38}
      clickPulse={false}
      opacity={0.78}
    />;
}

function App() {
  useEffect(() => {
    // React mounts after the browser's first hash lookup on a cold visit.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }, []);
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoFilter, setVideoFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('home');
  const filteredVideos = useMemo(() => videoFilter === 'all' ? videos : videos.filter(video => video.category === videoFilter), [videoFilter]);
  const masonryVideoItems = useMemo(() => filteredVideos.map(video => {
    const [, width = '1', height = '1'] = video.format.match(/(\d+)\s*:\s*(\d+)/) || [];
    return {
      id: video.src,
      img: video.cover,
      width: Number(width),
      height: Number(height),
      title: video.title,
      alt: `${video.title} 视频封面`,
      type: video.type,
      format: video.format,
      duration: video.duration,
      footerHeight: 68,
      playable: true,
    };
  }), [filteredVideos]);
  useEffect(() => {
    const sections = siteNav.map(([id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !Element.prototype.animate) return undefined;

    const root = document.documentElement;
    const activeAnimations = new Set();

    // Register the existing editorial layout with the motion system.
    // Keep the content visible unless it is actually observed and animated.
    const motionTargets = [
      ['.section-tag', 'eyebrow'],
      ['.intro-text .small-label', 'eyebrow'],
      ['.experience-heading h2, .work-heading h2, .video-heading h2, .strength-head h2, .contact-copy h2, .intro-text h2', 'headline'],
      ['.experience-heading p, .work-heading p, .video-heading p, .strength-head p, .intro-text p, .contact-detail', 'copy'],
      ['.portrait-frame', 'image'],
      ['.experience-card, .skill-card, .stats > div', 'card'],
    ];
    motionTargets.forEach(([selector, type]) => {
      document.querySelectorAll(`main ${selector}`).forEach(node => node.dataset.motion = type);
    });
    const sectionWords = [
      ['experience', '.experience-heading', 'EXPERIENCE'],
      ['work', '.work-heading', 'SELECTED WORK'],
      ['videos', '.video-heading', 'MOVING IMAGE'],
      ['strengths', '.strength-head', 'CAPABILITIES'],
      ['contact', '.contact-copy', 'CONTACT'],
    ];
    sectionWords.forEach(([id, selector, word]) => {
      const host = document.querySelector(`#${id} ${selector}`);
      if (!host) return;
      host.classList.add('motion-heading-host');
      const label = document.createElement('span');
      label.className = 'section-word';
      label.dataset.motion = 'word';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = word;
      host.prepend(label);
    });
    root.classList.add('motion-ready');
    const run = (element, keyframes, options) => {
      if (!element) return;
      element.style.willChange = 'transform, opacity, clip-path';
      const animation = element.animate(keyframes, { fill: 'forwards', ...options });
      activeAnimations.add(animation);
      const release = () => {
        element.style.willChange = '';
        activeAnimations.delete(animation);
      };
      animation.oncancel = release;
      animation.onfinish = () => {
        // Retain final appearance without a permanent forwards-filling animation.
        if (animation.commitStyles) {
          animation.commitStyles();
          animation.cancel();
        } else {
          Object.entries(keyframes.at(-1)).forEach(([key, value]) => { element.style[key] = value; });
          animation.cancel();
        }
        release();
      };
    };

    const revealHero = hero => {
      run(hero.querySelector('.hero-video'), [
        { transform: 'scale(1.12)', filter: 'brightness(.18) saturate(.5)', opacity: .36 },
        { transform: 'scale(1)', filter: 'brightness(.32) saturate(.72)', opacity: .72 }
      ], { duration: 1900, easing: 'cubic-bezier(.16,1,.3,1)' });
      hero.querySelectorAll('.hero-backdrop-title span').forEach((title, index) => run(title, [
        { opacity: 0, clipPath: 'inset(0 0 100% 0)', transform: 'translate3d(0,72px,0) scaleY(.78)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0) scaleY(1)' }
      ], { duration: 1400, delay: 270 + index * 170, easing: 'cubic-bezier(.16,1,.3,1)' }));
      run(hero.querySelector('.hero-photo-card'), [
        { opacity: 0, clipPath: 'inset(0 0 100% 0)', transform: 'translate3d(0,56px,0) rotate(-8deg) scale(.96)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0) rotate(-4deg) scale(1)' }
      ], { duration: 1500, delay: 560, easing: 'cubic-bezier(.16,1,.3,1)' });
      run(hero.querySelector('.hero-meta'), [
        { opacity: 0, transform: 'translate3d(0,18px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 850, delay: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
      hero.querySelectorAll('.hero-copy .eyebrow').forEach(node => run(node, [
        { opacity: 0, transform: 'translate3d(0,20px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 850, delay: 420, easing: 'cubic-bezier(.22,1,.36,1)' }));
      hero.querySelectorAll('.hero h1 > span').forEach((node, index) => run(node, [
        { opacity: 0, clipPath: 'inset(100% 0 0 0)', transform: 'translate3d(0,78px,0) scaleY(.72)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0) scaleY(1)' }
      ], { duration: 1480, delay: 500 + index * 180, easing: 'cubic-bezier(.16,1,.3,1)' }));
      hero.querySelectorAll('.hero-resume-row').forEach((node, index) => run(node, [
        { opacity: 0, transform: 'translate3d(0,20px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 850, delay: 1120 + index * 130, easing: 'cubic-bezier(.22,1,.36,1)' }));
      ['.hero-statement', '.hero-copy p', '.hero-copy .round-link', '.hero-sticker', '.hero-meta-bottom', '.hero-bottom'].forEach((selector, index) => {
        const node = hero.querySelector(selector);
        const from = selector === '.hero-sticker'
          ? 'translate3d(0,48px,0) rotate(-19deg) scale(.82)'
          : 'translate3d(0,30px,0) scale(.98)';
        const to = selector === '.hero-sticker'
          ? 'translate3d(0,0,0) rotate(-9deg) scale(1)'
          : 'translate3d(0,0,0) scale(1)';
        run(node, [{ opacity: 0, transform: from }, { opacity: 1, transform: to }], {
          duration: 1050, delay: 820 + index * 110, easing: 'cubic-bezier(.22,1,.36,1)'
        });
      });
    };

    const revealSection = section => {
      if (section.id === 'resume-cover') revealHero(section);
      const fast = window.innerWidth < 640;
      const scaleDuration = fast ? .84 : 1;
      section.querySelectorAll('[data-motion="word"]').forEach(node => run(node, [
        { opacity: 0, clipPath: 'inset(0 0 100% 0)', transform: 'translate3d(-.035em,42px,0) scale(1.08)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: 1350 * scaleDuration, easing: 'cubic-bezier(.76,0,.2,1)' }));
      section.querySelectorAll('[data-motion="eyebrow"]').forEach((node, index) => run(node, [
        { opacity: 0, transform: 'translate3d(0,24px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 760 * scaleDuration, delay: 100 + index * 55, easing: 'cubic-bezier(.22,1,.36,1)' }));
      section.querySelectorAll('[data-motion="headline"]').forEach((node, index) => run(node, [
        { opacity: 0, transform: 'translate3d(0,86px,0) scale(.88)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: 1200 * scaleDuration, delay: 240 + index * 70, easing: 'cubic-bezier(.16,1,.3,1)' }));
      section.querySelectorAll('[data-motion="copy"]').forEach((node, index) => run(node, [
        { opacity: 0, transform: 'translate3d(0,28px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], { duration: 900 * scaleDuration, delay: 480 + index * 90, easing: 'cubic-bezier(.22,1,.36,1)' }));
      section.querySelectorAll('[data-motion="image"], [data-motion="media"]').forEach((node, index) => run(node, [
        { opacity: 0, clipPath: 'inset(0 0 100% 0)', transform: 'scale(1.055)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }
      ], { duration: 1450 * scaleDuration, delay: 590 + index * 100, easing: 'cubic-bezier(.76,0,.2,1)' }));
      section.querySelectorAll('[data-motion="card"]').forEach((node, index) => run(node, [
        { opacity: 0, transform: 'translate3d(0,64px,0) scale(.955)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: 970 * scaleDuration, delay: 650 + index * 105, easing: 'cubic-bezier(.2,.85,.25,1)' }));
    };

    const sections = [...document.querySelectorAll('main section[id]:not(#home)')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        revealSection(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -14% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));

    return () => {
      observer.disconnect();
      activeAnimations.forEach(animation => animation.cancel());
      document.querySelectorAll('.section-word').forEach(node => node.remove());
      document.querySelectorAll('[data-motion]').forEach(node => delete node.dataset.motion);
      document.querySelectorAll('.motion-heading-host').forEach(node => node.classList.remove('motion-heading-host'));
      root.classList.remove('motion-ready');
    };
  }, []);
  return <>
    <header className="topbar topbar-floating">
      <a className="wordmark" href="#home"><span className="mark">Li.</span><span>李令 <small>LI LING / VISUAL CREATOR</small></span></a>
      <nav aria-label="网站主导航">{siteNav.map(([id, label, en], index) => <a key={id} href={`#${id}`} className={activeSection === id ? 'is-active' : ''} aria-current={activeSection === id ? 'location' : undefined}><small>{String(index + 1).padStart(2, '0')}</small><span>{label}</span><i>{en}</i></a>)}</nav>
      <a className="contact-pill" href="#contact">开始合作 <ArrowUpRight size={15}/></a>
    </header>
    <main>
      <section className="opening-cover" id="home" aria-label="李令作品集封面">
        <div className="opening-cover__topline"><span>LI LING　/　VISUAL CREATOR</span><span>PORTFOLIO　2026</span></div>
        <div className="opening-cover__frame">
          <MotionVideo className="opening-cover__motion" src="/images/opening-cover-motion.mp4" poster="/images/opening-cover-night.webp" aria-hidden="true" />
          <img className="opening-cover__portrait" src="/images/opening-cover-night.webp" alt="黄昏中的未来城市与漂浮建筑" width="1440" height="1924" fetchPriority="high" decoding="async" />
          <h1>LI LING</h1>
          <p>PHOTOGRAPHER　·　EDITOR　·　DIRECTOR</p>
          <span className="opening-cover__index">VISUAL JOURNAL　/　01</span>
        </div>
        <a className="opening-cover__scroll" href="#resume-cover"><span>SCROLL TO EXPLORE</span><ArrowDown size={14}/></a>
      </section>
      <section className="hero" id="resume-cover">
        <MotionVideo className="hero-video" src="https://videos.pexels.com/video-files/3129595/3129595-hd_1920_1080_25fps.mp4" poster="/images/li-ling-01.webp" />
        <div className="hero-shade" />
        <div className="hero-meta"><span><i className="live-dot"/> VISUAL CREATOR　/　PORTFOLIO</span><span>SHANGHAI / CN　　2026</span></div>
        <div className="hero-backdrop-title" aria-hidden="true"><span>ABOUT</span><span>ME</span></div>
        <figure className="hero-photo-card">
          <span className="hero-photo-hanger" aria-hidden="true" />
          <img className="hero-photo-black" src="/images/li-portrait.webp" alt="身穿黑色衬衫的李令人像" width="810" height="1080" loading="lazy" decoding="async" />
          <figcaption><span>PORTRAIT STUDY　/　2025</span><b>LI LING — VISUAL JOURNAL</b></figcaption>
          <span className="hero-photo-index" aria-hidden="true">01 / 10</span>
        </figure>
        <div className="hero-side-note">PHOTOGRAPHY<br/>VIDEO EDITING<br/>CONTENT DIRECTION</div>
        <div className="hero-copy">
          <div className="eyebrow">PHOTOGRAPHER　/　EDITOR　/　DIRECTOR</div>
          <h1><span className="hero-name-cn">李令</span><span className="hero-name-en">LI LING</span></h1>
          <div className="hero-statement"><span className="statement-mark">影像创作人</span><span>让真实，自然发生。</span></div>
          <p>以镜头观察，以内容表达。<br/>从创意构思、现场拍摄到后期剪辑，<br/>为值得被看见的故事找到自己的方式。</p>
          <div className="hero-resume-summary"><span>PROFILE　/　2026</span></div>
          <div className="hero-about-details">
            <p>摄影师、短视频剪辑、内容编导。相信好的内容始于真实观察，也成于准确表达；在商业表达与个人视角之间寻找平衡，让作品既有温度，也有清晰方向。</p>
            <div className="hero-about-contact"><span>手机　17323287245</span><span>微信　FQMZling</span><span>邮箱　903796528@qq.com</span></div>
          </div>
          <div className="hero-resume-career">
            <div className="hero-career-heading"><span>工作经历</span><small>WORK EXPERIENCE</small></div>
            <div className="hero-resume-row"><time>2019.03 — 2023.03</time><span>品牌影像　/　活动拍摄与宣传纪录</span></div>
            <div className="hero-resume-row"><time>2023.03 — 2025.02</time><span>电竞俱乐部　/　人物内容与 VLOG</span></div>
            <div className="hero-resume-row"><time>2025.02 — 至今</time><span>内容编导　/　摄影剪辑</span></div>
          </div>
          <div className="hero-about-stats"><span><b>06<small>+</small></b><i>年影像创作</i></span><span><b>80<small>+</small></b><i>完成项目</i></span><span><b>12<small>M</small></b><i>内容累计播放</i></span></div>
          <a className="round-link" href="#work"><span>探索作品</span><span className="round-icon"><ArrowDown size={17}/></span></a>
        </div>
        <div className="hero-meta-bottom"><span>INTERNET VISUALS<br/>PORTFOLIO 2026</span><span>PORTRAIT　·　DIRECTION　·　EDITING</span></div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE　 ↓</span><span>01 — 06</span></div>
      </section>
      <section className="experience-section section-wrap aurora-surface" id="experience">
        <AuroraLayer />
        <div className="section-tag"><span>02 / EXPERIENCE</span><span>工作经历　( 2019 — 至今 )</span></div>
        <div className="experience-heading">
          <h2>一路拍摄，<br/><em>一路记录。</em></h2>
          <p>从品牌宣传与普法内容，到电竞与人物影像。<br/>持续用镜头讲述真实、具体的人和故事。</p>
        </div>
        <div className="experience-timeline">
          <svg className="experience-track" viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
            <path className="experience-zigzag" d="M20 82 L100 35 L190 112 L355 55 L500 112 L655 42 L810 98 L980 48" />
            <path className="experience-baseline" d="M0 82 H1000" />
            {[20, 190, 355, 500, 655, 980].map((x, i) => <circle key={i} cx={x} cy={82} r={i % 2 ? 6 : 8} />)}
          </svg>
          {experiences.map((job, index) => (
            <article
              className={`experience-card ${index % 2 === 0 ? 'experience-card-top' : 'experience-card-bottom'}`}
              key={job.period}
              style={{ gridColumn: Math.floor(index / 2) + 1, gridRow: index % 2 === 0 ? 1 : 2 }}
            >
              <div className="experience-card-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="experience-period">{job.period}</div>
              <h3>{job.company}</h3>
              <div className="experience-role">{job.role}</div>
              <ul>{job.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="work-section section-wrap aurora-surface" id="work"><AuroraLayer/><div className="section-tag"><span>03 / SELECTED WORK</span><span>精选项目　( 2024 — 2025 )</span></div><div className="work-heading"><h2>影像留下的，<br/><em>不止是画面。</em></h2><p>每个项目都是一次新的观察。<br/>以下作品涵盖品牌影像、人物记录与内容创作。</p></div>
        <div className="work-carousel-frame">
          <DeferredCarousel
            items={portfolioImages}
            preset="orbit"
            intro="assemble"
            cardWidth={240}
            aspectRatio={0.72}
            gap={38}
            speed={7}
            captions={false}
            tilt={-12}
            perspective={2100}
            momentum={0.58}
            parallax={0.24}
            stretch={0.32}
            fadeColor="#171815"
            depthFade={0.3}
            innerShade={0.5}
            cornerRadius={10}
          />
        </div>
        <a className="all-work" href="#contact"><span>想看更多项目？欢迎联系我</span><ArrowUpRight size={17}/></a>
      </section>
      <section className="video-section section-wrap aurora-surface" id="videos">
        <AuroraLayer />
        <div className="section-tag"><span>04 / MOVING IMAGE</span><span>视频作品　( 34 FILMS )</span></div>
        <div className="video-heading"><h2>让画面继续，<br/><em>让故事发生。</em></h2><p>从现场记录到人物短片，再到游戏内容剪辑。<br/>不同节奏，同样认真对待每一帧。</p></div>
        <PillNav
          className="video-filter-nav"
          items={[
            { label: '全部作品　34' },
            { label: 'VLOG长视频' },
            { label: '颜值短视频　18' },
            { label: '游戏剪辑　09' },
          ]}
          defaultActiveIndex={0}
          onItemClick={(_, index) => setVideoFilter(['all', 'vlog', 'portrait', 'game'][index])}
          theme="dark"
          layout="joined"
          size="lg"
          surface="glass"
          itemStyle="pill"
          hoverEffect="fill"
          indicator="pill"
          highlightColor="#ef3151"
          highlightTextColor="#ffffff"
          collapse="auto"
          ariaLabel="视频作品分类"
        />
        <div className="video-masonry-frame">
          <Masonry
            items={masonryVideoItems}
            columnWidth={280}
            gap={20}
            radius={8}
            animateFrom="bottom"
            stagger={0.045}
            duration={0.65}
            hoverEffect="zoom"
            captions="none"
            lightbox={false}
            draggable={false}
            onItemClick={item => {
              const selected = filteredVideos.find(video => video.src === item.id);
              if (selected) setActiveVideo(selected);
            }}
          />
        </div>
      </section>
      <section className="strength-section section-wrap aurora-surface" id="strengths"><AuroraLayer/><div className="section-tag"><span>05 / WHAT I DO</span><span>我的工作方式</span></div><div className="strength-head"><h2>从想法开始，<br/><em>到作品为止。</em></h2><p>完整的创作视角，让想法能够落地，<br/>也让最终成片保留最初的心意。</p></div><div className="skill-grid">{skills.map(s=><SpotlightCard key={s[0]} className="skill-card" theme="dark" spotlightColor="rgba(239,49,81,.72)" intensity={0.28} spotlightSize={270} softness={0.78} borderGlow={0.86} proximity={65} smoothing={0.18} grain={0.06} flare style={{'--spotlight-card-surface':'rgba(17,18,16,.56)','--spotlight-card-border':'rgba(255,255,255,.14)','--spotlight-card-shadow':'none'}}><div className="skill-top"><span>{s[0]}　/　CAPABILITY</span><ArrowUpRight size={17}/></div><div><span className="skill-en">{s[3]}</span><h3>{s[1]}</h3><p>{s[2]}</p></div><div className="skill-rule"><span/></div></SpotlightCard>)}</div></section>
      <section className="contact-section" id="contact">
        <div className="contact-orbit orbit-a"/><div className="contact-orbit orbit-b"/>
        <div className="contact-inner">
          <div className="section-tag"><span>06 / CONTACT</span><span>保持联系</span></div>
          <div className="contact-content">
            <div className="contact-copy">
              <span className="small-label">HAVE A STORY TO TELL?</span>
              <h2>下一段故事，<br/><em>一起开始。</em></h2>
            </div>
            <div className="contact-details" aria-label="联系方式">
              <div className="contact-detail"><span>PHONE <i>手机</i></span><strong>17323287245</strong></div>
              <div className="contact-detail"><span>WECHAT <i>微信</i></span><strong>FQMZling</strong></div>
              <div className="contact-detail"><span>EMAIL <i>邮箱</i></span><strong>903796528@qq.com</strong></div>
            </div>
          </div>
          <div className="contact-bottom"><span>摄影 / 剪辑 / 内容编导</span><span>LI LING / VISUAL CREATOR</span><span>© 2025 LI LING STUDIO</span></div>
        </div>
      </section>
    </main>
    {activeVideo && <div className="video-modal" role="presentation" onClick={() => setActiveVideo(null)} onKeyDown={event => { if (event.key === 'Escape') setActiveVideo(null); }}><div className={`video-modal-panel ${activeVideo.format.startsWith('竖屏') ? 'is-portrait' : ''}`} role="dialog" aria-modal="true" aria-label={activeVideo.title} onClick={event => event.stopPropagation()}><button className="video-modal-close" onClick={() => setActiveVideo(null)} aria-label="关闭播放器"><X size={20}/></button><video key={activeVideo.src} src={activeVideo.src} poster={activeVideo.cover} controls autoPlay playsInline preload="metadata"/><div className="video-modal-caption"><span>{activeVideo.type}　/　{activeVideo.format}</span><strong>{activeVideo.title}</strong></div></div></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

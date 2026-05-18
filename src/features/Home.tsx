"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast';
import { fetchHomeData } from '../store/homeSlice';
import type { RootState, AppDispatch } from '../store/store';
import { formatDate } from '../common/functions';

interface SectionHeaderProps {
  title: string;
  sub?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  color?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  sub, 
  action, 
  align = 'left', 
  color = 'var(--ink)' 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: align === 'center' ? 'column' : 'row', 
      alignItems: align === 'center' ? 'center' : 'flex-start', 
      justifyContent: align === 'center' ? 'center' : 'space-between', 
      marginBottom: 'clamp(20px, 5vw, 32px)', 
      textAlign: align as any,
      gap: 'clamp(16px, 3vw, 24px)',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 className="display" style={{ fontSize: 'clamp(24px, 6vw, 36px)', color: color, lineHeight: 1.1 }}>{title}</h2>
        {sub && <div style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'var(--ink-muted)', marginTop: 'clamp(8px, 2vw, 12px)', maxWidth: 600, margin: align === 'center' ? '8px auto 0' : '8px 0 0' }}>{sub}</div>}
      </div>
      {action && <div style={{ marginTop: align === 'center' ? 'clamp(16px, 3vw, 24px)' : 0, flexShrink: 0 }}>{action}</div>}
    </div>
  );
};

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, homeData } = useSelector((state: RootState) => state.home);
  const { nearestData } = useSelector((state: RootState) => state.global);

  const [now, setNow] = React.useState(0);
  React.useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const [d, h, m, s, lunarData] = useMemo(() => {
    if (!nearestData?.upcomingFestival?.Date) return [0,0,0,0, []];

    const targetDate = new Date(
      nearestData?.upcomingFestival?.Date + "T00:00:00"
    );
    const diff = targetDate.getTime() - now;
    const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const h = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const m = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const s = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

    const nearestFestival = {...nearestData?.upcomingFestival, tag: 'Festival'};
    const nearestAmavasya = {...nearestData?.upcomingAmavasya, tag: 'Amavasya', Date: nearestData?.upcomingAmavasya?.AmavasyaDate};
    const nearestEkadashi = {...nearestData?.upcomingEkadashi, tag: 'Ekadashi', highlight: true };
    const nearestPurnima = {...nearestData?.upcomingPurnima, tag: 'Purnima', Date: nearestData?.upcomingPurnima?.PurnimaDate};

    const lunarData = [nearestAmavasya, nearestEkadashi, nearestPurnima, nearestFestival];
    return [d, h, m, s, lunarData];

  }, [nearestData, now]);

  useEffect(() => {
    if (!homeData) {
      dispatch(fetchHomeData());
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load landing page data: ${error}`);
    }
  }, [error]);

  const handleExternalLink = (link: string) => {
    if (link?.length > 0) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="page-enter" style={{ paddingBottom: 0 }}>
      
      {/* 1. Impactful Full-Screen Hero Section */}
      <div style={{
          position: 'relative',
          minHeight: 'clamp(60vh, 95vh, 100vh)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: `linear-gradient(to bottom, rgba(30, 20, 16, 0.4), rgba(30, 20, 16, 0.85)), url("${homeData?.LandingPageBlock?.[0]?.HeroImage?.url || ''}") center/cover no-repeat`,
          color: '#fff',
          padding: 'clamp(80px, 15vw, 140px) clamp(16px, 5vw, 40px) clamp(100px, 15vw, 180px)',
          textAlign: 'center',
          marginTop: '72px'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div className="eyebrow" style={{ color: 'var(--gold-bright)', marginBottom: 'clamp(12px, 2vw, 16px)', letterSpacing: '0.2em', fontSize: 'clamp(10px, 2vw, 12px)' }}>{homeData?.LandingPageBlock?.[0]?.SubHeading || ''}</div>
            <h1 className="display" style={{ fontSize: 'clamp(28px, 8vw, 72px)', lineHeight: 1.05, marginBottom: 'clamp(16px, 3vw, 24px)', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                {homeData?.LandingPageBlock?.[0]?.Heading || ''}
            </h1>
            <p style={{ fontSize: 'clamp(14px, 3vw, 20px)', opacity: 0.95, marginBottom: 'clamp(24px, 5vw, 40px)', textShadow: '0 2px 10px rgba(0,0,0,0.6)', fontWeight: 400, lineHeight: 1.6 }}>
                {homeData?.LandingPageBlock?.[0]?.Description || ''}
            </p>
            <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 20px)', justifyContent: 'center', flexWrap: 'wrap' }}>
                {homeData?.LandingPageBlock?.[0]?.HeroLink?.map((link: { id: number; label: string; href: string; isExternal: boolean; Button_Style: string }) => {
                  if (link?.Button_Style === 'PRIMARY') {
                    return <button key={link?.id} className="btn btn-primary" style={{ padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)', fontSize: 'clamp(13px, 2vw, 16px)', borderRadius: 12 }} onClick={() => { if (link?.isExternal) {
                      handleExternalLink(link?.href);
                    } else {
                      router.push(link?.href || '/');
                    }}}>{link?.label || ''} → </button>
                  } else {
                    return <button key={link?.id} className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)', fontSize: 'clamp(13px, 2vw, 16px)', borderRadius: 12, backdropFilter: 'blur(4px)' }} onClick={() => { if (link?.isExternal) {
                      handleExternalLink(link?.href);
                    } else {
                      router.push(link?.href || '/');
                    }}}>{link?.label || ''}</button>
                  }
                })}
            </div>
        </div>
      </div>

      {/* Floating Trackers (Nearest Sacred Day + Countdown) overlapping the hero */}
      <div className="container" style={{ marginTop: 'clamp(-60px, -10vw, -100px)', position: 'relative', zIndex: 10, marginBottom: 'clamp(40px, 8vw, 60px)' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(16px, 3vw, 24px)' }}>
            {/* Next Sacred Fast */}
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', boxShadow: 'var(--shadow-lg)', background: 'var(--surface)' }}>
               <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap' }}>
                      <span className="chip chip-accent">Next Sacred Fast</span>
                      <span style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: 'var(--ink-mid)', fontWeight: 600 }}>{formatDate(nearestData?.upcomingEkadashi?.Date || '')}</span>
                  </div>
                  <h2 className="display" style={{ fontSize: 'clamp(22px, 5vw, 32px)', color: 'var(--ink)' }}>{nearestData?.upcomingEkadashi?.Title || ''}</h2>
                  <div style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: 'var(--ink-muted)', marginTop: 8 }}>{nearestData?.upcomingEkadashi?.ShortDescription || ''}</div>
               </div>
               <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => router.push(nearestData?.upcomingEkadashi?.Slug ? `/ekadashi/${nearestData?.upcomingEkadashi?.Slug}` : '/')}>View Timings →</button>
            </div>
            
            {/* Festival Countdown */}
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)', boxShadow: 'var(--shadow-lg)', background: 'var(--bg-alt)' }}>
               <div>
                  <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--maroon)', width: '100%' }}>Major Festival Upcoming</div>
                  <h2 className="serif" style={{ fontSize: 'clamp(20px, 4vw, 24px)', color: 'var(--ink)', fontWeight: 600 }}>{nearestData?.upcomingFestival?.Title || ''}</h2>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: 'clamp(8px, 2vw, 12px)', textAlign: 'center' }}>
                  {[[d,'Days'],[h,'Hours'],[m,'Mins'],[s,'Secs']].map(([val, lbl], i) => (
                    <div key={i} style={{ background: 'var(--surface)', padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px)', borderRadius: 12, border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                      <div className="display" style={{ fontSize: 'clamp(18px, 4vw, 28px)', color: 'var(--maroon)', lineHeight: 1 }}>{String(val).padStart(2,'0')}</div>
                      <div style={{ fontSize: 'clamp(8px, 1.5vw, 10px)', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6, fontWeight: 700 }}>{lbl}</div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 2. Authenticity Section */}
      <div className="section-bg-pattern" style={{ padding: 'clamp(30px, 8vw, 40px) 0 clamp(50px, 8vw, 80px)', borderBottom: '1px solid var(--border-soft)' }}>
         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'clamp(30px, 5vw, 48px)', textAlign: 'center' }}>
                 {homeData?.TrustBadges?.map((badge: { id?: string; image: { url: string }; Heading?: string; Description?: string }) => (
                    <div key={badge?.id}>
                     <img src={badge?.image?.url ? badge?.image?.url : undefined} style={{ width: 'clamp(48px, 8vw, 64px)', height: 'clamp(48px, 8vw, 64px)', marginBottom: 'clamp(12px, 3vw, 20px)' }} alt="Badge"/>
                     <h3 className="serif" style={{ fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'clamp(8px, 2vw, 12px)' }}>{badge?.Heading || ''}</h3>
                     <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'var(--ink-mid)', lineHeight: 1.6 }}>{badge?.Description || ''}</p>
                    </div>
                 ))}
             </div>
         </div>
      </div>

      {/* 3. Tithi Trackers (Ekadashi, Purnima, Amavasya, Pradosh) */}
      <div className="container" style={{ padding: 'clamp(50px, 8vw, 80px) clamp(16px, 5vw, 40px) 0', position: 'relative', zIndex: 1 }}>
         <SectionHeader title="Sacred Lunar Days" sub="Track all upcoming observances based on your city's Panchang." />
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'clamp(12px, 3vw, 20px)', paddingTop: 10 }}>
            {lunarData?.map((t, idx) => (
              <div key={idx} className="card card-hover" style={{ borderTop: t.highlight ? '4px solid var(--accent)' : '1px solid var(--border)' }}>
                 <div className="bg-image-cover" style={{ height: 'clamp(70px, 15vw, 100px)', backgroundImage: `url(${t?.FeaturedImage?.url || ''})` }}></div>
                 <div style={{ padding: 'clamp(12px, 2vw, 16px) clamp(12px, 2vw, 20px)' }}>
                     <div className="eyebrow" style={{ marginBottom: 6, color: t.highlight ? 'var(--accent)' : 'var(--ink-muted)', fontSize: 'clamp(8px, 1.5vw, 10px)' }}>Nearest {t?.tag}</div>
                     <div className="serif" style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', fontWeight: 600, color: 'var(--ink)' }}>{t?.Title}</div>
                     <div style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: 'var(--ink-mid)', marginTop: 6, fontWeight: 500 }}>{formatDate(t?.Date || '')}</div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 4. Explore Temples (Immersive & Modern Layout) */}
      <div style={{ background: 'var(--ink)', color: 'var(--surface)', marginTop: 'clamp(60px, 10vw, 100px)', padding: 'clamp(50px, 8vw, 100px) 0' }}>
        <div className="container">
           <SectionHeader align="center" title={homeData?.FeaturedTemples?.heading || ''} sub={homeData?.FeaturedTemples?.description || ''} color="var(--surface)" action={<button onClick={() => {homeData?.FeaturedTemples?.Link?.isExternal ? handleExternalLink(homeData?.FeaturedTemples?.Link?.href) : router.push(homeData?.FeaturedTemples?.Link?.href || '/')}} className="btn btn-ghost" style={{borderColor: 'rgba(255,255,255,0.3)', color: '#fff'}}>{`${homeData?.FeaturedTemples?.Link?.label} →`}</button>} />
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(16px, 3vw, 24px)', marginTop: 'clamp(30px, 5vw, 48px)' }}>
              {homeData?.FeaturedTemples?.temples?.map((tmpl: { id?: number; FeaturedImage?: { url?: string }; featured?: boolean; Title?: string; Location?: string }) => (
                <div key={tmpl?.id} className="card card-hover" style={{ position: 'relative', background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url("${tmpl.FeaturedImage?.url || ''}") center/cover`, border: 'none', cursor: 'pointer', minHeight: 'clamp(200px, 30vw, 280px)', gridColumn: tmpl.featured ? 'span 1' : 'span 1', backgroundColor: 'grey' }}>
                   <div style={{ position: 'absolute', bottom: 'clamp(12px, 3vw, 20px)', left: 'clamp(12px, 3vw, 20px)' }}>
                      {tmpl.featured && <span className="chip" style={{ background: 'var(--accent)', color: '#fff', border: 'none', marginBottom: 8, display: 'inline-block', fontSize: 'clamp(10px, 2vw, 12px)' }}>Featured</span>}
                      <div className="serif" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 600, color: '#fff', marginBottom: 4 }}>{tmpl?.Title || ''}</div>
                      <div style={{ fontSize: 'clamp(12px, 2vw, 13px)', color: 'var(--gold-bright)', fontWeight: 500 }}>📍 {tmpl?.Location || ''}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 5. Custom UI: Hindu Festivals (Month-wise Timeline) */}
      <div className="container" style={{ padding: 'clamp(50px, 8vw, 80px) clamp(16px, 5vw, 40px) 0', position: 'relative', zIndex: 1 }}>
         <SectionHeader title="Hindu Festivals Calendar" sub="Month-wise breakdown of prominent Sanatan festivals." />
         <div style={{ display: 'flex', overflowX: 'auto', gap: 'clamp(12px, 3vw, 20px)', paddingBottom: 24, paddingTop: 5, scrollbarWidth: 'none' }}>
            {[
              { m: 'Chaitra', count: '5', active: true }, { m: 'Vaishakha', count: '3' }, 
              { m: 'Jyeshtha', count: '2' }, { m: 'Ashadha', count: '4' }, 
              { m: 'Shravana', count: '6' }, { m: 'Bhadrapada', count: '7' },
              { m: 'Ashvina', count: '4' }, { m: 'Kartika', count: '8' }
            ].map((month, idx) => (
               <div key={idx} style={{ 
                   minWidth: 'clamp(120px, 20vw, 140px)', textAlign: 'center', padding: 'clamp(16px, 3vw, 24px) clamp(12px, 2vw, 16px)', 
                   borderRadius: 100, border: month.active ? '2px solid var(--accent)' : '1px solid var(--border)',
                   background: month.active ? 'var(--accent-soft)' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.2s' 
               }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
                   <h3 className="serif" style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', color: month.active ? 'var(--accent)' : 'var(--ink)' }}>{month.m}</h3>
                   <p style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: 'var(--ink-muted)', marginTop: 4 }}>{month.count} Festivals</p>
               </div>
            ))}
         </div>
      </div>

      {/* 6. Custom UI: Vrat Katha (Book/List Layout) & Puja Vidhi (Step Cards) */}
      <div className="container" style={{ padding: 'clamp(50px, 8vw, 80px) clamp(16px, 5vw, 40px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(30px, 5vw, 48px)' }}>
         
         {/* Vrat Katha List */}
         <div>
            <SectionHeader title={homeData?.FeaturedVrats?.heading || ''} sub={homeData?.FeaturedVrats?.Description || ''} action={<button onClick={() => {homeData?.FeaturedVrats?.VratLink?.isExternal ? handleExternalLink(homeData?.FeaturedVrats?.VratLink?.href) : router.push(homeData?.FeaturedVrats?.VratLink?.href || '/')}} className="btn-link">{`${homeData?.FeaturedVrats?.VratLink?.label || ''} →`}</button>}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
               {homeData?.FeaturedVrats?.vrat_kathas?.map((katha: { id?: number; Slug: string; FeaturedImage?: { url?: string}; Title?: string; ShortDescription?: string }) => (
                 <div key={katha?.id} className="card card-hover katha-card" style={{ display: 'flex', width: '100%', padding: '12px 14px', alignItems: 'center', cursor: 'pointer', gap: '12px', textAlign: 'left' }}>
                    <div className="bg-image-cover" style={{ width: 72, height: 72, minWidth: 72, borderRadius: 12, backgroundImage: `url(${katha?.FeaturedImage?.url || ''})`, backgroundColor: 'grey', alignSelf: 'baseline' }}></div>
                    <div className="alignMobile" style={{ flex: 1 }}>
                       <h4 className="serif" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{katha?.Title}</h4>
                       <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.5 }}>{katha?.ShortDescription}</p>
                    </div>
                    <button onClick={() => router.push(`/vrat-katha/${katha?.Slug}`)} className="btn btn-ghost btn-sm" style={{ borderRadius: 100, whiteSpace: 'nowrap', padding: '8px 12px', alignSelf: 'flex-start' }}>Read 📖</button>
                 </div>
               ))}
            </div>
         </div>

         {/* Puja Vidhi Step Cards */}
         <div>
            <SectionHeader title={homeData?.FeaturedPujaVidhi?.Heading || ''} sub={homeData?.FeaturedPujaVidhi?.description || ''} action={<button onClick={() => {homeData?.FeaturedPujaVidhi?.PujaVidhiLink?.isExternal ? handleExternalLink(homeData?.FeaturedPujaVidhi?.PujaVidhiLink?.href) : router.push(homeData?.FeaturedPujaVidhi?.PujaVidhiLink?.href || '/')}} className="btn-link">{`${homeData?.FeaturedPujaVidhi?.PujaVidhiLink?.label || ''} →`}</button>}/>
            <div className="puja-grid" style={{ gap: 'clamp(16px, 2vw, 24px)' }}>
               {homeData?.FeaturedPujaVidhi?.puja_vidhis?.map((vidhi: { id?: number; FeaturedImage?: { url: string }; Title?: string }) => (
                 <div key={vidhi?.id} className="card card-hover puja-card" style={{ padding: 'clamp(20px, 2.5vw, 28px)', cursor: 'pointer', borderTop: '4px solid var(--maroon)', textAlign: 'center', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
                      <img src={vidhi?.FeaturedImage?.url ? vidhi?.FeaturedImage?.url : undefined} alt={vidhi?.Title} style={{ width: '85px', height: '85px', objectFit: 'cover', marginBottom: '8px' }} />
                      <h4 className="serif" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 600, marginBottom: 0 }}>{vidhi?.Title}</h4>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Home;

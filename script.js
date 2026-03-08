/**
 * script.js - GSAP Animations and Interactive Logic
 */

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // --------------------------------------------------------
    // 1. Register GSAP Plugins
    // --------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // --------------------------------------------------------
    // 2. Lenis Smooth Scroll Setup
    // --------------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Disable lag smoothing in GSAP to prevent any syncing issues with Lenis
    gsap.ticker.lagSmoothing(0);

    // --------------------------------------------------------
    // 3. Custom Cursor Logic
    // --------------------------------------------------------
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Fast tracking for the small dot
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Smooth trailing for the outer circle
    gsap.ticker.add(() => {
        // Linear interpolation for smooth trailing
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        gsap.set(follower, {
            x: followerX,
            y: followerY
        });
    });

    // Hover effects
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            follower.classList.add('hovering');
        });
        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            follower.classList.remove('hovering');
        });
    });

    // --------------------------------------------------------
    // 4. Initial Loader and Hero Animation Timeline
    // --------------------------------------------------------
    const tl = gsap.timeline();

    // Prevent body scroll during loader via CSS class manipulation (handled by Lenis pause normally, but this is safer)
    document.body.style.overflow = 'hidden';

    // Animate loading bar
    tl.to('.loader-bar', {
        width: '100%',
        duration: 1.5,
        ease: 'power3.inOut'
    })
    // Slide loader text up
    .to('.loader-text', {
        y: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in'
    }, "-=0.3")
    // Slide up the entire loader
    .to('.loader', {
        y: '-100%',
        duration: 1,
        ease: 'expo.inOut',
        onComplete: () => {
            document.body.style.overflow = '';
        }
    })
    // Hero Text Stagger (Split words reveal from clip mask)
    .to('.hero-title .word', {
        y: '0%',
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out'
    }, "-=0.5")
    // Fade in hero subtitle
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.8")
    // Fade in hero CTA buttons
    .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.8")
    // Fade in Navbar
    .fromTo('.navbar', {
        y: -50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, "-=1.2");

    // --------------------------------------------------------
    // 5. ScrollTrigger Animations
    // --------------------------------------------------------

    // Parallax effect on Hero Section
    gsap.to('.hero-container', {
        y: "30%", // Move down slower than scroll
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Bento Grid Reveal Cards
    const bentoCards = gsap.utils.toArray('.bento-card');
    
    bentoCards.forEach((card, i) => {
        gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%", // Trigger when top of card hits 85% down viewport
                toggleActions: "play none none reverse"
            }
        });
    });

    // Footer Reveal (Parallax clip reveal style)
    gsap.from('.footer-container', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.footer',
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });
});

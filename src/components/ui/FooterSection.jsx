import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FacebookIcon, FrameIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
	{
		label: 'Major Events',
		links: [
			{ title: 'Weddings', href: '/' },
			{ title: 'Concerts', href: '/' },
			{ title: 'Openings', href: '/' },
			{ title: 'Exhibitions', href: '/' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '/blog' },
			{ title: 'Changelog', href: '/changelog' },
			{ title: 'Brand', href: '/brand' },
			{ title: 'Help', href: '/help' },
		],
	},
	{
		label: 'Social Links',
		links: [
			{ title: 'Facebook', href: '#', icon: FacebookIcon },
			{ title: 'Instagram', href: '#', icon: InstagramIcon },
			{ title: 'Youtube', href: '#', icon: YoutubeIcon },
			{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
		],
	},
];

export function Footer() {
	return (
		<div
			className="w-full bg-neutral-950 border-t border-neutral-800"
			style={{
				pointerEvents: 'auto',
				position: 'relative',
				zIndex: 50,
				isolation: 'isolate',
			}}
		>
			<footer
				className="md:rounded-t-6xl relative w-full max-w-[1440px] xl:max-w-screen-2xl mx-auto flex flex-col items-center justify-center rounded-t-4xl px-4 md:px-12 lg:px-24 pt-12 lg:pt-16"
				style={{ paddingBottom: 'max(4rem, env(safe-area-inset-bottom, 0px) + 6rem)' }}
			>
				<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
					<AnimatedContainer className="space-y-4">
						<FrameIcon className="size-8 text-white" />
						<p className="text-neutral-400 mt-8 text-sm md:mt-0 font-sans">
							© {new Date().getFullYear()} Khushi Films. All rights reserved.
						</p>
					</AnimatedContainer>

					<div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[2.5fr_1fr_1fr_1fr_auto] xl:col-span-2 xl:mt-0 lg:gap-12">

						{/* ── CTA Column ──────────────────────────────────────────────────────
						 *
						 *  BUG 1 FIX (ROOT CAUSE — button was inside opacity:0 motion.div)
						 *  ─────────────────────────────────────────────────────────────────
						 *  The old code wrapped the <button> inside <AnimatedContainer> which
						 *  renders a motion.div starting at opacity: 0.
						 *
						 *  Both Safari/WebKit AND Chrome exclude elements from the pointer
						 *  hit-test tree when ANY ancestor has opacity: 0.  The button was
						 *  rendered on screen but the browser treated it as if it didn't
						 *  exist for click purposes.
						 *
						 *  <a href="#"> links worked because href triggers native browser
						 *  navigation which bypasses the JS event system entirely.
						 *  <button onClick> is pure JS — silently blocked.
						 *
						 *  FIX: button lives in a plain <div>, always at opacity:1.
						 *  Only the heading + paragraph text animate in.
						 * ────────────────────────────────────────────────────────────────── */}
						<div className="mb-10 md:mb-0" style={{ pointerEvents: 'auto' }}>

							<AnimatedContainer delay={0.1}>
								<h3
									className="text-2xl font-bold mb-4 text-white"
									style={{ fontFamily: "var(--font-primary, 'Playfair Display', serif)" }}
								>
									Let's Tell Your Story
								</h3>
								<p className="text-neutral-400 text-sm font-sans max-w-[280px] leading-relaxed">
									Every love story is beautiful, but yours deserves to be cinematic. Let our lens capture the unscripted magic, the hidden glances, and the joyous tears to craft a timeless masterpiece.
								</p>
							</AnimatedContainer>

						</div>

						{footerLinks.map((section, index) => (
							<AnimatedContainer key={section.label} delay={0.3 + index * 0.1}>
								<div className="mb-10 md:mb-0">
									<h3 className="text-xs font-semibold uppercase tracking-wider text-white">
										{section.label}
									</h3>
									<ul className="text-neutral-400 mt-4 space-y-2 text-sm font-sans">
										{section.links.map((link) => (
											<li key={link.title}>
												<a
													href={link.href}
													className="hover:text-white inline-flex items-center transition-all duration-300"
												>
													{link.icon && <link.icon className="me-2 size-4" />}
													{link.title}
												</a>
											</li>
										))}
									</ul>
								</div>
							</AnimatedContainer>
						))}

						<div className="mt-6 md:mt-0 flex items-start md:justify-end">
							<Link
								to="/booking"
								className="px-6 py-3 bg-white text-neutral-900 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap"
								style={{
									position: 'relative',
									zIndex: 100,
									pointerEvents: 'auto',
									display: 'inline-block',
								}}
							>
								Book Now
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

function AnimatedContainer({ className, delay = 0.1, children }) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={className} style={{ pointerEvents: 'auto' }}>
				{children}
			</div>
		);
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			// BUG 3 FIX: margin: '0px 0px -80px 0px'
			// whileInView uses IntersectionObserver. With Lenis + GSAP ScrollTrigger
			// both running, there is a frame-timing race where the observer fires at
			// exactly the wrong moment and never triggers the animation — leaving the
			// motion.div permanently at opacity:0 (and thus the button permanently
			// unclickable, per Bug 1). The -80px bottom margin makes the observer
			// fire 80px BEFORE the element enters the viewport, safely ahead of the race.
			viewport={{ once: true, margin: '0px 0px -80px 0px' }}
			transition={{ delay, duration: 0.8 }}
			className={className}
			// BUG 4 FIX: The pointer-events:none chain in ScrollAnimatedVideo
			// (Screen 1 wrapper, Screen 2 driver, headline div) can cascade into
			// children under certain rendering conditions even though Screen 3 resets
			// it to auto. Explicitly restoring it on every motion.div closes that gap.
			style={{ pointerEvents: 'auto' }}
		>
			{children}
		</motion.div>
	);
}
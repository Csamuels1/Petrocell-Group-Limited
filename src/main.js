import './styles.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronDown,
  Landmark,
  Mail,
  MapPin,
  MapPinned,
  Send,
  ShieldCheck,
  createIcons,
} from 'lucide'
import { encodeFormData, validateGroupEnquiry } from './form.js'

gsap.registerPlugin(ScrollTrigger)
createIcons({ icons: { ArrowDownRight, ArrowRight, ArrowUpRight, Award, ChevronDown, Landmark, Mail, MapPin, MapPinned, Send, ShieldCheck } })

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const header = document.querySelector('[data-header]')
const menuToggle = document.querySelector('.menu-toggle')
const menu = document.querySelector('.nav-menu')
const companiesMenu = document.querySelector('.companies-menu')
const companiesToggle = companiesMenu.querySelector('button')
const navLinks = [...document.querySelectorAll('[data-nav-link]')]

function closeCompaniesMenu() {
  companiesMenu.classList.remove('is-open')
  companiesToggle.setAttribute('aria-expanded', 'false')
}

function closeMenu() {
  menu.classList.remove('is-open')
  menuToggle.setAttribute('aria-expanded', 'false')
  menuToggle.setAttribute('aria-label', 'Open navigation menu')
  document.body.classList.remove('menu-open')
  closeCompaniesMenu()
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true'
  menu.classList.toggle('is-open', open)
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu')
  document.body.classList.toggle('menu-open', open)
})

companiesToggle.addEventListener('click', () => {
  const open = companiesToggle.getAttribute('aria-expanded') !== 'true'
  companiesMenu.classList.toggle('is-open', open)
  companiesToggle.setAttribute('aria-expanded', String(open))
})

document.addEventListener('click', (event) => {
  if (!companiesMenu.contains(event.target)) closeCompaniesMenu()
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})
navLinks.forEach((link) => link.addEventListener('click', closeMenu))

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 32)
window.addEventListener('scroll', updateHeader, { passive: true })
updateHeader()

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
  if (!visible) return
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${visible.target.id}`
    link.classList.toggle('is-active', active)
    if (active) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}, { rootMargin: '-30% 0px -55%', threshold: [0.05, 0.25, 0.5] })
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section))

let lenis
let rafId
if (!reducedMotion) {
  lenis = new Lenis({ duration: 1.35, smoothWheel: true })
  const raf = (time) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  lenis.on('scroll', ScrollTrigger.update)
}

function initAnimations() {
  const loader = document.querySelector('.loader')
  if (reducedMotion) {
    loader.remove()
    document.body.classList.add('is-ready')
    return
  }

  document.body.classList.add('is-loading')
  const intro = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      document.body.classList.remove('is-loading')
      document.body.classList.add('is-ready')
      loader.remove()
    },
  })
  intro
    .to('.loader__mark path', { strokeDashoffset: 0, duration: 1.7, stagger: .12 })
    .from('.loader p', { opacity: 0, y: 16, duration: .7 }, '-=.65')
    .to('.loader__line', { scaleX: 1, duration: .55 })
    .to('.loader', { opacity: 0, duration: .8, delay: .15 })
    .from('.hero__eyebrow', { opacity: 0, y: 24, duration: .8 }, '-=.25')
    .from('.hero h1 span, .hero h1 strong', { clipPath: 'inset(0 0 100% 0)', y: 55, duration: 1, stagger: .25 }, '-=.4')
    .from('.hero__rule', { scaleX: 0, transformOrigin: 'left', duration: .6 }, '-=.45')
    .from('.hero__lead, .hero__actions', { opacity: 0, y: 24, duration: .8, stagger: .18 }, '-=.35')

  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      y: 30,
      duration: 1.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 82%', once: true },
    })
  })

  gsap.from('.leadership__frame img', {
    scale: 1.05,
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.leadership__frame', start: 'top 78%', once: true },
  })

  document.querySelectorAll('[data-count]').forEach((counter) => {
    const state = { value: 0 }
    const target = Number(counter.dataset.count)
    const suffix = counter.dataset.suffix || ''
    gsap.to(state, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: counter, start: 'top 94%', once: true },
      onUpdate: () => { counter.textContent = `${Math.round(state.value)}${suffix}` },
    })
  })
}

window.addEventListener('load', initAnimations, { once: true })
document.addEventListener('visibilitychange', () => {
  if (!lenis) return
  if (document.hidden) lenis.stop()
  else lenis.start()
})
window.addEventListener('pagehide', () => {
  cancelAnimationFrame(rafId)
  sectionObserver.disconnect()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})

const enquiryType = document.querySelector('#enquiry-type')
const message = document.querySelector('#message')
document.querySelectorAll('[data-connect-link]').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu()
    enquiryType.value = 'Other'
    window.setTimeout(() => message.focus({ preventScroll: true }), reducedMotion ? 0 : 700)
  })
})

const form = document.querySelector('.group-form')
const formStatus = form.querySelector('.form-status')

function displayErrors(errors) {
  form.querySelectorAll('.form-field').forEach((field) => {
    const control = field.querySelector('input, select, textarea')
    const error = field.querySelector('.field-error')
    const messageText = errors[control.name] || ''
    field.classList.toggle('has-error', Boolean(messageText))
    control.setAttribute('aria-invalid', String(Boolean(messageText)))
    error.textContent = messageText
  })
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const formData = new FormData(form)
  const errors = validateGroupEnquiry(Object.fromEntries(formData.entries()))
  displayErrors(errors)
  formStatus.className = 'form-status'
  formStatus.textContent = ''

  if (Object.keys(errors).length) {
    formStatus.classList.add('is-error')
    formStatus.textContent = 'Please review the highlighted fields and try again.'
    form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus()
    return
  }

  const button = form.querySelector('button[type="submit"]')
  button.disabled = true
  button.querySelector('span').textContent = 'Sending to Group Office'
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(formData),
    })
    if (!response.ok) throw new Error('Submission failed')
    form.reset()
    displayErrors({})
    formStatus.classList.add('is-success')
    formStatus.textContent = 'Your enquiry has been received by the Group Office.'
  } catch {
    formStatus.classList.add('is-error')
    formStatus.innerHTML = 'We could not send your enquiry. Please retry or email <a href="mailto:group@petrocellgroup.com">group@petrocellgroup.com</a>.'
  } finally {
    button.disabled = false
    button.querySelector('span').textContent = 'Send to Group Office'
  }
})

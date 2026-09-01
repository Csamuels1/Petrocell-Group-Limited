// @vitest-environment jsdom

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const html = readFileSync(resolve('index.html'), 'utf8')
const document = new DOMParser().parseFromString(html, 'text/html')

describe('corporate site structure', () => {
  it('contains every required section and navigation destination', () => {
    const ids = ['home', 'about', 'companies', 'sectors', 'leadership', 'purpose', 'contact']
    ids.forEach((id) => {
      expect(document.querySelector(`#${id}`)).not.toBeNull()
      expect(document.querySelector(`[href="#${id}"]`)).not.toBeNull()
    })
  })

  it('uses the verified subsidiary routing rules', () => {
    const oilLinks = [...document.querySelectorAll('a[href^="https://petrocell-energy-resources-limited.netlify.app"]')]
    expect(oilLinks.length).toBeGreaterThanOrEqual(3)
    oilLinks.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
    })
    const connectLinks = [...document.querySelectorAll('[data-connect-link]')]
    expect(connectLinks.length).toBeGreaterThanOrEqual(3)
    connectLinks.forEach((link) => expect(link.getAttribute('href')).toMatch(/^#contact|#group-form$/))
    expect(html).not.toContain('petrocellconnect.com')
  })

  it('provides the complete Netlify group form contract', () => {
    const form = document.querySelector('form[name="petrocell-group-enquiry"]')
    expect(form?.getAttribute('data-netlify')).toBe('true')
    expect(form?.getAttribute('netlify-honeypot')).toBe('bot-field')
    ;['name', 'organisation', 'email', 'phone', 'enquiryType', 'message'].forEach((name) => {
      expect(form?.querySelector(`[name="${name}"]`)).not.toBeNull()
    })
  })

  it('includes all approved production assets', () => {
    const assets = [
      'public/assets/logo/petrocell-group-logo.png',
      'public/assets/logo/petrocell-group-icon.png',
      'public/assets/logo/petrocell-energy-resources-logo.png',
      'public/assets/logo/petrocell-connect-logo.png',
      'public/assets/images/chimezie-ifeanyi-samuel.webp',
      'public/assets/social/petrocell-group-og.jpg',
    ]
    assets.forEach((asset) => expect(existsSync(resolve(asset))).toBe(true))
  })

  it('does not publish placeholder or unsupported content', () => {
    const copy = document.body.textContent.toLowerCase()
    expect(copy).not.toContain('placeholder')
    expect(copy).not.toContain('coming soon')
    expect(copy).not.toContain(['petrocell', 'oil', 'and', 'gas', 'limited'].join(' '))
    expect(copy).not.toContain(['petrocell', 'oil', '&', 'gas'].join(' '))
    expect(copy).not.toContain('© 2025')
  })
})

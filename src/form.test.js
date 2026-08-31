import { describe, expect, it } from 'vitest'
import { encodeFormData, validateGroupEnquiry } from './form.js'

describe('group enquiry helpers', () => {
  it('returns errors for every missing required field', () => {
    expect(validateGroupEnquiry({})).toEqual({
      name: 'Enter your full name.',
      organisation: 'Enter your organisation.',
      email: 'Enter your email address.',
      enquiryType: 'Select an enquiry type.',
      message: 'Enter your message.',
    })
  })

  it('rejects malformed email addresses', () => {
    expect(validateGroupEnquiry({ name: 'Ada', organisation: 'FieldCo', email: 'invalid', enquiryType: 'Partnership', message: 'Hello' }).email).toBe('Enter a valid email address.')
  })

  it('accepts and encodes a complete enquiry for Netlify', () => {
    const values = { name: 'Ada', organisation: 'FieldCo', email: 'ada@example.com', enquiryType: 'Partnership', message: 'Hello' }
    expect(validateGroupEnquiry(values)).toEqual({})
    const data = new FormData()
    data.append('form-name', 'petrocell-group-enquiry')
    data.append('name', 'Ada Okafor')
    expect(encodeFormData(data)).toContain('form-name=petrocell-group-enquiry')
    expect(encodeFormData(data)).toContain('name=Ada+Okafor')
  })
})

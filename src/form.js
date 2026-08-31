export function validateGroupEnquiry(values) {
  const errors = {}
  if (!values.name?.trim()) errors.name = 'Enter your full name.'
  if (!values.organisation?.trim()) errors.organisation = 'Enter your organisation.'
  if (!values.email?.trim()) errors.email = 'Enter your email address.'
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.enquiryType?.trim()) errors.enquiryType = 'Select an enquiry type.'
  if (!values.message?.trim()) errors.message = 'Enter your message.'
  return errors
}

export function encodeFormData(formData) {
  return new URLSearchParams(formData).toString()
}

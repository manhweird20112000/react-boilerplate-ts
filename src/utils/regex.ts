export function regexPassword (value: string): boolean {
  const pattern = /\/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$\//
  return pattern.test(value)
}

export function isPhoneNumberVietnam (value: string): boolean {
  const pattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
  return pattern.test(value)
}


export function regexURL (value: string): boolean {
  const pattern = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
  return pattern.test(value)
}

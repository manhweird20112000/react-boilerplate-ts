class ValidatorService {
  isEmail(val: string) {
    const pattern = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    return pattern.test(val)
  }

  isLink(val: string) {
    const pattern = new RegExp(
      '(http(s)?:\\\\/\\\\/.)?(www\\\\.)?[-a-zA-Z0-9@:%._\\\\+~#=]{2,256}\\\\.[a-z]{2,6}\\\\b([-a-zA-Z0-9@:%_\\\\+.~#?&=]*)'
    )
    return pattern.test(val)
  }

  isUsername(val: string) {
    const pattern = new RegExp('^[A-Za-z0-9_. ]+$')
    return pattern.test(val)
  }
}

export const Validator = new ValidatorService()

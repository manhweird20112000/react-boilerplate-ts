export class Rules {
  isRequired(message: string) {
    return {
      required: true,
      message,
      trigger: "blur",
    };
  }

  isEmail(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        const pattern = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
        if (value) {
          if (value && pattern.test(value)) {
            callback();
          } else {
            callback(new Error(rule.message));
          }
        } else {
          callback();
        }
      },
      message,
      trigger: "blur",
    };
  }

  isLink(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        const pattern = new RegExp(
          "(http(s)?:\\/\\/.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&=]*)"
        );
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error(rule.message));
        }
      },
      message,
      trigger: "blur",
    };
  }

  isLinkYoutube(message: string) {
    return {
      validator: (rule: any, value: string, cb: any) => {
        const pattern = new RegExp(
          "^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$"
        );

        if (value && !pattern.test(value)) {
          cb(new Error(rule.message));
        } else {
          cb();
        }
      },
      message,
      trigger: "blur",
    };
  }

  isLinkVimeo(message: string) {
    return {
      validator: (rule: any, value: string, cb: any) => {
        const pattern = new RegExp(
          "(http|https)?:\\/\\/(www\\.)?vimeo.com\\/(?:channels\\/(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|)(\\d+)(?:|\\/\\?)"
        );

        if (value && !pattern.test(value)) {
          cb(new Error(rule.message));
        } else {
          cb();
        }
      },
      message,
      trigger: "blur",
    };
  }

  rulePassword(message: string) {
    return {
      validator: (rule: any, value: any, callback: any) => {
        const pattern = /^[\x20-\x7E]+$/;
        if (value) {
          if (
            value &&
            value.length >= 6 &&
            value.length <= 20 &&
            pattern.test(value)
          ) {
            callback();
          } else {
            callback(new Error(rule.message));
          }
        } else {
          callback();
        }
      },
      message,
      trigger: "blur",
    };
  }

  isPhoneNumber(message: string) {
    return {
      validator: (_rule: any, value: any, callback: any) => {
        const regex = /^(0{1}\d{1,4}-{0,1}\d{1,4}-{0,1}\d{4})$/;
        if (!regex.test(value)) {
          callback(new Error(message));
        } else {
          callback();
        }
      },
      message,
      trigger: "blur",
    };
  }

  isPostCode(message: string) {
    return {
      validator: (rule: any, value: any, cb: any) => {
        const postcode = Number(value.replaceAll("-", ""));
        if (!value) {
          cb();
        } else if (value && !isNaN(postcode)) {
          cb();
        } else {
          cb(new Error(rule.message));
        }
      },
      message,
      trigger: "blur",
    };
  }

  postCodeLength(message: string) {
    return {
      validator: (rule: any, value: any, cb: any) => {
        const postcode = Number(value.replaceAll("-", ""));
        if (!value) {
          cb();
        } else if (value && !isNaN(postcode) && String(postcode).length === 7) {
          cb();
        } else {
          cb(new Error(rule.message));
        }
      },
      trigger: "blur",
      message,
    };
  }
}

export const RuleService = new Rules();

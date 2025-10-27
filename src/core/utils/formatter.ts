// import utc from 'dayjs/plugin/utc'

// dayjs.extend(utc)

/**
 * Service for formatting various data types
 */
class FormatterService {
  /**
   * Formats a number as a coin value with appropriate decimals
   * @param value - The number to format
   * @param digits - Number of decimal places to keep
   * @returns Formatted string representation of the number
   */
  formatCoin(value: number, digits = 2): string {
    if (value === undefined || value === null || isNaN(value)) {
      return "0";
    }

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: digits,
    }).format(value);
  }

  /**
   * Converts an error object with arrays to a simplified format
   * @param data - Record with error arrays
   * @returns Record with first error message for each key
   */
  formatErrors(data: Record<string, string[]>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key in data) {
      const errors: string[] = data[key] || [];
      if (errors.length > 0) {
        result[key] = errors[0];
      }
    }
    return result;
  }

  /**
   * Truncates a string and adds ellipsis
   * @param value - The string to truncate
   * @param maxLength - Maximum characters to keep
   * @param type - Where to apply the truncation
   * @returns Truncated string with ellipsis
   */
  ellipsis(
    value: string,
    maxLength = 5,
    type: "tail" | "mesial" = "tail"
  ): string {
    if (!value) {
      return "";
    }

    switch (type) {
      case "tail":
        return value.length > maxLength
          ? value.substring(0, maxLength) + "..."
          : value;
      case "mesial":
        return value.length > maxLength * 2
          ? value.substring(0, maxLength) + "..." + value.slice(-maxLength)
          : value;
      default:
        return value.substring(0, maxLength);
    }
  }

  formatPostCodeJP(val: string) {
    const digits = val.replace(/\D/g, "");

    if (digits.length !== 7) return val;

    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  /**
   * Recursively flattens an array of objects with nested children
   * @param arr - Array of objects with children property
   * @returns Flattened array containing all items and their nested children
   */
  flattenArray(arr: { children: any[] }[]): any[] {
    const result: any[] = [];

    for (const item of arr) {
      result.push(item);

      if (item.children && item.children.length > 0) {
        result.push(...this.flattenArray(item.children));
      }
    }

    return result;
  }

  /**
   * Converts UTC time to local time format
   * @param value - UTC time string
   * @returns Formatted local time string
   */
  // timeLocal(value: string): string {
  //   if (!value) {
  //     return ''
  //   }
  //   return dayjs.utc(value, 'YYYY-MM-DD HH:mm:ss').local().format('YYYY/MM/DD HH:mm:ss')
  // }
}

export const Formatter = new FormatterService();

class HelperService {
  copyText = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        this.unsecuredCopyToClipboard(text);
      });
    }
  };

  unsecuredCopyToClipboard = (text: any) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  };

  isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  getDaysInMonth = (year: number, month: number): number => {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return 31;
    }

    if ([4, 6, 9, 11].includes(month)) {
      return 30;
    }

    if (month === 2) {
      return this.isLeapYear(year) ? 29 : 28;
    }

    return 31;
  };

  getParamsHash(url: string) {
    const pattern = /\/([a-zA-Z0-9]+)\?/;

    return pattern.exec(url) ? pattern.exec(url)?.[0] : "";
  }

  getVimeoID(url: string): string {
    const pattern =
      /(?:http:|https:|)\/\/(?:player.|www.)?vimeo\.com\/(?:video\/|embed\/|watch\?\S*v=|v\/)?(\d*)/;
    const match = url.match(pattern);
    return match ? match[1] || "" : "";
  }

  getYouTubeVideoId(url: string): string {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] || "" : "";
  }

  getGoogleDriveVideoId(url: string): string {
    const regex = /(?:file\/d\/|open\?id=|folders\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] || "" : "";
  }

  getFileNameInUrl(url: string): string {
    return url.split("/").pop() || "";
  }

  getVideoType(url: string): string {
    if (/youtube\.com|youtu\.be/.test(url)) {
      return "youtube";
    } else if (/vimeo\.com/.test(url)) {
      return "vimeo";
    } else if (/drive\.google\.com/.test(url)) {
      return "googleDrive";
    }
    return "source";
  }

  getEmbedVideoURL(url: string): string {
    const videoType = this.getVideoType(url);
    const hash = this.getParamsHash(url)?.replace("/", "").replace("?", "");
    switch (videoType) {
      case "youtube":
        return `https://www.youtube.com/embed/${this.getYouTubeVideoId(url)}`;
      case "vimeo":
        return `https://player.vimeo.com/video/${this.getVimeoID(
          url
        )}?h=${hash}`;
      case "googleDrive":
        return `https://drive.google.com/file/d/${this.getGoogleDriveVideoId(
          url
        )}/preview`;
      default:
        return url;
    }
  }
}

export const Helper = new HelperService();



export const localeMessages = {
  en: {
    welcome: 'Welcome'
  },
  ja: {
    welcome: 'ようこそ'
  }
}

export function getMessages(lang: string) {
  const messages = localeMessages[lang || 'en']

  return (key:string) => {
    return messages[key]
  }
}

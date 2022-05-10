import PinIn, { defaultDict } from 'pinin'

export const pinin = new PinIn({
  dict: defaultDict,
  fuzzy: [
    'sh|s',
    'ch|c',
    'zh|z',
    'u|v',
    'ang|an',
    'eng|en',
    'ing|in',
    'an>a',
    'ang>a',
    'ai>a',
    'ao>a',
    'ou>o',
    'ong>o',
    'en>e',
    'eng>e',
    'ei>e',
    'er>e',
    'er>r',
    'ui>u',
    'un>u',
    'vn>v',
  ],
})

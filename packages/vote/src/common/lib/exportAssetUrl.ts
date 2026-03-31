export function getExportAssetUrl(url: string): string {
  if (!url) return ''
  if (import.meta.env.DEV) {
    if (url.includes('asset.lilywhite.cc')) {
      return url.replace('https://asset.lilywhite.cc', '/th-assets')
    }
    if (url.includes('static.thwiki.cc')) {
      return url.replace('https://static.thwiki.cc', '/thwiki-assets')
    }
  }
  return url
}

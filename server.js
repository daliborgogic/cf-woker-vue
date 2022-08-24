import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import { renderHeadToString } from '@vueuse/head'

function renderPreloadLinks(modules, manifest) {
  let links = ''
  const seen = new Set()
  modules.forEach(id => {
    const files = manifest[id]
    if (files) {
      files.forEach(file => {
       seen.add(file)
          const filename = file.split(/[\\/]/).pop()
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
      })
    }
  })
  return links
}

function renderPreloadLink(file) {
  if (file.endsWith('.js')) {
    return `<${file}>; rel=preload; as=script; crossorigin, `
  } else if (file.endsWith('.css')) {
    return `<${file}>; rel=preload; as=style`
  } else {
    // TODO
    return ''
  }
}

export async function render(url, manifest, template) {
  const { app, router, head } = createApp()

  router.push(url)
  await router.isReady()
  
  const ctx = {}
  const appHtml = await renderToString(app, ctx) 
  const { headTags } = renderHeadToString(head)
  const response = template.replace('<!--head-->', headTags).replace('<!--app-->', appHtml)
  const link = renderPreloadLinks(ctx?.modules, manifest)

  return [response, link]
}

import { validate } from './lib/api'
import { html, Action, CleanEvent } from './lib/utils'
import createUploadID from './components/UploadID'
import styles from './styles.css'

interface options {
  container: HTMLElement,
  apiKey: string
}

const defaultOptions = {
  container: document.querySelector('body') as HTMLElement,
}

class shappess {
  config: options
  el: HTMLElement = document.createElement('div')
  events: Array<CleanEvent> = []
  
  constructor (opts: options) {
    if (!opts.hasOwnProperty('apiKey')) {
      console.error('missing apiKey')
    }
    this.config = Object.assign({}, defaultOptions, opts)
    this.el.classList.add(styles.shappes)
    this.onStart()
  }

  private async onStart () {
    const isValid = await validate(this.config.apiKey)
    if (isValid) {
      createUploadID(this.render.bind(this))
    } else {
      this.render(html`
        <div class="${styles.error}">
          invalid API Key
        </div>
      `)
    }
  }

  private cleanEvents (): void {
    this.events.forEach(clear => clear())
  }

  private render (innerHTML: string, action?: Action) {
    this.cleanEvents()
    this.el.innerHTML = innerHTML
    this.config.container.innerHTML = ''
    this.config.container.appendChild(this.el)
    const event = action && action()

    if (event) {
      if(Array.isArray(event)) {
        this.events = [...this.events, ...event]
      }else {
        this.events.push(event)
      }
    }
  }
}

export default shappess

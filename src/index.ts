
import styles from './styles.css'

interface options {
  container: HTMLElement
  apiKey?: string
} 

const options: options = {
  container: document.querySelector('body') as HTMLElement
}

class shappess {
  config: options
  el: HTMLElement = document.createElement('div')
  
  constructor (opts: options) {
    if (!opts.hasOwnProperty('apiKey')) {
      console.error('missing apiKey')
    }
    this.config = Object.assign(options, opts)
    this.render()
  }

  render () {
    this.el.innerText = 'works!!!'
    this.el.classList.add(styles.shappes)
    this.config.container.appendChild(this.el)
  }
}

export default shappess

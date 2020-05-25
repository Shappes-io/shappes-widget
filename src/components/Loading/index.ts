import { html, createEvent, qs, Render } from '../../lib/utils'
import createUpload from '../UploadID'
import styles from './styles.css'

interface Props {
  title: string
}

export default function createCounter (render: Render, props?: Props): void {
  const action = () => {
    const backEv = createEvent(qs(`.${styles.loding} a`), 'click', (ev) => {
      ev.preventDefault()
      createUpload(render)
    })

    return [backEv]
  }
  
  render(html`
    <div class="${styles.loding}">
      <div class="${styles.loader}"></div>
      <h1>${props?.title}</h1>
      <a href="#">Back</a>
    </div>
  `, action)
}

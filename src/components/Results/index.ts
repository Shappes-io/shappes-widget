import { html, createEvent, qs, Render } from '../../lib/utils'
import { sendVideoResponse } from '../../lib/api'
import createUploadID from '../UploadID'
import styles from './styles.css'

interface Props {
  result: sendVideoResponse
}

export default function createCounter (render: Render, props?: Props): void {
  const action = () => {
    const backEv = createEvent(qs(`.${styles.loding} a`), 'click', (ev) => {
      ev.preventDefault()
      createUploadID(render)
    })

    return [backEv]
  }

  render(html`
    <div class="${styles.loding}">
      <div>The session: ${props?.result.session}</div>
      <div>is ${props?.result.isValid ? 'Valid' : 'Invalid'}</div>
      <div>Fece match: ${props?.result.match}</div>
      <div>The phrase is: ${props?.result.text}</div>
      <p>
        <a href="#">Start new process</a>
      </p>
    </div>
  `, action)
}

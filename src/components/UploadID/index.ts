import { html, createEvent, qs, Render } from '../../lib/utils'
import { sendID, sendIDResponse } from '../../lib/api'
import CreateUploadVideo from '../UploadVideo'
import createLoading from '../Loading'
import styles from './styles.css'

interface Props {
  error?: string|null
}

const empty = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export default function createUploadID (render: Render, props?: Props): void {
  const action = () => {
    const img = qs(`.${styles.formView} img`) as HTMLImageElement
    const input = qs(`.${styles.formView} input[type=file]`) as HTMLInputElement
    const onFileChange = createEvent(input, 'change', () => {
      let file = input.files && input.files[0];
      let blobURL = URL.createObjectURL(file);
      img.src = blobURL
    })

    const form = qs(`.${styles.formView} form`)
    const onSubmit = createEvent(form, 'submit', (evt: Event) => {
      evt.preventDefault()
      createLoading(render, {
        title: 'Validation may take a few seconds'
      })
      const file = input.files && input.files[0]
      file && sendID(file).then((res) => {
        console.debug(res)
        const [err, data] = res as [any, sendIDResponse]
        if (err) return createUploadID(render, { error: 'Invalid Image' })
        if(data.isValid) {
          CreateUploadVideo(render)
        } else {
          createUploadID(render, { error: 'The image is not valid ID' })
        }
      })
    })
    
    return [onSubmit, onFileChange]
  }

  // conditional render
  // const errorBox = props?.error && html`
  //   <div class="${styles.error}">
  //     ${props.error}
  //   </div>
  // `

  render(html`
    <div class="${styles.formView}">
      <div class="${styles.error}">
        ${props?.error}
      </div>
      <div class="${styles.center}">
        <img src="${empty}" alt="preview id">
      </div>
      <form id="__shappes-uplodaID">
        <input type="file" required>
        <input type="submit" value="Upload">
      </form>
    </div>
  `, action)
}

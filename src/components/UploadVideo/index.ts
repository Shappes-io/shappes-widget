import { html, createEvent, qs, Render } from '../../lib/utils'
import { sendVideo, sendVideoResponse } from '../../lib/api'
import createLoading from '../Loading'
import createResults from '../Results'
import styles from './styles.css'

interface Props {
  error?: string|null
}

export default function createUploadVideo (render: Render, props?: Props): void {
  const action = () => {
    const img = qs(`.${styles.formView} video`) as HTMLVideoElement
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
      file && sendVideo(file).then((res) => {
        console.debug(res)
        const [err, data] = res as [any, sendVideoResponse]
        if (err) return createUploadVideo(render, { error: 'Invalid Video' })
        if(data.isValid) {
          createResults(render, {
            result: data
          })
        } else {
          createUploadVideo(render, { error: 'This video is not valid' })
        }
      })
    })
    
    return [onSubmit, onFileChange]
  }

  render(html`
    <div class="${styles.formView}">
      <div class="${styles.error}">
        ${props?.error}
      </div>
      <div class="${styles.center}">
        <video alt="preview id" controls>
      </div>
      <form id="__shappes-uplodaID">
        <input type="file" required>
        <input type="submit" value="Upload">
      </form>
    </div>
  `, action)
}

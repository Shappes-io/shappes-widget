import { to, resolve } from './utils'

interface req {
  method?: string,
  key: string,
  headers?: Object
  body?: any
}

interface res {
  statusCode?: number
  status?: string,
  data?: object
}

const options = {
  method: 'GET'
}

const state = {
  safekey: '',
  session: ''
}

const base: string = 'http://localhost:3030'
const safeStatus: Array<number> = [200, 201]

async function request (url: string, ops?: req) {
  const conf: req = Object.assign({}, options, ops)
  const requestConf = {
    method: conf.method,
    headers: Object.assign({
      'x-api-key': conf.key
    }, ops?.headers as Headers),
    body: ops?.body
  }
  console.log(requestConf)
  const response = await fetch(base + url, requestConf)

  const data: res = await response.json()

  if (data.statusCode && data.statusCode === 500) {
    throw new Error('Invalid API-KEY')
  }

  if (data.statusCode && !safeStatus.includes(data.statusCode)) {
    throw new Error('Invalid Request')
  }

  return data
}

export async function validate (key: string): Promise<boolean> {
  const [err] = await to(request('/validate', { key }))
  if (err == null) {
    state.safekey = key
  }
  
  return err == null
}

export interface sendIDResponse {
  session: string,
  isValid: boolean
}

export async function sendID (file: File): Promise<resolve> {
  const body = new FormData()
  body.append('front', file)
  const options: req = {
    key: state.safekey,
    method: 'POST',
    body: body
  }

  const [err, data] = await to(request('/entity/upload/id', options)) as [any, sendIDResponse]

  if(data) {
    state.session = data.session
  }

  return [err, data]
}

export interface sendVideoResponse {
  "session": string,
  "isValid": boolean,
  "match": number,
  "text": string
}

export async function sendVideo (file: File): Promise<resolve> {
  const body = new FormData()
  body.append('front', file)
  const options: req = {
    key: state.safekey,
    method: 'POST',
    body: body
  }

  const [err, data] = await to(request(`/entity/upload/video?session=${state.session}`, options)) as [any, sendVideoResponse]
  return [err, data]
}

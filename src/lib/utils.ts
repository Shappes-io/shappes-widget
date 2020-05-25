export interface resolve extends Array<Error|any>{0:Error|null; 1?:any}
export type EventCallback = (ev: Event) => void
export type CleanEvent = () => void
export type Render = (innerHTML: string, action?: Action) => void
export type Action = () => CleanEvent|Array<CleanEvent>|void

export async function to (promise: Promise<any>): Promise<resolve> {
  try {
    const data = await promise;
    return [null, data];
  }
  catch (err) {
    console.debug(err)
    return [err];
  }
}

export function html (template: TemplateStringsArray, ...args: Array<any>): string {
  return template.reduce((acc, currentString, index) => {
    return acc + currentString + (args[index] || "")
  },"")
}

export function createEvent <K extends keyof DocumentEventMap>(el: HTMLElement, on: K, cb: EventCallback): CleanEvent {
  el.addEventListener(on, cb)
  const cleanEvent = () => el.removeEventListener('click', cb)
  return cleanEvent
}

export const qs = (el: any): HTMLElement => document.querySelector(el)

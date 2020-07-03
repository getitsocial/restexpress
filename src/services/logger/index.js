import bugsnag from '@bugsnag/js'

// Use whatever logging solution you prefer here
export const log = (error) => {
    bugsnag.notify(error)
}
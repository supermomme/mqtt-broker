const crypto = require('crypto')
const gravatarUrl = 'https://s.gravatar.com/avatar'
const size = '180'

module.exports = () => {
  return async hook => {
    if (Array.isArray(hook.result.data)) {
      hook.result.data.forEach(n => {
        if(n.email != undefined) n.avatarUrl = getGravatarUrlByEmail(n.email)
      })
    } else {
      if(hook.result.email != undefined) hook.result.avatarUrl = getGravatarUrlByEmail(hook.result.email)
    }
    return hook
  }
}

function getGravatarUrlByEmail (email) {
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
  return `${gravatarUrl}/${hash}?s=${size}`
}

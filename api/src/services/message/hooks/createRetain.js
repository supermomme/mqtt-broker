module.exports = () => {
  return async hook => {
    if (hook.result.retain === false) return hook;
    try {
      let existRet = await hook.app.service('message-retain').find({
        query: {
          topic: hook.result.topic,
          $limit: 1
        },
      })
      if (existRet.total === 0) {
        await hook.app.service('message-retain').create({
          messageId: hook.result._id,
          topic: hook.result.topic
        })
      } else {
        await hook.app.service('message-retain').patch(existRet.data[0]._id, {
          messageId: hook.result._id,
          topic: hook.result.topic
        })
      }
      console.log(existRet)
    } catch (error) {
      console.error(error)
    } 
    return hook
  }
}
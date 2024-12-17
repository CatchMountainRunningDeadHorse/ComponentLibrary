const checkingResult = {
  /**
   * realname:true/false
   * idnumber:true/false
   * ...
   */
}

let oSubmitBtn = null

export function createForm(info) {
  oSubmitBtn = document.querySelector(info.confirm)
  createFormCheck(info)
}

function createFormCheck(info) {
  for (let key in info) {
    let el = document.getElementsByName(key)
    if (Object.prototype.hasOwnProperty.call(info[key], 'value')) {
      checkingResult[key] = false
    }
    if (!el.length) continue

    if (el.length === 1) {
      // input[text]  select  textarea
      createSimpleFormElement(el[0], info[key])
    } else {
      //radio checkbox
      createComplexFormElement(el, info[key])
    }
  }

  oSubmitBtn.addEventListener('click', (e) => handleSubmit(e, info), false)
}

function createSimpleFormElement(el, info) {
  const tagName = el.tagName.toLowerCase()
  const event = tagName === 'select' ? 'change' : 'input'
  el.addEventListener(event, (e) => handleInput(e, info), false)
}

function createComplexFormElement(collection, info) {
  collection.forEach((el) => {
    el.addEventListener('change', (e) => handleInput(e, info), false)
  })
}

function handleSubmit(e, info) {
  e.preventDefault()

  const _info = {}

  for (let k in info) {
    if (Object.prototype.hasOwnProperty.call(info[k], 'value')) {
      _info[k] = info[k].value
    }
  }
  info.submit(_info)
}

function handleInput(e, info) {
  const { value, name, oIcon, oWarn } = getElements(e)
  if (e.target.type === 'checkbox') {
    if (e.target.checked) {
      info.value = [...info.value, value]
    } else {
      info.value = info.value.filter((v) => v !== value)
    }
  } else {
    info.value = value
  }
  const isPass = info.regular(info.value)
  checkingResult[name] = isPass

  oIcon.style.display = isPass ? 'inline-block' : 'none'
  oWarn.innerText = isPass ? '' : info.mark
  typeof info.listener === 'function' && info.listener(info)

  getCheckingResult()
}

function getElements(e) {
  const tar = e.target
  const { value, name } = tar
  const parentNode = tar.parentNode
  const oIcon = parentNode.querySelector('.fa')
  const oWarn = parentNode.querySelector('.warn')

  return {
    value,
    name,
    oIcon,
    oWarn
  }
}

function getCheckingResult() {
  for (let key in checkingResult) {
    if (!checkingResult[key]) {
      oSubmitBtn.setAttribute('disabled', true)
      return false
    }
  }

  oSubmitBtn.removeAttribute('disabled')

  return true
}

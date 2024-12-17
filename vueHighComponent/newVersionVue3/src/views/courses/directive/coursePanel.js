export default {
  mounted(el, bingings) {
    const oRemoveBtn = el.querySelector('.remove-btn')
    const { cellData, weekday, timeSlot } = bingings.value

    oRemoveBtn.addEventListener('click', handleRemovePanel, false)

    function handleRemovePanel() {
      delete cellData[`${weekday}-${timeSlot}`]
    }
  }
}

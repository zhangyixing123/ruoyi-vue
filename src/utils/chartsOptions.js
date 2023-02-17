export function renderOptions(name, legendArr, data) {
  return {
    color: [
      '#5B9BD5',
      '#ED7D31',
      '#FFC000',
      '#4472C4',
      '#a156C4',
      '#845475',
      '#60b5f8',
      '#68f7c7',
      '#822ed1',
      '#ce702d',
      '#c93250',
      '#696969',
    ],
    tooltip: {
      trigger: 'item',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      left: 'center',
      data: legendArr,
    },
    series: [
      {
        name,
        type: 'pie',
        radius: '55%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          normal: {
            formatter(v) {
              let text = `${v.name}`
              let value = ''
              if (text.length <= 8) {
                value = text
              } else if (text.length > 6 && text.length <= 12) {
                value = text = `${text.slice(0, 6)}\n${text.slice(6)}`
              } else if (text.length > 12 && text.length <= 18) {
                value = text = `${text.slice(0, 6)}\n${text.slice(6, 12)}\n${text.slice(12)}`
              } else if (text.length > 18 && text.length <= 24) {
                value = text = `${text.slice(0, 6)}\n${text.slice(6, 12)}\n${text.slice(
                  12,
                  18
                )}\n${text.slice(18)}`
              } else if (text.length > 24) {
                value = text = `${text.slice(0, 6)}\n${text.slice(6, 12)}\n${text.slice(
                  12,
                  18
                )}\n${text.slice(18, 24)}\n${text.slice(24)}`
              }
              return `${value}\n(${v.percent}%)`
            },
            textStyle: {
              fontWeight: 'normal',
              fontSize: 13,
            },
          },
        },
      },
    ],
  }
}

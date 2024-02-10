const msg = {
  name: {
    value: 'as',
    hi: {
      foo: 'foo',
    },
  },
  test: 'test value',
}

// Object.entries(msg).map(([key, value]) => {
//   console.log(key, value)
//   if(typeof value === 'string') {

//   }
// })

const keys = [...Object.entries(msg)]
const res = []

for (let i = 0; i < keys.length; i++) {
  const [key, value] = keys[i]

  if (typeof value === 'string') {
    // @ts-expect-error
    res.push(keys[i])
  }
  else {
    // @ts-expect-error
    const as = Object.entries(value).map(([k, v]) => {
      return [`${key}.${k}`, v]
    })

    keys.push(...as)
  }
}

const m = new Map(res)
console.log(m.get('test'))
